import { AppBar, Box, CssBaseline, Toolbar, Typography, Tabs, Tab, createTheme, ThemeProvider } from '@mui/material';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Create theme with indie outdoors colors
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  typography: {
    fontFamily: '"Work Sans", sans-serif',
    h1: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
      letterSpacing: '0.02em',
      fontSize: '1.5rem', // Smaller font size on mobile
      [`.${createTheme().breakpoints.up('sm')}`]: {
        fontSize: '2rem',
      },
      [`.${createTheme().breakpoints.up('md')}`]: {
        fontSize: '2.5rem',
      },
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  palette: {
    primary: {
      main: '#C75C2C', // Terracotta orange
    },
    secondary: {
      main: '#2A5B5B', // Teal/forest green
    },
    background: {
      default: '#FAF6F1', // Light cream background
      paper: '#FFFFFF',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#C75C2C',
          boxShadow: 'none',
          borderBottom: '2px solid #2A2A2A',
          width: '100%',
          maxWidth: '100%',
          left: 0,
          right: 0,
          position: 'static',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '56px', // Smaller height on mobile
          width: '100%',
          maxWidth: '100%',
          minWidth: '100%',
          boxSizing: 'border-box',
          '@media (min-width:600px)': {
            minHeight: '64px',
          },
          '@media (min-width:960px)': {
            minHeight: '80px',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (min-width:1920px)': {
            maxWidth: '100%', // Allow container to take full width
            paddingLeft: '32px',
            paddingRight: '32px',
          },
        },
      },
    },
  },
});

const Layout = () => {
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // Set active tab based on current route
    if (location.pathname === '/' || location.pathname === '/indie-outdoors' || location.pathname === '/indie-outdoors/') {
      setTabValue(0);
    } else if (location.pathname.startsWith('/blog') || location.pathname.startsWith('/indie-outdoors/blog')) {
      setTabValue(1);
    }
  }, [location]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: 'background.default',
        width: '100%',
        maxWidth: '100%',
        minWidth: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden', // Prevent horizontal scrolling
        boxSizing: 'border-box',
      }}>
        <CssBaseline />
        <AppBar 
          position="static" 
          sx={{ 
            width: '100%',
            maxWidth: '100%',
            left: 0,
            right: 0,
          }}
        >
          <Toolbar 
            disableGutters 
            sx={{ 
              px: { xs: 2, sm: 3, md: 4 },
              width: '100%',
              maxWidth: '100%',
              minWidth: '100%',
              flexDirection: 'column',
              boxSizing: 'border-box',
            }}
          >
            <Typography 
              variant="h1" 
              component={Link}
              to="/"
              sx={{ 
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 700,
                textAlign: 'center',
                fontFamily: '"Outfit", sans-serif',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textDecoration: 'none',
                mb: { xs: 1, sm: 1.5 },
                '&:hover': {
                  opacity: 0.9,
                },
              }}
            >
              Indie Outdoors
            </Typography>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                width: '100%',
                '& .MuiTab-root': {
                  color: '#FFFFFF',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  minHeight: { xs: '40px', sm: '48px' },
                  '&.Mui-selected': {
                    color: '#FFFFFF',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#FFFFFF',
                  height: 3,
                },
              }}
            >
              <Tab 
                label="Dashboard" 
                component={Link} 
                to="/"
                sx={{ 
                  color: tabValue === 0 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                }}
              />
              <Tab 
                label="Blog" 
                component={Link} 
                to="/blog"
                sx={{ 
                  color: tabValue === 1 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </Tabs>
          </Toolbar>
        </AppBar>
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            width: '100%',
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2, sm: 3, md: 4 },
            bgcolor: 'background.default',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout; 