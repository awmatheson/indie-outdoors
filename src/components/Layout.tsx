import { Box, CssBaseline, ThemeProvider, Typography, Container } from '@mui/material';
import { Outlet, Link, useLocation } from 'react-router-dom';
import theme, { colors, fonts } from '../theme';

const NAV_LINKS = [
  { label: 'Discover', to: '/' },
  { label: 'Directory', to: '/directory' },
  { label: 'Map', to: '/ownership-map' },
  { label: 'Stories', to: '/blog' },
  { label: 'About', to: '/about' },
];

const Layout = () => {
  const location = useLocation();

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    if (to === '/directory') return location.pathname.startsWith('/directory');
    return location.pathname === to || location.pathname.startsWith(to + '/');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: colors.bg, width: '100%' }}>
        {/* Sticky Navigation */}
        <Box
          component="header"
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            bgcolor: colors.forest,
            borderBottom: `1px solid rgba(196, 168, 130, 0.2)`,
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: { xs: 56, md: 64 } }}>
              {/* Logo */}
              <Box
                component={Link}
                to="/"
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', '&:hover': { opacity: 0.85 }, transition: 'opacity 0.2s' }}
              >
                <Box
                  component="img"
                  src="/indie-outdoors/indie-outdoors.svg"
                  alt="Indie Outdoors"
                  sx={{ height: 28, width: 28, filter: 'brightness(0) invert(1) opacity(0.9)' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <Typography sx={{ fontFamily: fonts.serif, fontSize: { xs: '1.0625rem', md: '1.125rem' }, color: '#FFFFFF', letterSpacing: '0.01em', fontStyle: 'italic', lineHeight: 1 }}>
                  Indie Outdoors
                </Typography>
              </Box>

              {/* Nav — desktop */}
              <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0 }}>
                {NAV_LINKS.map(({ label, to }) => (
                  <Box
                    key={to}
                    component={Link}
                    to={to}
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: isActive(to) ? colors.ridgeline : 'rgba(255,255,255,0.75)',
                      textDecoration: 'none',
                      px: 2,
                      py: 0.75,
                      borderRadius: 1,
                      transition: 'color 0.2s',
                      letterSpacing: '0.02em',
                      borderBottom: isActive(to) ? `2px solid ${colors.ridgeline}` : '2px solid transparent',
                      '&:hover': { color: '#FFFFFF' },
                    }}
                  >
                    {label}
                  </Box>
                ))}
                <Box
                  component={Link}
                  to="/directory"
                  sx={{
                    ml: 2, px: 3, py: 0.75,
                    bgcolor: colors.trail, color: '#FFFFFF',
                    fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600,
                    textDecoration: 'none', borderRadius: 1,
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: '#B5501F' },
                  }}
                >
                  Find Brands →
                </Box>
              </Box>

              {/* Mobile nav */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 2, alignItems: 'center' }}>
                {[NAV_LINKS[1], NAV_LINKS[2], NAV_LINKS[3], NAV_LINKS[4]].map(({ label, to }) => (
                  <Box
                    key={to}
                    component={Link}
                    to={to}
                    sx={{
                      fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600,
                      color: isActive(to) ? colors.ridgeline : 'rgba(255,255,255,0.75)',
                      textDecoration: 'none', '&:hover': { color: '#FFFFFF' },
                    }}
                  >
                    {label}
                  </Box>
                ))}
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
          <Outlet />
        </Box>

        {/* Footer */}
        <Box component="footer" sx={{ bgcolor: colors.forest, color: 'rgba(255,255,255,0.75)', pt: { xs: 6, md: 8 }, pb: { xs: 4, md: 5 } }}>
          <Container maxWidth="xl">
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr' },
                gap: { xs: 4, md: 6 },
                pb: 5,
                borderBottom: '1px solid rgba(196, 168, 130, 0.15)',
                mb: 4,
              }}
            >
              <Box>
                <Typography sx={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: '1.375rem', color: '#FFFFFF', lineHeight: 1.4, mb: 2, maxWidth: 340 }}>
                  "Stories of independent outdoor companies and the people who build them."
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: 300 }}>
                  Founder profiles, brand discovery, and a free directory of who owns what in outdoor gear.
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.ridgeline, mb: 2 }}>
                  Discover
                </Typography>
                {[
                  { label: 'Independent Brands', to: '/directory' },
                  { label: 'Ownership Map', to: '/ownership-map' },
                  { label: 'Stories', to: '/blog' },
                ].map(({ label, to }) => (
                  <Box key={to} component={Link} to={to} sx={{ display: 'block', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem', mb: 1, '&:hover': { color: '#FFFFFF' }, transition: 'color 0.2s' }}>
                    {label}
                  </Box>
                ))}
              </Box>

              <Box>
                <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.ridgeline, mb: 2 }}>
                  Project
                </Typography>
                {[
                  { label: 'About', to: '/about' },
                  { label: 'Submit a Company', to: '/submit' },
                ].map(({ label, to }) => (
                  <Box key={label} component={Link} to={to} sx={{ display: 'block', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem', mb: 1, '&:hover': { color: '#FFFFFF' }, transition: 'color 0.2s' }}>
                    {label}
                  </Box>
                ))}
              </Box>

              <Box>
                <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.ridgeline, mb: 2 }}>
                  Ownership Key
                </Typography>
                {[
                  { color: colors.independent, label: 'Independent' },
                  { color: colors.employeeOwned, label: 'Employee-Owned' },
                  { color: colors.peOwned, label: 'PE / Holding Co.' },
                  { color: colors.conglomerate, label: 'Conglomerate' },
                ].map(({ color, label }) => (
                  <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>{label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
                © {new Date().getFullYear()} Indie Outdoors
              </Typography>
              <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
                Open source · GitHub Pages
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
