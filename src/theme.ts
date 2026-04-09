import { createTheme } from '@mui/material/styles';

// Field Guide Design Tokens
export const colors = {
  forest: '#1B2A21',
  ridgeline: '#C4A882',
  trail: '#D4652F',
  bg: '#F5F2ED',
  surface: '#EDE8E0',
  text: '#1A1A1A',
  textSecondary: '#6B6560',
  independent: '#2D6A4F',
  peOwned: '#D4A72C',
  conglomerate: '#B84040',
  employeeOwned: '#2E6DA8',
  white: '#FFFFFF',
};

export const fonts = {
  serif: '"Instrument Serif", Georgia, serif',
  sans: '"Source Sans 3", system-ui, sans-serif',
  mono: '"JetBrains Mono", "Courier New", monospace',
};

export function getOwnershipColor(status: string): string {
  const s = status?.toLowerCase() ?? '';
  if (s.includes('employee') || s.includes('esop')) return colors.employeeOwned;
  if (
    s.includes('family') ||
    s.includes('independent') ||
    s.includes('founder') ||
    s.includes('private - family') ||
    s === 'private'
  ) return colors.independent;
  if (
    s.includes('pe') ||
    s.includes('private equity') ||
    s.includes('holding') ||
    s.includes('capital partners') ||
    s.includes('altamont')
  ) return colors.peOwned;
  if (
    s.includes('public') ||
    s.includes('subsidiary') ||
    s.includes('vf corp') ||
    s.includes('amer') ||
    s.includes('columbia')
  ) return colors.conglomerate;
  return colors.textSecondary;
}

export function getOwnershipLabel(status: string): string {
  const s = status?.toLowerCase() ?? '';
  if (s.includes('employee') || s.includes('esop')) return 'Employee-Owned';
  if (s.includes('family') || s.includes('independent') || s.includes('founder') || s.includes('private - family')) return 'Independent';
  if (s.includes('pe') || s.includes('private equity') || s.includes('capital partners') || s.includes('altamont')) return 'PE-Owned';
  if (s.includes('public')) return 'Public';
  if (s.includes('subsidiary')) return 'Subsidiary';
  return status || 'Unknown';
}

export function isBCorp(envText: string): boolean {
  return envText?.toLowerCase().includes('b corp') || envText?.toLowerCase().includes('bcorp') || false;
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const theme = createTheme({
  palette: {
    primary: {
      main: colors.trail,
      dark: '#B5501F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: colors.forest,
      contrastText: '#FFFFFF',
    },
    background: {
      default: colors.bg,
      paper: colors.surface,
    },
    text: {
      primary: colors.text,
      secondary: colors.textSecondary,
    },
    success: {
      main: colors.independent,
    },
    warning: {
      main: colors.peOwned,
    },
    error: {
      main: colors.conglomerate,
    },
  },
  typography: {
    fontFamily: fonts.sans,
    h1: {
      fontFamily: fonts.serif,
      fontWeight: 400,
      lineHeight: 1.15,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontFamily: fonts.serif,
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: fonts.serif,
      fontWeight: 400,
      lineHeight: 1.25,
    },
    h4: {
      fontFamily: fonts.serif,
      fontWeight: 400,
      lineHeight: 1.3,
    },
    h5: {
      fontFamily: fonts.sans,
      fontWeight: 600,
      lineHeight: 1.35,
    },
    h6: {
      fontFamily: fonts.sans,
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontFamily: fonts.sans,
      fontSize: '1.0625rem',
      lineHeight: 1.7,
    },
    body2: {
      fontFamily: fonts.sans,
      fontSize: '0.9375rem',
      lineHeight: 1.6,
    },
    caption: {
      fontFamily: fonts.mono,
      fontSize: '0.75rem',
      letterSpacing: '0.05em',
    },
    overline: {
      fontFamily: fonts.mono,
      fontSize: '0.6875rem',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
    },
    button: {
      fontFamily: fonts.sans,
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.bg,
          color: colors.text,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          transition: 'all 0.2s ease',
        },
        containedPrimary: {
          backgroundColor: colors.trail,
          '&:hover': {
            backgroundColor: '#B5501F',
            boxShadow: 'none',
          },
          boxShadow: 'none',
        },
        outlinedSecondary: {
          borderColor: colors.forest,
          color: colors.forest,
          '&:hover': {
            backgroundColor: colors.forest,
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: fonts.mono,
          fontSize: '0.6875rem',
          letterSpacing: '0.05em',
          height: 26,
          borderRadius: 3,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
        },
      },
    },
  },
});

export default theme;
