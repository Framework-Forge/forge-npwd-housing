// Forgebox UI Kit Theme
// Referência: https://framework-forge.github.io/Forgebox-uikit/

import { ThemeOptions, createTheme } from '@mui/material';

export const FORGE_COLORS = {
  orangePrimary: '#FF7A1A',
  orangeHover: '#FF8C2A',
  orangeLight: '#FF9F43',
  orangeGlow: 'rgba(255, 122, 26, 0.45)',
  orangeGlowLight: 'rgba(255, 122, 26, 0.15)',
  orangeSubtle: 'rgba(255, 122, 26, 0.08)',
  bgDarkest: '#0A0A0C',
  bgDarker: '#121214',
  bgDark: '#16161A',
  bgCard: '#18181C',
  bgInput: '#0F0F11',
  borderColor: '#1F1F24',
  borderHover: '#2D2D35',
  borderFocus: '#FF7A1A',
  textWhite: '#FFFFFF',
  textGrey: '#8E8E9F',
  textMuted: '#545465',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export const forgeThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: FORGE_COLORS.orangePrimary,
      dark: '#E06010',
      light: FORGE_COLORS.orangeHover,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: FORGE_COLORS.textGrey,
      contrastText: '#FFFFFF',
    },
    background: {
      default: FORGE_COLORS.bgDarkest,
      paper: FORGE_COLORS.bgCard,
    },
    text: {
      primary: FORGE_COLORS.textWhite,
      secondary: FORGE_COLORS.textGrey,
      disabled: FORGE_COLORS.textMuted,
    },
    error: { main: FORGE_COLORS.error },
    warning: { main: FORGE_COLORS.warning },
    success: { main: FORGE_COLORS.success },
    info: { main: FORGE_COLORS.info },
    divider: FORGE_COLORS.borderColor,
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 },
    h2: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 },
    h3: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 },
    h4: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 },
    h5: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 },
    h6: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        containedPrimary: {
          backgroundColor: FORGE_COLORS.orangePrimary,
          '&:hover': {
            backgroundColor: FORGE_COLORS.orangeHover,
            boxShadow: `0 0 12px ${FORGE_COLORS.orangeGlow}`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: FORGE_COLORS.bgCard,
          border: `1px solid ${FORGE_COLORS.borderColor}`,
          borderRadius: 12,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: FORGE_COLORS.orangePrimary,
            boxShadow: `0 8px 30px rgba(0,0,0,0.4), 0 0 15px ${FORGE_COLORS.orangeGlow}`,
          },
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
    MuiDivider: {
      styleOverrides: { root: { borderColor: FORGE_COLORS.borderColor } },
    },
  },
};

export const forgeTheme = createTheme(forgeThemeOptions);
export const FORGE_APP_PRIMARY_COLOR = FORGE_COLORS.orangePrimary;
export const FORGE_APP_TEXT_COLOR = FORGE_COLORS.textWhite;
