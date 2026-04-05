import { Box, Container, Typography, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { colors, fonts, getOwnershipColor, getOwnershipLabel, slugify } from '../theme';
import { fetchSubstackPosts, SUBSTACK_BASE_URL, type SubstackPost } from '../utils/substackUtils';

// Hand-picked featured companies for the homepage
const FEATURED_COMPANIES = [
  {
    name: 'Patagonia',
    category: 'Apparel',
    founded: '1973',
    hq: 'Ventura, CA',
    ownershipStatus: 'Private - Family Owned',
    description: 'The gold standard for brand activism. Permanently transferred to the Patagonia Purpose Trust to fight climate change.',
    bcorp: true,
  },
  {
    name: 'Burton Snowboards',
    category: 'Snow Sports',
    founded: '1977',
    hq: 'Burlington, VT',
    ownershipStatus: 'Private - Family Owned',
    description: 'Founder-owned and B-Corp certified. Jake Burton built the industry from scratch and the family still runs it.',
    bcorp: true,
  },
  {
    name: 'Arc\'teryx',
    category: 'Apparel / Alpine',
    founded: '1989',
    hq: 'North Vancouver, BC',
    ownershipStatus: 'Public',
    description: 'Once a scrappy Canadian climbing gear shop, now a $475M subsidiary of Anta Sports via Amer Sports. The price of going premium.',
    bcorp: false,
  },
  {
    name: 'Trek Bicycle',
    category: 'Cycling',
    founded: '1975',
    hq: 'Waterloo, WI',
    ownershipStatus: 'Private - family owned',
    description: 'A $1B+ family empire that stayed independent through decades of consolidation. The Burke family still owns it outright.',
    bcorp: false,
  },
];

// Topographic SVG background pattern
const TopoBackground = () => (
  <Box
    sx={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      opacity: 0.07,
      pointerEvents: 'none',
    }}
  >
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="topo" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#C4A882" strokeWidth="1">
            <ellipse cx="200" cy="200" rx="190" ry="80" />
            <ellipse cx="200" cy="200" rx="160" ry="65" />
            <ellipse cx="200" cy="200" rx="130" ry="52" />
            <ellipse cx="200" cy="200" rx="100" ry="40" />
            <ellipse cx="200" cy="200" rx="70" ry="28" />
            <ellipse cx="200" cy="200" rx="40" ry="16" />
            <ellipse cx="200" cy="200" rx="15" ry="6" />
            <ellipse cx="0" cy="0" rx="120" ry="50" />
            <ellipse cx="0" cy="0" rx="90" ry="38" />
            <ellipse cx="400" cy="400" rx="120" ry="50" />
            <ellipse cx="400" cy="400" rx="90" ry="38" />
            <ellipse cx="50" cy="350" rx="80" ry="35" />
            <ellipse cx="350" cy="50" rx="80" ry="35" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#topo)" />
    </svg>
  </Box>
);

const STATS = [
  { value: '200+', label: 'Companies tracked' },
  { value: '~47%', label: 'Owned by 6 holding companies' },
  { value: '12', label: 'Major parent companies mapped' },
];

export default function Homepage() {
  const [recentPosts, setRecentPosts] = useState<SubstackPost[]>([]);

  useEffect(() => {
    fetchSubstackPosts(3).then(setRecentPosts).catch(() => setRecentPosts([]));
  }, []);

  return (
    <Box>
      {/* ── Hero ─────────────────────────────────────── */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: colors.forest,
          color: '#FFFFFF',
          pt: { xs: 10, md: 16 },
          pb: { xs: 10, md: 16 },
          overflow: 'hidden',
        }}
      >
        <TopoBackground />
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ maxWidth: 720 }}>
            {/* Eyebrow */}
            <Typography
              sx={{
                fontFamily: fonts.mono,
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: colors.ridgeline,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box component="span" sx={{ display: 'inline-block', width: 24, height: 1, bgcolor: colors.ridgeline }} />
              Field Guide to the Outdoor Industry
            </Typography>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.75rem', sm: '3.5rem', md: '4.5rem' },
                color: '#FFFFFF',
                mb: 3,
                lineHeight: 1.1,
              }}
            >
              Who really owns the outdoor industry?
            </Typography>

            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: { xs: '1.0625rem', md: '1.1875rem' },
                color: 'rgba(255,255,255,0.7)',
                mb: 5,
                maxWidth: 560,
                lineHeight: 1.7,
              }}
            >
              We track ownership, sustainability, and independence across 200+ outdoor brands — so you can buy with your values, not just your wallet.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box
                component={Link}
                to="/directory"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 3.5,
                  py: 1.5,
                  bgcolor: colors.trail,
                  color: '#FFFFFF',
                  fontFamily: fonts.sans,
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  borderRadius: 1,
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: '#B5501F', color: '#FFFFFF' },
                }}
              >
                Explore the Directory →
              </Box>
              <Box
                component={Link}
                to="/ownership-map"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 3.5,
                  py: 1.5,
                  bgcolor: 'transparent',
                  color: 'rgba(255,255,255,0.85)',
                  fontFamily: fonts.sans,
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 1,
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: '#FFFFFF' },
                }}
              >
                View Ownership Map
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── By the Numbers ───────────────────────────── */}
      <Box sx={{ bgcolor: colors.surface, borderBottom: `1px solid ${colors.ridgeline}22` }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              divide: 'x',
            }}
          >
            {STATS.map((stat, i) => (
              <Box
                key={stat.label}
                sx={{
                  py: { xs: 4, md: 5 },
                  px: { xs: 0, md: 4 },
                  borderRight: { xs: 'none', sm: i < STATS.length - 1 ? `1px solid ${colors.ridgeline}33` : 'none' },
                  borderBottom: { xs: i < STATS.length - 1 ? `1px solid ${colors.ridgeline}33` : 'none', sm: 'none' },
                  textAlign: { xs: 'center', sm: 'left' },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: fonts.mono,
                    fontSize: { xs: '2.25rem', md: '3rem' },
                    fontWeight: 600,
                    color: colors.trail,
                    lineHeight: 1,
                    mb: 0.75,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontSize: '0.9375rem',
                    color: colors.textSecondary,
                    lineHeight: 1.4,
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Featured Companies ───────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: colors.bg }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography
                sx={{
                  fontFamily: fonts.mono,
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: colors.textSecondary,
                  mb: 1.5,
                }}
              >
                Featured Profiles
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, color: colors.text }}>
                Know your brands
              </Typography>
            </Box>
            <Box
              component={Link}
              to="/directory"
              sx={{
                fontFamily: fonts.sans,
                fontSize: '0.9rem',
                fontWeight: 600,
                color: colors.trail,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              View all companies →
            </Box>
          </Box>

          <Grid container spacing={3}>
            {FEATURED_COMPANIES.map((company) => {
              const ownershipColor = getOwnershipColor(company.ownershipStatus);
              const ownershipLabel = getOwnershipLabel(company.ownershipStatus);
              return (
                <Grid item xs={12} sm={6} lg={3} key={company.name}>
                  <Box
                    component={Link}
                    to={`/directory/${slugify(company.name)}`}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      bgcolor: '#FFFFFF',
                      border: `1px solid ${colors.surface}`,
                      borderRadius: 1.5,
                      p: 3,
                      textDecoration: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        borderColor: colors.trail,
                        borderLeftWidth: 3,
                        boxShadow: `0 4px 20px rgba(27,42,33,0.08)`,
                      },
                    }}
                  >
                    {/* Header row */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: fonts.sans,
                            fontSize: '1.0625rem',
                            fontWeight: 700,
                            color: colors.text,
                            lineHeight: 1.2,
                          }}
                        >
                          {company.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: fonts.mono,
                            fontSize: '0.6875rem',
                            color: colors.textSecondary,
                            mt: 0.5,
                            letterSpacing: '0.04em',
                          }}
                        >
                          {company.category} · Est. {company.founded}
                        </Typography>
                      </Box>
                      {/* Ownership dot */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          flexShrink: 0,
                          ml: 1,
                        }}
                      >
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: ownershipColor }} />
                        <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.625rem', color: ownershipColor, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                          {ownershipLabel}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      sx={{
                        fontFamily: fonts.sans,
                        fontSize: '0.875rem',
                        color: colors.textSecondary,
                        lineHeight: 1.6,
                        flexGrow: 1,
                      }}
                    >
                      {company.description}
                    </Typography>

                    <Box
                      sx={{
                        mt: 2.5,
                        pt: 2,
                        borderTop: `1px solid ${colors.surface}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', color: colors.textSecondary, letterSpacing: '0.04em' }}>
                        {company.hq}
                      </Typography>
                      {company.bcorp && (
                        <Box
                          sx={{
                            px: 1.25,
                            py: 0.25,
                            bgcolor: `${colors.independent}18`,
                            color: colors.independent,
                            fontFamily: fonts.mono,
                            fontSize: '0.625rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            borderRadius: 0.5,
                          }}
                        >
                          B-Corp
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* ── Ownership Map Teaser ─────────────────────── */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: colors.forest,
          py: { xs: 8, md: 12 },
          overflow: 'hidden',
        }}
      >
        <TopoBackground />
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 6, alignItems: 'center' }}>
            <Box>
              <Typography
                sx={{
                  fontFamily: fonts.mono,
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: colors.ridgeline,
                  mb: 2,
                }}
              >
                Interactive Visualization
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, color: '#FFFFFF', mb: 3 }}>
                See who controls what
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.0625rem', lineHeight: 1.7, mb: 4, maxWidth: 440 }}>
                Explore an interactive network graph of parent companies and subsidiaries. Discover how Amer Sports owns Arc'teryx, Salomon, and Peak Performance. How VF Corp runs The North Face and Smartwool. The web is wider than you think.
              </Typography>
              <Box
                component={Link}
                to="/ownership-map"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 3,
                  py: 1.5,
                  bgcolor: colors.ridgeline,
                  color: colors.forest,
                  fontFamily: fonts.sans,
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  borderRadius: 1,
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 0.9, color: colors.forest },
                }}
              >
                Explore the Map →
              </Box>
            </Box>

            {/* Decorative network preview */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <svg width="360" height="280" viewBox="0 0 360 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.75 }}>
                {/* Central node */}
                <circle cx="180" cy="140" r="18" fill={colors.conglomerate} stroke={colors.ridgeline} strokeWidth="1.5"/>
                <text x="180" y="144" textAnchor="middle" fill="white" fontSize="9" fontFamily={fonts.mono}>VF Corp</text>
                {/* Child nodes */}
                {[
                  { cx: 80, cy: 70, label: 'TNF', color: colors.textSecondary },
                  { cx: 280, cy: 70, label: 'Vans', color: colors.textSecondary },
                  { cx: 60, cy: 190, label: 'Timberland', color: colors.textSecondary },
                  { cx: 300, cy: 190, label: 'Smartwool', color: colors.textSecondary },
                  { cx: 170, cy: 240, label: 'Icebreaker', color: colors.textSecondary },
                ].map(({ cx, cy, label, color }) => (
                  <g key={label}>
                    <line x1="180" y1="140" x2={cx} y2={cy} stroke="rgba(196,168,130,0.3)" strokeWidth="1"/>
                    <circle cx={cx} cy={cy} r="12" fill={color} fillOpacity="0.3" stroke={colors.ridgeline} strokeWidth="1" strokeOpacity="0.5"/>
                    <text x={cx} y={cy + 4} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="7.5" fontFamily={fonts.mono}>{label}</text>
                  </g>
                ))}
                {/* Independent node */}
                <circle cx="40" cy="130" r="14" fill={colors.independent} fillOpacity="0.4" stroke={colors.independent} strokeWidth="1.5"/>
                <text x="40" y="134" textAnchor="middle" fill="white" fontSize="7" fontFamily={fonts.mono}>Patagonia</text>
                <circle cx="320" cy="130" r="12" fill={colors.employeeOwned} fillOpacity="0.4" stroke={colors.employeeOwned} strokeWidth="1.5"/>
                <text x="320" y="134" textAnchor="middle" fill="white" fontSize="7" fontFamily={fonts.mono}>REI</text>
              </svg>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Latest from the Blog ─────────────────────── */}
      {recentPosts.length > 0 && (
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: colors.bg }}>
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6, flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textSecondary, mb: 1.5 }}>
                  From the Field
                </Typography>
                <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, color: colors.text }}>
                  Latest dispatches
                </Typography>
              </Box>
              <Box component="a" href={SUBSTACK_BASE_URL} target="_blank" rel="noopener noreferrer" sx={{ fontFamily: fonts.sans, fontSize: '0.9rem', fontWeight: 600, color: colors.trail, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                All posts →
              </Box>
            </Box>

            <Grid container spacing={3}>
              {recentPosts.map((post) => (
                <Grid item xs={12} md={4} key={post.id}>
                  <Box
                    component="a"
                    href={`${post.url}?utm_source=indie-outdoors`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'block',
                      bgcolor: '#FFFFFF',
                      border: `1px solid ${colors.surface}`,
                      borderRadius: 1.5,
                      p: 3.5,
                      textDecoration: 'none',
                      height: '100%',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        borderColor: colors.trail,
                        boxShadow: `0 4px 20px rgba(27,42,33,0.08)`,
                      },
                    }}
                  >
                    <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.08em', color: colors.textSecondary, mb: 2 }}>
                      {post.post_date ? new Date(post.post_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: '1.25rem',
                        color: colors.text,
                        mb: 1.5,
                        lineHeight: 1.3,
                      }}
                    >
                      {post.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', color: colors.textSecondary, lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.subtitle || post.description}
                    </Typography>
                    <Typography sx={{ mt: 2, fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.trail }}>
                      Read on Substack →
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* ── Newsletter CTA ───────────────────────────── */}
      <Box sx={{ bgcolor: colors.surface, py: { xs: 8, md: 10 }, borderTop: `1px solid ${colors.ridgeline}22` }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textSecondary, mb: 2 }}
            >
              Stay on the trail
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.875rem', md: '2.5rem' }, color: colors.text, mb: 2 }}>
              Get ownership updates in your inbox
            </Typography>
            <Typography sx={{ color: colors.textSecondary, fontSize: '1.0625rem', mb: 4, maxWidth: 480, mx: 'auto', lineHeight: 1.6 }}>
              New company profiles, acquisition alerts, and field notes on the business of the outdoors.
            </Typography>
            <Box
              component="form"
              onSubmit={(e) => e.preventDefault()}
              sx={{ display: 'flex', gap: 1.5, maxWidth: 420, mx: 'auto', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}
            >
              <Box
                component="input"
                type="email"
                placeholder="your@email.com"
                sx={{
                  flexGrow: 1,
                  px: 2,
                  py: 1.5,
                  border: `1px solid ${colors.ridgeline}`,
                  borderRadius: 1,
                  fontFamily: fonts.sans,
                  fontSize: '0.9375rem',
                  bgcolor: '#FFFFFF',
                  color: colors.text,
                  outline: 'none',
                  '&:focus': { borderColor: colors.trail },
                  width: { xs: '100%', sm: 'auto' },
                }}
              />
              <Box
                component="button"
                type="submit"
                sx={{
                  px: 3,
                  py: 1.5,
                  bgcolor: colors.trail,
                  color: '#FFFFFF',
                  fontFamily: fonts.sans,
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  border: 'none',
                  borderRadius: 1,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: '#B5501F' },
                  whiteSpace: 'nowrap',
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Subscribe
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
