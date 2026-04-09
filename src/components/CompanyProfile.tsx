import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, CircularProgress } from '@mui/material';
import { colors, fonts, getOwnershipColor, getOwnershipLabel, isBCorp, slugify } from '../theme';
import { MdInline, MdBlock } from './Md';
import { fetchCompanies, type CompanyData } from '../utils/companiesUtils';

function OwnershipDonut({ status }: { status: string }) {
  const ownershipColor = getOwnershipColor(status);
  const isIndependent = ['family', 'independent', 'founder'].some(k => status?.toLowerCase().includes(k));
  const founderPct = isIndependent ? 100 : status?.toLowerCase().includes('employee') ? 60 : status?.toLowerCase().includes('subsidiary') ? 0 : 20;

  const r = 54;
  const cx = 70;
  const cy = 70;
  const circ = 2 * Math.PI * r;
  const dash = (founderPct / 100) * circ;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={colors.surface} strokeWidth="12" />
        {/* Fill */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={ownershipColor}
          strokeWidth="12"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        <text x={cx} y={cy - 6} textAnchor="middle" fill={colors.text} fontSize="20" fontFamily={fonts.mono} fontWeight="600">
          {founderPct}%
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill={colors.textSecondary} fontSize="9" fontFamily={fonts.mono} letterSpacing="0.06em">
          FOUNDER / INDEP.
        </text>
      </svg>
    </Box>
  );
}

function KeyFactRow({ label, value }: { label: string; value?: string }) {
  if (!value || value.trim() === '') return null;
  return (
    <Box sx={{ display: 'flex', py: 1.5, borderBottom: `1px solid ${colors.surface}`, gap: 2 }}>
      <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: colors.textSecondary, minWidth: 130, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography sx={{ fontFamily: fonts.sans, fontSize: '0.9375rem', color: colors.text, lineHeight: 1.5 }}>
        <MdInline>{value}</MdInline>
      </Typography>
    </Box>
  );
}

export default function CompanyProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [allData, setAllData] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies()
      .then(setAllData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', bgcolor: colors.bg }}>
        <CircularProgress sx={{ color: colors.trail }} />
      </Box>
    );
  }

  const company = allData.find(c => slugify(c.Company) === slug);

  if (!company) {
    return <Navigate to="/directory" replace />;
  }

  const ownershipColor = getOwnershipColor(company['Ownership Status']);
  const ownershipLabel = getOwnershipLabel(company['Ownership Status']);
  const bcorp = isBCorp(company['Environmental & Sustainability Policies']);
  const isEmployeeOwned = company['Ownership Status']?.toLowerCase().includes('employee');

  // Find related companies: same parent company or same category
  const related = allData
    .filter(c =>
      c.Company !== company.Company && (
        (company['Parent Company'] && company['Parent Company'].toLowerCase() !== 'independent' && c['Parent Company'] === company['Parent Company']) ||
        (c['Business Category'] || c['Main Sport Focus'] || '').split(',')[0].trim() ===
        (company['Business Category'] || company['Main Sport Focus'] || '').split(',')[0].trim()
      )
    )
    .slice(0, 4);

  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: '100vh' }}>
      {/* Breadcrumb + header */}
      <Box sx={{ bgcolor: colors.forest, pt: { xs: 6, md: 8 }, pb: { xs: 6, md: 8 } }}>
        <Container maxWidth="xl">
          {/* Breadcrumb */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
            <Box component={Link} to="/directory" sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', '&:hover': { color: colors.ridgeline } }}>
              Directory
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>/</Typography>
            <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: colors.ridgeline }}>
              {company.Company}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ maxWidth: 640 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 1.5, py: 0.5, bgcolor: ownershipColor + '22', border: `1px solid ${ownershipColor}44`, borderRadius: 0.75 }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: ownershipColor }} />
                  <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.625rem', color: ownershipColor, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                    {ownershipLabel}
                  </Typography>
                </Box>
                {bcorp && (
                  <Box sx={{ px: 1.5, py: 0.5, bgcolor: `${colors.independent}22`, border: `1px solid ${colors.independent}44`, borderRadius: 0.75 }}>
                    <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.625rem', color: colors.independent, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                      B-Corp Certified
                    </Typography>
                  </Box>
                )}
                {isEmployeeOwned && (
                  <Box sx={{ px: 1.5, py: 0.5, bgcolor: `${colors.employeeOwned}22`, border: `1px solid ${colors.employeeOwned}44`, borderRadius: 0.75 }}>
                    <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.625rem', color: colors.employeeOwned, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                      Employee-Owned
                    </Typography>
                  </Box>
                )}
              </Box>

              <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, color: '#FFFFFF', mb: 1.5 }}>
                {company.Company}
              </Typography>

              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.75rem', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.5)' }}>
                {(company['Business Category'] || company['Main Sport Focus'] || '').split(',')[0].trim()}
                {company['Year Founded'] ? ` · Est. ${company['Year Founded']}` : ''}
                {company.Headquarters ? ` · ${company.Headquarters.split('\n')[0].trim()}` : ''}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
        <Grid container spacing={4}>
          {/* Main column */}
          <Grid item xs={12} lg={8}>
            {/* Key Facts */}
            <Box sx={{ bgcolor: '#FFFFFF', borderRadius: 1.5, p: { xs: 3, md: 4 }, mb: 4, border: `1px solid ${colors.surface}` }}>
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textSecondary, mb: 3 }}>
                Key Facts
              </Typography>
              <KeyFactRow label="Founded" value={company['Year Founded']} />
              <KeyFactRow label="Headquarters" value={company.Headquarters?.split('\n')[0].trim()} />
              <KeyFactRow label="Category" value={company['Business Category'] || company['Main Sport Focus']} />
              <KeyFactRow label="Ownership" value={company['Ownership Status']} />
              <KeyFactRow label="Ownership Details" value={company['Ownership Details']} />
              <KeyFactRow label="Parent Company" value={company['Parent Company'] && company['Parent Company'].toLowerCase() !== 'independent' ? company['Parent Company'] : undefined} />
              <KeyFactRow label="Manufacturing" value={company['Main Manufacturing']?.split('\n')[0].trim()} />
              <KeyFactRow label="Financials" value={company.Financials?.split('\n')[0].trim()} />
            </Box>

            {/* Sustainability */}
            {company['Environmental & Sustainability Policies'] && (
              <Box sx={{ bgcolor: '#FFFFFF', borderRadius: 1.5, p: { xs: 3, md: 4 }, mb: 4, border: `1px solid ${colors.surface}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textSecondary }}>
                    Sustainability & Environment
                  </Typography>
                  {bcorp && (
                    <Box sx={{ px: 1.25, py: 0.25, bgcolor: `${colors.independent}18`, color: colors.independent, fontFamily: fonts.mono, fontSize: '0.5625rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, borderRadius: 0.5 }}>
                      B-Corp
                    </Box>
                  )}
                </Box>
                <Typography component="div" sx={{ fontSize: '0.9375rem', color: colors.text, lineHeight: 1.75 }}>
                  <MdBlock>{company['Environmental & Sustainability Policies'].split('\n')[0].trim()}</MdBlock>
                </Typography>
              </Box>
            )}

            {/* Acquisition History */}
            {company['Acquisition History'] && (
              <Box sx={{ bgcolor: '#FFFFFF', borderRadius: 1.5, p: { xs: 3, md: 4 }, border: `1px solid ${colors.surface}` }}>
                <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textSecondary, mb: 3 }}>
                  Ownership History
                </Typography>
                <Typography component="div" sx={{ fontSize: '0.9375rem', color: colors.text, lineHeight: 1.75 }}>
                  <MdBlock>{company['Acquisition History'].split('\n')[0].trim()}</MdBlock>
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Ownership structure */}
            <Box sx={{ bgcolor: '#FFFFFF', borderRadius: 1.5, p: { xs: 3, md: 4 }, mb: 4, border: `1px solid ${colors.surface}`, textAlign: 'center' }}>
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textSecondary, mb: 3 }}>
                Independence Score
              </Typography>
              <OwnershipDonut status={company['Ownership Status']} />
              <Typography sx={{ fontSize: '0.9rem', color: colors.textSecondary, mt: 2, lineHeight: 1.55 }}>
                {ownershipLabel} · {company['Ownership Details'] || company['Ownership Status']}
              </Typography>
            </Box>

            {/* Sport Focus */}
            {company['Main Sport Focus'] && (
              <Box sx={{ bgcolor: '#FFFFFF', borderRadius: 1.5, p: 3, mb: 4, border: `1px solid ${colors.surface}` }}>
                <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textSecondary, mb: 2 }}>
                  Sport Focus
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {company['Main Sport Focus'].split(',').map(s => s.trim()).filter(Boolean).map(sport => (
                    <Box
                      key={sport}
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        bgcolor: colors.surface,
                        borderRadius: 0.75,
                        fontFamily: fonts.mono,
                        fontSize: '0.6875rem',
                        color: colors.textSecondary,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {sport}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Related Companies */}
            {related.length > 0 && (
              <Box sx={{ bgcolor: '#FFFFFF', borderRadius: 1.5, p: 3, border: `1px solid ${colors.surface}` }}>
                <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textSecondary, mb: 2 }}>
                  Related Companies
                </Typography>
                {related.map(rel => {
                  const relColor = getOwnershipColor(rel['Ownership Status']);
                  const relLabel = getOwnershipLabel(rel['Ownership Status']);
                  return (
                    <Box
                      key={rel.Company}
                      component={Link}
                      to={`/directory/${slugify(rel.Company)}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 1.25,
                        borderBottom: `1px solid ${colors.surface}`,
                        textDecoration: 'none',
                        '&:last-child': { borderBottom: 'none' },
                        '&:hover .rel-name': { color: colors.trail },
                        transition: 'color 0.15s',
                      }}
                    >
                      <Typography className="rel-name" sx={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.text, transition: 'color 0.15s' }}>
                        {rel.Company}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: relColor }} />
                        <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.5625rem', color: relColor, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                          {relLabel}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Back link */}
        <Box sx={{ mt: 6, pt: 4, borderTop: `1px solid ${colors.surface}` }}>
          <Box component={Link} to="/directory" sx={{ fontFamily: fonts.sans, fontWeight: 600, color: colors.trail, textDecoration: 'none', fontSize: '0.9375rem', '&:hover': { textDecoration: 'underline' } }}>
            ← Back to Directory
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
