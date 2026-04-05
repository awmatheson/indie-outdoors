import { useEffect, useState, useMemo } from 'react';
import { Box, Container, Typography, Grid, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as d3 from 'd3';
import { colors, fonts, getOwnershipColor, getOwnershipLabel, isBCorp, slugify } from '../theme';

interface CompanyData {
  Company: string;
  'Business Category': string;
  'Main Sport Focus': string;
  'Year Founded': string;
  Financials: string;
  'Ownership Status': string;
  'Ownership Details': string;
  'Parent Company': string;
  Headquarters: string;
  'Main Manufacturing': string;
  'Environmental & Sustainability Policies': string;
  'Acquisition History': string;
}

type OwnershipFilter = 'all' | 'independent' | 'pe' | 'public' | 'employee';
type SortOption = 'name' | 'founded' | 'ownership';

const OWNERSHIP_FILTER_OPTIONS: { value: OwnershipFilter; label: string; color: string }[] = [
  { value: 'all', label: 'All', color: colors.textSecondary },
  { value: 'independent', label: 'Independent', color: colors.independent },
  { value: 'employee', label: 'Employee-Owned', color: colors.employeeOwned },
  { value: 'pe', label: 'PE-Owned', color: colors.peOwned },
  { value: 'public', label: 'Public / Subsidiary', color: colors.conglomerate },
];

function matchesOwnershipFilter(status: string, filter: OwnershipFilter): boolean {
  if (filter === 'all') return true;
  const s = status?.toLowerCase() ?? '';
  if (filter === 'independent') {
    return s.includes('family') || s.includes('independent') || s.includes('founder') || (s.includes('private') && !s.includes('equity') && !s.includes('employee') && !s.includes('pe'));
  }
  if (filter === 'employee') return s.includes('employee') || s.includes('esop');
  if (filter === 'pe') return s.includes('pe') || s.includes('private equity') || s.includes('capital partners') || s.includes('altamont') || s.includes('holding');
  if (filter === 'public') return s.includes('public') || s.includes('subsidiary');
  return true;
}

export default function Directory() {
  const [data, setData] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ownershipFilter, setOwnershipFilter] = useState<OwnershipFilter>('all');
  const [_categoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [bcorpOnly, setBcorpOnly] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = import.meta.env.BASE_URL;
        const csvPath = baseUrl === '/' ? '/companies.csv' : `${baseUrl}companies.csv`;
        const response = await axios.get(csvPath);
        const parsedData = d3.csvParse(response.data) as CompanyData[];
        setData(parsedData);
      } catch (err) {
        setError('Failed to load company data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const filtered = useMemo(() => {
    let result = [...data];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(c =>
        c.Company?.toLowerCase().includes(q) ||
        c['Main Sport Focus']?.toLowerCase().includes(q) ||
        c['Business Category']?.toLowerCase().includes(q) ||
        c.Headquarters?.toLowerCase().includes(q) ||
        c['Parent Company']?.toLowerCase().includes(q)
      );
    }

    if (ownershipFilter !== 'all') {
      result = result.filter(c => matchesOwnershipFilter(c['Ownership Status'], ownershipFilter));
    }

    if (bcorpOnly) {
      result = result.filter(c => isBCorp(c['Environmental & Sustainability Policies']));
    }

    result.sort((a, b) => {
      if (sortBy === 'name') return a.Company.localeCompare(b.Company);
      if (sortBy === 'founded') return (parseInt(a['Year Founded']) || 9999) - (parseInt(b['Year Founded']) || 9999);
      if (sortBy === 'ownership') return (a['Ownership Status'] || '').localeCompare(b['Ownership Status'] || '');
      return 0;
    });

    return result;
  }, [data, searchTerm, ownershipFilter, sortBy, bcorpOnly]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', bgcolor: colors.bg }}>
        <CircularProgress sx={{ color: colors.trail }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', bgcolor: colors.bg }}>
        <Typography sx={{ color: colors.trail }}>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: '100vh' }}>
      {/* Page Header */}
      <Box sx={{ bgcolor: colors.forest, pt: { xs: 8, md: 10 }, pb: { xs: 6, md: 8 } }}>
        <Container maxWidth="xl">
          <Typography
            sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.ridgeline, mb: 2 }}
          >
            Field Guide
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, color: '#FFFFFF', mb: 2 }}>
            Company Directory
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.0625rem', maxWidth: 540 }}>
            {data.length}+ outdoor companies tracked for ownership, sustainability, and independence.
          </Typography>
        </Container>
      </Box>

      {/* Filters */}
      <Box sx={{ bgcolor: colors.surface, borderBottom: `1px solid ${colors.ridgeline}22`, py: 3, position: 'sticky', top: 64, zIndex: 10 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            {/* Search */}
            <Box
              component="input"
              type="search"
              placeholder="Search companies, categories, locations…"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              sx={{
                px: 2,
                py: 1,
                border: `1px solid ${colors.ridgeline}66`,
                borderRadius: 1,
                fontFamily: fonts.sans,
                fontSize: '0.9rem',
                bgcolor: '#FFFFFF',
                color: colors.text,
                outline: 'none',
                width: { xs: '100%', sm: 280 },
                '&:focus': { borderColor: colors.trail },
                '&::placeholder': { color: colors.textSecondary },
              }}
            />

            {/* Sort */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.08em', color: colors.textSecondary, textTransform: 'uppercase' }}>
                Sort:
              </Typography>
              {(['name', 'founded', 'ownership'] as SortOption[]).map(s => (
                <Box
                  key={s}
                  onClick={() => setSortBy(s)}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 0.75,
                    fontFamily: fonts.mono,
                    fontSize: '0.6875rem',
                    letterSpacing: '0.06em',
                    textTransform: 'capitalize',
                    cursor: 'pointer',
                    bgcolor: sortBy === s ? colors.forest : 'transparent',
                    color: sortBy === s ? '#FFFFFF' : colors.textSecondary,
                    transition: 'all 0.15s',
                    '&:hover': { bgcolor: sortBy === s ? colors.forest : colors.ridgeline + '33' },
                  }}
                >
                  {s === 'founded' ? 'Year' : s}
                </Box>
              ))}
            </Box>

            {/* B-Corp toggle */}
            <Box
              onClick={() => setBcorpOnly(v => !v)}
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 0.75,
                fontFamily: fonts.mono,
                fontSize: '0.6875rem',
                letterSpacing: '0.06em',
                cursor: 'pointer',
                bgcolor: bcorpOnly ? colors.independent : 'transparent',
                color: bcorpOnly ? '#FFFFFF' : colors.textSecondary,
                border: `1px solid ${bcorpOnly ? colors.independent : colors.ridgeline + '66'}`,
                transition: 'all 0.15s',
              }}
            >
              B-Corp Only
            </Box>

            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', color: colors.textSecondary, letterSpacing: '0.06em' }}>
                {filtered.length} results
              </Typography>
            </Box>
          </Box>

          {/* Ownership filters */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
            {OWNERSHIP_FILTER_OPTIONS.map(({ value, label, color }) => (
              <Box
                key={value}
                onClick={() => setOwnershipFilter(value)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.75,
                  py: 0.5,
                  borderRadius: 20,
                  border: `1px solid ${ownershipFilter === value ? color : colors.ridgeline + '44'}`,
                  bgcolor: ownershipFilter === value ? color + '18' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': { borderColor: color, bgcolor: color + '12' },
                }}
              >
                {value !== 'all' && (
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
                )}
                <Typography
                  sx={{
                    fontFamily: fonts.mono,
                    fontSize: '0.6875rem',
                    letterSpacing: '0.06em',
                    color: ownershipFilter === value ? color : colors.textSecondary,
                    fontWeight: ownershipFilter === value ? 600 : 400,
                  }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Company Grid */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography sx={{ fontFamily: fonts.serif, fontSize: '1.5rem', color: colors.textSecondary, mb: 1 }}>
              No companies found
            </Typography>
            <Typography sx={{ color: colors.textSecondary, fontSize: '0.9375rem' }}>
              Try adjusting your search or filters
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {filtered.map((company) => {
              const ownershipColor = getOwnershipColor(company['Ownership Status']);
              const ownershipLabel = getOwnershipLabel(company['Ownership Status']);
              const isEmployeeOwned = company['Ownership Status']?.toLowerCase().includes('employee');
              const bcorp = isBCorp(company['Environmental & Sustainability Policies']);
              const slug = slugify(company.Company);

              return (
                <Grid item xs={12} sm={6} lg={4} key={company.Company}>
                  <Box
                    component={Link}
                    to={`/directory/${slug}`}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      bgcolor: '#FFFFFF',
                      border: `1px solid ${colors.surface}`,
                      borderRadius: 1.5,
                      p: { xs: 2.5, md: 3 },
                      textDecoration: 'none',
                      transition: 'border-color 0.2s, border-left-width 0.1s, box-shadow 0.2s',
                      '&:hover': {
                        borderColor: colors.trail,
                        boxShadow: `0 4px 24px rgba(27,42,33,0.07)`,
                        borderLeftWidth: 3,
                        borderLeftColor: colors.trail,
                      },
                    }}
                  >
                    {/* Top row: Name + ownership badge */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Typography
                        sx={{
                          fontFamily: fonts.sans,
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: colors.text,
                          lineHeight: 1.25,
                          pr: 1,
                        }}
                      >
                        {company.Company}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          flexShrink: 0,
                        }}
                      >
                        <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: ownershipColor }} />
                        <Typography
                          sx={{
                            fontFamily: fonts.mono,
                            fontSize: '0.5625rem',
                            letterSpacing: '0.07em',
                            textTransform: 'uppercase',
                            color: ownershipColor,
                            fontWeight: 600,
                          }}
                        >
                          {ownershipLabel}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Meta */}
                    <Typography
                      sx={{
                        fontFamily: fonts.mono,
                        fontSize: '0.6875rem',
                        color: colors.textSecondary,
                        letterSpacing: '0.03em',
                        mb: 1.5,
                      }}
                    >
                      {(company['Business Category'] || company['Main Sport Focus'] || '').split(',')[0].trim()}
                      {company['Year Founded'] ? ` · Est. ${company['Year Founded']}` : ''}
                      {company.Headquarters ? ` · ${company.Headquarters.split(',')[0].trim()}` : ''}
                    </Typography>

                    {/* Divider */}
                    <Box sx={{ borderTop: `1px solid ${colors.surface}`, pt: 1.5, mt: 'auto' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                          {company['Parent Company'] && company['Parent Company'].toLowerCase() !== 'independent' && (
                            <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.625rem', color: colors.textSecondary, letterSpacing: '0.04em' }}>
                              Parent: {company['Parent Company']}
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {bcorp && (
                            <Box sx={{ px: 1, py: 0.125, bgcolor: `${colors.independent}18`, color: colors.independent, fontFamily: fonts.mono, fontSize: '0.5625rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, borderRadius: 0.5 }}>
                              B-Corp
                            </Box>
                          )}
                          {isEmployeeOwned && (
                            <Box sx={{ px: 1, py: 0.125, bgcolor: `${colors.employeeOwned}18`, color: colors.employeeOwned, fontFamily: fonts.mono, fontSize: '0.5625rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, borderRadius: 0.5 }}>
                              ESOP
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
