import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  Typography,
  CircularProgress,
  Stack,
  Alert,
  IconButton,
} from '@mui/material';
import Warning from '@mui/icons-material/Warning';
import LocalPolice from '@mui/icons-material/LocalPolice';
import Videocam from '@mui/icons-material/Videocam';
import NotificationsOff from '@mui/icons-material/NotificationsOff';
import Close from '@mui/icons-material/Close';
import LocationOn from '@mui/icons-material/LocationOn';
import { FORGE_COLORS } from '../theme/forge.theme';
import HousingService from '../services/housing.service';
import { useSnackbar } from '../snackbar/useSnackbar';
import { useHistory } from 'react-router-dom';

interface EmergencyAlarmDialogProps {
  open: boolean;
  propertyId: string;
  street: string;
  incidentAt: number;
  revision: number;
  onResolved: () => void;
  onClose: () => void;
  onDisarmSuccess?: () => void;
  onViewCameras?: () => void;
}

export const EmergencyAlarmDialog: React.FC<EmergencyAlarmDialogProps> = ({
  open,
  propertyId,
  street,
  incidentAt,
  revision,
  onResolved,
  onClose,
  onDisarmSuccess,
  onViewCameras,
}) => {
  const { addAlert } = useSnackbar();
  const history = useHistory();
  const [loadingPolice, setLoadingPolice] = useState(false);
  const [policeDispatched, setPoliceDispatched] = useState(false);
  const [loadingDisarm, setLoadingDisarm] = useState(false);

  useEffect(() => { setPoliceDispatched(false); }, [propertyId, incidentAt]);
  const handleDismiss = async () => {
    if (loadingPolice || loadingDisarm) return;
    setLoadingDisarm(true);
    try {
      const res = await HousingService.resolveSecurityIncident(propertyId, incidentAt, 'dismiss');
      if (res.status === 'ok') { onResolved(); onClose(); }
      else addAlert({ message: res.message || 'Não foi possível dispensar o alerta.', type: 'error' });
    } catch { addAlert({ message: 'Falha de comunicação.', type: 'error' }); }
    finally { setLoadingDisarm(false); }
  };
  // Aciona a polícia via ps-dispatch (10-90)
  const handleDispatchPolice = async () => {
    setLoadingPolice(true);
    try {
      const res = await HousingService.resolveSecurityIncident(propertyId, incidentAt, 'dispatch');
      if (res.status === 'ok') {
        setPoliceDispatched(true);
        onResolved();
        onClose();
        addAlert({
          message: '🚨 Código 10-90 despachado para todas as viaturas em serviço!',
          type: 'success',
        });
      } else {
        addAlert({
          message: res.message || 'Falha ao acionar a polícia.',
          type: 'error',
        });
      }
    } catch {
      addAlert({
        message: 'Erro de comunicação ao acionar a polícia.',
        type: 'error',
      });
    } finally {
      setLoadingPolice(false);
    }
  };

  // Abre a visualização de câmeras
  const handleViewCameras = () => {
    if (onViewCameras) {
      onViewCameras();
    } else {
      onClose();
      history.push(`/housing/property/${propertyId}`);
    }
  };

  // Desativa o alarme da casa e cancela a sirene
  const handleDisarmAlarm = async () => {
    setLoadingDisarm(true);
    try {
      const res = await HousingService.toggleSecurityArm(propertyId, 'alarm', false, revision);
      if (res.status === 'ok') {
        addAlert({
          message: 'Alarme desativado e silenciado com sucesso.',
          type: 'success',
        });
        onResolved();
        if (onDisarmSuccess) onDisarmSuccess();
        onClose();
      } else {
        addAlert({
          message: res.message || 'Falha ao desativar o alarme.',
          type: 'error',
        });
      }
    } catch {
      addAlert({
        message: 'Erro ao desativar o alarme.',
        type: 'error',
      });
    } finally {
      setLoadingDisarm(false);
    }
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 1300,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
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
          maxHeight: '94%',
          backgroundColor: '#121216',
          border: '1px solid rgba(239, 68, 68, 0.55)',
          borderRadius: '16px',
          boxShadow: '0 0 25px rgba(239, 68, 68, 0.35)',
          color: FORGE_COLORS.textWhite,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': { background: 'rgba(239, 68, 68, 0.3)', borderRadius: '4px' },
        }}
      >
        {/* Faixa superior de alerta pulsante */}
        <Box
          sx={{
            height: 5,
            width: '100%',
            background: 'linear-gradient(90deg, #EF4444, #F59E0B, #EF4444)',
            backgroundSize: '200% 100%',
          }}
        />

        {/* Cabeçalho */}
        <Box sx={{ pt: 2, pb: 1, px: 2, display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#EF4444',
              flexShrink: 0,
            }}
          >
            <Warning sx={{ fontSize: 22 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: '0.98rem',
                color: '#EF4444',
                lineHeight: 1.2,
              }}
            >
              INTRUSÃO DETECTADA!
            </Typography>
            <Typography variant="caption" sx={{ color: '#FCA5A5', fontSize: '0.7rem', fontWeight: 600 }}>
              Alarme residencial violado em tempo real
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ color: FORGE_COLORS.textGrey }}>
            <Close fontSize="small" />
          </IconButton>
        </Box>

        {/* Conteúdo */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Stack spacing={1.5}>
            {/* Card do Imóvel Violado */}
            <Box
              sx={{
                p: 1.5,
                borderRadius: '10px',
                backgroundColor: 'rgba(24, 24, 28, 0.8)',
                border: `1px solid ${FORGE_COLORS.borderColor}`,
              }}
            >
              <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, fontSize: '0.68rem', textTransform: 'uppercase' }}>
                Local da Ocorrência
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: FORGE_COLORS.textWhite,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mt: 0.2,
                }}
              >
                <LocationOn sx={{ fontSize: 16, color: FORGE_COLORS.orangePrimary }} />
                {street} #{propertyId}
              </Typography>
            </Box>

            {policeDispatched ? (
              <Alert
                severity="success"
                icon={<LocalPolice fontSize="small" />}
                sx={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#6EE7B7',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                Polícia acionada! O chamado 10-90 foi enviado para o rádio das viaturas com as coordenadas do seu imóvel.
              </Alert>
            ) : (
              <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, fontSize: '0.73rem', lineHeight: 1.4 }}>
                O sensor da residência disparou. Você pode acionar a polícia imediatamente via 10-90, conferir as câmeras ao vivo ou desarmar o sistema caso seja alarme falso.
              </Typography>
            )}

            {/* Botão de Emergência: Acionar Polícia */}
            {!policeDispatched && (
              <Button
                fullWidth
                variant="contained"
                disabled={loadingPolice}
                onClick={handleDispatchPolice}
                startIcon={loadingPolice ? <CircularProgress size={16} color="inherit" /> : <LocalPolice />}
                sx={{
                  py: 1.1,
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)',
                  '&:hover': {
                    backgroundColor: '#B91C1C',
                  },
                }}
              >
                {loadingPolice ? 'Acionando Polícia...' : '🚨 ACIONAR POLÍCIA (10-90)'}
              </Button>
            )}

            {/* Botão Secundário: Visualizar Câmeras */}
            <Button
              fullWidth
              variant="outlined"
              onClick={handleViewCameras}
              startIcon={<Videocam />}
              sx={{
                py: 0.9,
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.78rem',
                borderColor: FORGE_COLORS.orangePrimary,
                color: FORGE_COLORS.orangePrimary,
                backgroundColor: 'rgba(255, 122, 26, 0.08)',
                '&:hover': {
                  borderColor: FORGE_COLORS.orangePrimary,
                  backgroundColor: 'rgba(255, 122, 26, 0.18)',
                },
              }}
            >
              Visualizar Câmeras da Casa
            </Button>

            {/* Botão Terciário: Desarmar Alarme */}
            <Button
              fullWidth
              variant="text"
              disabled={loadingDisarm}
              onClick={handleDisarmAlarm}
              startIcon={loadingDisarm ? <CircularProgress size={14} color="inherit" /> : <NotificationsOff />}
              sx={{
                py: 0.6,
                fontSize: '0.72rem',
                color: FORGE_COLORS.textGrey,
                '&:hover': {
                  color: '#EF4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                },
              }}
            >
              {loadingDisarm ? 'Desarmando...' : 'Desarmar / Silenciar Alarme'}
            </Button>

            <Button
              fullWidth
              size="small"
              onClick={handleDismiss}
              disabled={loadingPolice || loadingDisarm}
              startIcon={<Close sx={{ fontSize: 16 }} />}
              sx={{
                color: FORGE_COLORS.textMuted,
                fontSize: '0.74rem',
                fontWeight: 600,
              }}
            >
              Dispensar Alerta
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default EmergencyAlarmDialog;
