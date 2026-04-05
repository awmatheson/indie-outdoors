import { Box, Container, Typography, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { colors, fonts } from '../theme';

export default function About() {
  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: '100vh' }}>
      <Box sx={{ bgcolor: colors.forest, pt: { xs: 8, md: 10 }, pb: { xs: 6, md: 8 } }}>
        <Container maxWidth="xl">
          <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.ridgeline, mb: 2 }}>
            The Project
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, color: '#FFFFFF', mb: 1.5 }}>
            About Indie Outdoors
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: 540 }}>
            A field guide to the ownership, ethics, and independence of outdoor brands.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={7}>
            <Box sx={{ bgcolor: '#FFFFFF', borderRadius: 1.5, p: { xs: 3.5, md: 5 }, border: `1px solid ${colors.surface}`, mb: 4 }}>
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textSecondary, mb: 3 }}>
                Mission
              </Typography>
              <Typography variant="h2" sx={{ fontSize: '1.75rem', color: colors.text, mb: 3 }}>
                Know who makes your gear
              </Typography>
              <Typography sx={{ fontSize: '1.0625rem', color: colors.text, lineHeight: 1.8, mb: 2 }}>
                The outdoor industry has undergone radical consolidation over the past three decades. Brands that were built by climbers and skiers in garages and basements are now subsidiaries of private equity firms and global conglomerates.
              </Typography>
              <Typography sx={{ fontSize: '1.0625rem', color: colors.text, lineHeight: 1.8, mb: 2 }}>
                Indie Outdoors exists to make that ownership transparent. We track who owns what, when acquisitions happened, and which brands remain genuinely independent — so you can spend your money where your values are.
              </Typography>
              <Typography sx={{ fontSize: '1.0625rem', color: colors.text, lineHeight: 1.8 }}>
                This is not about brand shaming. It's about informed choice. Some of the best gear comes from subsidiaries. Some of the worst comes from independents. But you deserve to know.
              </Typography>
            </Box>

            <Box sx={{ bgcolor: '#FFFFFF', borderRadius: 1.5, p: { xs: 3.5, md: 5 }, border: `1px solid ${colors.surface}` }}>
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textSecondary, mb: 3 }}>
                Methodology
              </Typography>
              <Typography sx={{ fontSize: '1.0625rem', color: colors.text, lineHeight: 1.8, mb: 2 }}>
                Company data is sourced from public filings, press releases, corporate websites, and reputable business journalism. Ownership classifications are our own — they reflect our best interpretation of available information.
              </Typography>
              <Typography sx={{ fontSize: '1.0625rem', color: colors.text, lineHeight: 1.8 }}>
                We update profiles when material ownership changes occur. If you notice an error or have updated information, please{' '}
                <Box component={Link} to="/submit" sx={{ color: colors.trail, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  let us know
                </Box>.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box sx={{ bgcolor: colors.surface, borderRadius: 1.5, p: 3.5, border: `1px solid ${colors.ridgeline}33`, mb: 3 }}>
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textSecondary, mb: 2 }}>
                Ownership Categories
              </Typography>
              {[
                { color: colors.independent, label: 'Independent', desc: 'Founder, family, or employee-owned with no major external corporate control.' },
                { color: colors.employeeOwned, label: 'Employee-Owned', desc: 'Majority or significant ownership held by employees or ESOP trust.' },
                { color: colors.peOwned, label: 'PE / Holding Co.', desc: 'Majority stake held by a private equity firm or holding company.' },
                { color: colors.conglomerate, label: 'Conglomerate / Public', desc: 'Subsidiary of a large public company or multi-brand conglomerate.' },
              ].map(({ color, label, desc }) => (
                <Box key={label} sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, mt: 0.5, flexShrink: 0 }} />
                  <Box>
                    <Typography sx={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: '0.9375rem', color: colors.text, mb: 0.25 }}>{label}</Typography>
                    <Typography sx={{ fontSize: '0.875rem', color: colors.textSecondary, lineHeight: 1.5 }}>{desc}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box sx={{ bgcolor: colors.forest, borderRadius: 1.5, p: 3.5 }}>
              <Typography sx={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: '1.125rem', color: '#FFFFFF', lineHeight: 1.5, mb: 2 }}>
                "We spend thousands on gear that takes us into the wilderness. The least we can do is understand who profits from that."
              </Typography>
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.08em', color: colors.ridgeline }}>
                — The Indie Outdoors Manifesto
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
