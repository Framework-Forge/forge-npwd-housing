import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import Home from '@mui/icons-material/Home';
import Key from '@mui/icons-material/Key';
import Settings from '@mui/icons-material/Settings';
import { FORGE_COLORS } from '../theme/forge.theme';

const HousingNavBar: React.FC = () => {
  const { pathname } = useLocation();

  // Se estiver em detalhes do imóvel, não precisa marcar aba ativa
  const currentTab = ['/housing', '/housing/access', '/housing/settings'].includes(pathname)
    ? pathname
    : '/housing';

  return (
    <BottomNavigation
      value={currentTab}
      showLabels
      sx={{
        width: '100%',
        backgroundColor: FORGE_COLORS.bgDarker,
        borderTop: `1px solid ${FORGE_COLORS.borderColor}`,
        height: 56,
        '& .MuiBottomNavigationAction-root': {
          color: FORGE_COLORS.textGrey,
          minWidth: 'auto',
          padding: '6px 0',
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            color: FORGE_COLORS.orangePrimary,
            '& .MuiSvgIcon-root': {
              filter: `drop-shadow(0 0 6px ${FORGE_COLORS.orangeGlow})`,
            },
          },
        },
        '& .MuiBottomNavigationAction-label': {
          fontSize: '0.72rem',
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          '&.Mui-selected': {
            fontSize: '0.75rem',
          },
        },
      }}
    >
      <BottomNavigationAction
        label="Meus Imóveis"
        value="/housing"
        component={NavLink}
        icon={<Home fontSize="small" />}
        to="/housing"
      />
      <BottomNavigationAction
        label="Acesso"
        value="/housing/access"
        component={NavLink}
        icon={<Key fontSize="small" />}
        to="/housing/access"
      />
      <BottomNavigationAction
        label="Config"
        value="/housing/settings"
        component={NavLink}
        icon={<Settings fontSize="small" />}
        to="/housing/settings"
      />
    </BottomNavigation>
  );
};

export default HousingNavBar;
