import React from 'react';
import { IPhoneSettings } from '@project-error/forge-npwd-types';
import { i18n } from 'i18next';
import { Theme, ThemeProvider, Box } from '@mui/material';
import Header from './components/Header';
import { PhoneSnackbar } from './snackbar/PhoneSnackbar';
import SnackbarProvider from './snackbar/SnackbarProvider';
import HousingNavBar from './components/HousingNavBar';
import { Switch, Route, Redirect } from 'react-router-dom';
import MyPropertiesTab from './views/MyPropertiesTab';
import AccessPropertiesTab from './views/AccessPropertiesTab';
import SettingsTab from './views/SettingsTab';
import PropertyDetailsPage from './views/PropertyDetailsPage';
import { FORGE_COLORS } from './theme/forge.theme';

interface AppProps {
  theme?: Theme;
  i18n?: i18n;
  settings?: IPhoneSettings;
}

export const App: React.FC<AppProps> = ({ theme }) => {
  const content = (
    <SnackbarProvider>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          boxSizing: 'border-box',
          flexDirection: 'column',
          overflow: 'hidden',
          height: '100%',
          maxHeight: '100%',
          backgroundColor: FORGE_COLORS.bgDarkest,
          color: FORGE_COLORS.textWhite,
          fontFamily: "'Inter', system-ui, sans-serif",
          position: 'relative',
        }}
      >
        <PhoneSnackbar />
        <Header />
        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: FORGE_COLORS.borderColor,
              borderRadius: '4px',
            },
          }}
        >
          <Switch>
            <Route exact path="/housing" component={MyPropertiesTab} />
            <Route exact path="/housing/access" component={AccessPropertiesTab} />
            <Route exact path="/housing/settings" component={SettingsTab} />
            <Route path="/housing/property/:id" component={PropertyDetailsPage} />
            <Redirect to="/housing" />
          </Switch>
        </Box>
        <HousingNavBar />
      </Box>
    </SnackbarProvider>
  );

  if (theme) {
    return <ThemeProvider theme={theme}>{content}</ThemeProvider>;
  }

  return content;
};

export default App;
