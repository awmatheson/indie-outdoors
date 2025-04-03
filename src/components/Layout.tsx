import { AppBar, Box, CssBaseline, Toolbar, Typography, createTheme, ThemeProvider } from '@mui/material';
import { Outlet } from 'react-router-dom';

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
          left: 0,
          right: 0,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '56px', // Smaller height on mobile
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
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: 'background.default',
        width: '100%',
        overflow: 'hidden', // Prevent horizontal scrolling
      }}>
        <CssBaseline />
        <AppBar position="static" sx={{ width: '100%' }}>
          <Toolbar 
            disableGutters 
            sx={{ 
              px: { xs: 2, sm: 3, md: 4 },
              width: '100%',
              maxWidth: '100%',
            }}
          >
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{ 
                flexGrow: 1,
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 700,
                textAlign: 'center',
                fontFamily: '"Outfit", sans-serif',
                whiteSpace: 'nowrap', // Prevent text wrapping
                overflow: 'hidden',
                textOverflow: 'ellipsis', // Show ellipsis if text overflows
              }}
            >
              Indie Outdoors
            </Typography>
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