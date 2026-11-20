import React, { useState } from 'react';
import { Box, Typography, Chip, Button, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { useHistory } from 'react-router-dom';
import LocationOn from '@mui/icons-material/LocationOn';
import Apartment from '@mui/icons-material/Apartment';
import Home from '@mui/icons-material/Home';
import Key from '@mui/icons-material/Key';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import ArrowForward from '@mui/icons-material/ArrowForward';
import CheckCircle from '@mui/icons-material/CheckCircle';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import { PropertyData, PropertyWithAccess } from '../types/property';
import { FORGE_COLORS } from '../theme/forge.theme';
import HousingService from '../services/housing.service';
import { useSnackbar } from '../snackbar/useSnackbar';

interface PropertyCardProps {
  property: PropertyData | PropertyWithAccess;
  isAccessTab?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, isAccessTab = false }) => {
  const history = useHistory();
  const { addAlert } = useSnackbar();
  const [gpsLoading, setGpsLoading] = useState(false);

  const isApartment =
    property.category === 'apartment' ||
    Boolean(property.apartment && property.apartment !== '');

  const accessType = (property as PropertyWithAccess).accessType || 'owner';

  // Cálculo de débitos totais
  const taxes = property.tax_data || {};
  const totalDebt =
    (Number(taxes.luz?.balance) || 0) +
    (Number(taxes.agua?.balance) || 0) +
    (Number(taxes.iptu?.balance) || 0) +
    (Number(taxes.security?.balance) || 0);

  const hasDebt = totalDebt > 0;

  const handleSetGPS = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setGpsLoading(true);
    try {
      let coords: { x: number; y: number; z?: number } | undefined;
      const doors = property.door_data;
      if (Array.isArray(doors) && doors[1]) {
        coords = doors[1].origin || doors[1];
      } else if (doors && typeof doors === 'object' && 'x' in doors) {
        coords = (doors as any).origin || doors;
      }

      const res = await HousingService.setWaypoint(property.property_id, coords);
      if (res.status === 'ok') {
        addAlert({ message: res.message || 'GPS marcado no mapa.', type: 'success' });
      } else {
        addAlert({ message: res.message || 'Falha ao marcar GPS.', type: 'error' });
      }
    } catch {
      addAlert({ message: 'Erro ao comunicar com o GPS.', type: 'error' });
    } finally {
      setGpsLoading(false);
    }
  };

  const handleOpenDetails = () => {
    history.push(`/housing/property/${property.property_id}`);
  };

  const imageSrc =
    property.extra_imgs && property.extra_imgs.length > 0 && property.extra_imgs[0]
      ? property.extra_imgs[0]
      : null;

  return (
    <Box
      onClick={handleOpenDetails}
      sx={{
        backgroundColor: FORGE_COLORS.bgCard,
        border: `1px solid ${FORGE_COLORS.borderColor}`,
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          borderColor: FORGE_COLORS.orangePrimary,
          boxShadow: `0 8px 24px rgba(0, 0, 0, 0.5), 0 0 14px ${FORGE_COLORS.orangeGlowLight}`,
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Imagem / Banner do Imóvel */}
      <Box
        sx={{
          height: 110,
          width: '100%',
          position: 'relative',
          backgroundColor: '#111215',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {imageSrc ? (
          <Box
            component="img"
            src={imageSrc}
            alt={property.street}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: 'radial-gradient(ellipse at center, rgba(255, 122, 26, 0.18), transparent 75%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: FORGE_COLORS.orangePrimary,
            }}
          >
            {isApartment ? <Apartment sx={{ fontSize: 48, opacity: 0.6 }} /> : <Home sx={{ fontSize: 48, opacity: 0.6 }} />}
          </Box>
        )}

        {/* Gradiente escurecedor para leitura */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '45%',
            background: 'linear-gradient(to top, rgba(24, 24, 28, 0.95), transparent)',
          }}
        />

        {/* Badge de Categoria Flutuante (Superior Esquerdo) */}
        <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 0.5 }}>
          <Chip
            size="small"
            icon={isApartment ? <Apartment sx={{ fontSize: '13px !important' }} /> : <Home sx={{ fontSize: '13px !important' }} />}
            label={isApartment ? 'Apartamento' : 'Casa'}
            sx={{
              backgroundColor: 'rgba(10, 10, 12, 0.85)',
              color: FORGE_COLORS.textWhite,
              fontWeight: 700,
              fontSize: '0.68rem',
              backdropFilter: 'blur(4px)',
              border: `1px solid ${FORGE_COLORS.borderColor}`,
              height: 22,
            }}
          />

          {/* Badge de Tipo de Acesso / Posse */}
          {accessType === 'admin' ? (
            <Chip
              size="small"
              icon={<AdminPanelSettings sx={{ fontSize: '13px !important', color: '#60A5FA !important' }} />}
              label="Admin"
              sx={{
                backgroundColor: 'rgba(30, 58, 138, 0.85)',
                color: '#93C5FD',
                fontWeight: 700,
                fontSize: '0.68rem',
                border: '1px solid rgba(96, 165, 250, 0.3)',
                height: 22,
              }}
            />
          ) : accessType === 'key' ? (
            <Chip
              size="small"
              icon={<Key sx={{ fontSize: '13px !important', color: '#FBBF24 !important' }} />}
              label="Chaveiro"
              sx={{
                backgroundColor: 'rgba(120, 53, 15, 0.85)',
                color: '#FDE68A',
                fontWeight: 700,
                fontSize: '0.68rem',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                height: 22,
              }}
            />
          ) : (
            <Chip
              size="small"
              icon={<CheckCircle sx={{ fontSize: '13px !important', color: `${FORGE_COLORS.orangePrimary} !important` }} />}
              label="Proprietário"
              sx={{
                backgroundColor: 'rgba(255, 122, 26, 0.2)',
                color: FORGE_COLORS.orangePrimary,
                fontWeight: 700,
                fontSize: '0.68rem',
                border: '1px solid rgba(255, 122, 26, 0.35)',
                height: 22,
              }}
            />
          )}
        </Box>

        {/* Badge de Débitos (Superior Direito) */}
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          {hasDebt ? (
            <Chip
              size="small"
              icon={<ErrorOutline sx={{ fontSize: '13px !important', color: '#EF4444 !important' }} />}
              label={`R$ ${totalDebt.toLocaleString('pt-BR')}`}
              sx={{
                backgroundColor: 'rgba(239, 68, 68, 0.18)',
                color: '#FCA5A5',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                fontWeight: 700,
                fontSize: '0.68rem',
                height: 22,
              }}
            />
          ) : (
            <Chip
              size="small"
              icon={<CheckCircle sx={{ fontSize: '13px !important', color: '#10B981 !important' }} />}
              label="Em dia"
              sx={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#6EE7B7',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontWeight: 700,
                fontSize: '0.68rem',
                height: 22,
              }}
            />
          )}
        </Box>
      </Box>

      {/* Conteúdo do Card */}
      <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {/* Nome do Imóvel / Rua */}
        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '0.95rem',
            color: FORGE_COLORS.textWhite,
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {property.street}
        </Typography>

        {/* Região / Bairro */}
        <Typography
          variant="caption"
          sx={{
            color: FORGE_COLORS.textGrey,
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <LocationOn sx={{ fontSize: 13, color: FORGE_COLORS.orangePrimary }} />
          {property.region || 'Los Santos'}
          {property.apartment ? ` • ${property.apartment}` : ''}
        </Typography>

        {/* Barra de Ações Rápidas */}
        <Box
          sx={{
            mt: 1.2,
            pt: 1,
            borderTop: `1px solid ${FORGE_COLORS.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          {/* Botão Marcar GPS */}
          <Tooltip title="Marcar rota no GPS">
            <Button
              size="small"
              variant="outlined"
              onClick={handleSetGPS}
              disabled={gpsLoading}
              startIcon={gpsLoading ? <CircularProgress size={13} sx={{ color: FORGE_COLORS.orangePrimary }} /> : <LocationOn sx={{ fontSize: 15 }} />}
              sx={{
                flex: 1,
                borderColor: 'rgba(255, 122, 26, 0.3)',
                color: FORGE_COLORS.orangePrimary,
                fontSize: '0.72rem',
                py: 0.5,
                fontWeight: 700,
                '&:hover': {
                  borderColor: FORGE_COLORS.orangePrimary,
                  backgroundColor: 'rgba(255, 122, 26, 0.08)',
                },
              }}
            >
              GPS
            </Button>
          </Tooltip>

          {/* Botão Gerenciar */}
          <Button
            size="small"
            variant="contained"
            onClick={handleOpenDetails}
            endIcon={<ArrowForward sx={{ fontSize: 15 }} />}
            sx={{
              flex: 1.4,
              backgroundColor: FORGE_COLORS.orangePrimary,
              color: '#FFFFFF',
              fontSize: '0.72rem',
              py: 0.5,
              fontWeight: 700,
              boxShadow: `0 2px 8px ${FORGE_COLORS.orangeGlowLight}`,
              '&:hover': {
                backgroundColor: FORGE_COLORS.orangeHover,
                boxShadow: `0 4px 12px ${FORGE_COLORS.orangeGlow}`,
              },
            }}
          >
            Gerenciar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PropertyCard;
