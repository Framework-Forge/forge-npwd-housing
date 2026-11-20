import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import Close from '@mui/icons-material/Close';
import { FORGE_COLORS } from '../theme/forge.theme';

interface InPhoneModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const InPhoneModal: React.FC<InPhoneModalProps> = ({
  open,
  title,
  onClose,
  children,
  actions,
}) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 1250,
        backgroundColor: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxHeight: '92%',
          backgroundColor: '#141419',
          border: `1px solid ${FORGE_COLORS.borderColor}`,
          borderRadius: '16px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.75)',
          color: FORGE_COLORS.textWhite,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          p: 2.2,
          gap: 1.5,
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
        {/* Header do Pop-up */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0.5 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.98rem',
              fontWeight: 700,
              color: FORGE_COLORS.textWhite,
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              color: FORGE_COLORS.textGrey,
              p: 0.5,
              '&:hover': { color: FORGE_COLORS.orangePrimary },
            }}
          >
            <Close sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Conteúdo Interno */}
        <Box sx={{ flex: 1, minHeight: 0 }}>
          {children}
        </Box>

        {/* Rodapé de Ações */}
        {actions && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 1,
              pt: 1,
              borderTop: `1px solid ${FORGE_COLORS.borderColor}`,
            }}
          >
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default InPhoneModal;
