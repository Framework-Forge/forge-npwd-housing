import React from 'react';
import { Typography, Box } from '@mui/material';
import { FORGE_COLORS } from '../theme/forge.theme';

const Header: React.FC = () => {
  return (
    <Box
      px={2}
      py={1.5}
      sx={{
        width: '100%',
        textAlign: 'left',
        backgroundColor: FORGE_COLORS.bgDarker,
        borderBottom: `1px solid ${FORGE_COLORS.borderColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: FORGE_COLORS.textWhite,
          fontWeight: 700,
          fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: '0.5px',
        }}
      >
        <span style={{ color: FORGE_COLORS.orangePrimary }}>Forge</span> Imóveis
      </Typography>
    </Box>
  );
};

export default Header;
