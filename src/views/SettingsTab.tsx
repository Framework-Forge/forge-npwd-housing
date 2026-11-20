import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Switch,
  Card,
  CardContent,
  Stack,
  Divider,
  Button,
  Chip,
} from '@mui/material';
import NotificationsActive from '@mui/icons-material/NotificationsActive';
import Security from '@mui/icons-material/Security';
import Key from '@mui/icons-material/Key';
import Tune from '@mui/icons-material/Tune';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import RestartAlt from '@mui/icons-material/RestartAlt';
import Check from '@mui/icons-material/Check';
import { FORGE_COLORS } from '../theme/forge.theme';
import { useSnackbar } from '../snackbar/useSnackbar';

interface AppSettings {
  notifyBillDue: boolean;
  notifyAlarm: boolean;
  notifyKeys: boolean;
  defaultFilter: 'all' | 'apartments' | 'houses';
  autoGpsOnTap: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  notifyBillDue: true,
  notifyAlarm: true,
  notifyKeys: true,
  defaultFilter: 'all',
  autoGpsOnTap: false,
};

const STORAGE_KEY = 'forge_housing_settings';

export const SettingsTab: React.FC = () => {
  const { addAlert } = useSnackbar();
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      addAlert({ message: 'Configurações restauradas para o padrão.', type: 'info' });
    } catch {
      // ignore
    }
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2, gap: 2, pb: 4 }}>
      {/* Cabeçalho */}
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '1.25rem',
            color: FORGE_COLORS.textWhite,
            lineHeight: 1.2,
          }}
        >
          Configurações
        </Typography>
        <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey }}>
          Personalize as preferências do aplicativo Forge Imóveis
        </Typography>
      </Box>

      {/* ========================================================= */}
      {/* SEÇÃO 1: ALERTAS E NOTIFICAÇÕES                           */}
      {/* ========================================================= */}
      <Card
        sx={{
          backgroundColor: FORGE_COLORS.bgCard,
          border: `1px solid ${FORGE_COLORS.borderColor}`,
          borderRadius: '12px',
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: FORGE_COLORS.orangePrimary,
              display: 'flex',
              alignItems: 'center',
              gap: 0.8,
              mb: 1.5,
              fontSize: '0.85rem',
            }}
          >
            <NotificationsActive sx={{ fontSize: 18 }} />
            Alertas & Notificações
          </Typography>

          <Stack spacing={1.5} divider={<Divider sx={{ borderColor: FORGE_COLORS.borderColor }} />}>
            {/* Aviso de faturas */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: FORGE_COLORS.textWhite, fontSize: '0.82rem' }}>
                  Aviso de Vencimento de Faturas
                </Typography>
                <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, display: 'block' }}>
                  Notificar quando água, luz ou IPTU estiverem próximos do vencimento.
                </Typography>
              </Box>
              <Switch
                checked={settings.notifyBillDue}
                onChange={(e) => updateSetting('notifyBillDue', e.target.checked)}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: FORGE_COLORS.orangePrimary,
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: FORGE_COLORS.orangePrimary,
                  },
                }}
              />
            </Box>

            {/* Alerta de invasão / alarme */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: FORGE_COLORS.textWhite, fontSize: '0.82rem' }}>
                  Alarme Residencial & Segurança
                </Typography>
                <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, display: 'block' }}>
                  Receber push no celular em caso de intrusão nos seus imóveis.
                </Typography>
              </Box>
              <Switch
                checked={settings.notifyAlarm}
                onChange={(e) => updateSetting('notifyAlarm', e.target.checked)}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: FORGE_COLORS.orangePrimary,
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: FORGE_COLORS.orangePrimary,
                  },
                }}
              />
            </Box>

            {/* Aviso de novas chaves recebidas */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: FORGE_COLORS.textWhite, fontSize: '0.82rem' }}>
                  Novas Chaves Recebidas
                </Typography>
                <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, display: 'block' }}>
                  Avisar quando outro morador conceder chave ou administração a você.
                </Typography>
              </Box>
              <Switch
                checked={settings.notifyKeys}
                onChange={(e) => updateSetting('notifyKeys', e.target.checked)}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: FORGE_COLORS.orangePrimary,
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: FORGE_COLORS.orangePrimary,
                  },
                }}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* ========================================================= */}
      {/* SEÇÃO 2: PREFERÊNCIAS DE NAVEGAÇÃO & GPS                  */}
      {/* ========================================================= */}
      <Card
        sx={{
          backgroundColor: FORGE_COLORS.bgCard,
          border: `1px solid ${FORGE_COLORS.borderColor}`,
          borderRadius: '12px',
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: FORGE_COLORS.orangePrimary,
              display: 'flex',
              alignItems: 'center',
              gap: 0.8,
              mb: 1.5,
              fontSize: '0.85rem',
            }}
          >
            <Tune sx={{ fontSize: 18 }} />
            Preferências de Exibição
          </Typography>

          <Stack spacing={1.5} divider={<Divider sx={{ borderColor: FORGE_COLORS.borderColor }} />}>
            {/* Visualização padrão da lista */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: FORGE_COLORS.textWhite, fontSize: '0.82rem', mb: 0.5 }}>
                Aba Padrão ao Abrir o Aplicativo
              </Typography>
              <Stack direction="row" spacing={0.8} sx={{ mt: 1 }}>
                {[
                  { key: 'all', label: 'Todos' },
                  { key: 'apartments', label: 'Apartamentos' },
                  { key: 'houses', label: 'Casas' },
                ].map(({ key, label }) => (
                  <Chip
                    key={key}
                    size="small"
                    label={label}
                    onClick={() => updateSetting('defaultFilter', key as any)}
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      backgroundColor: settings.defaultFilter === key ? FORGE_COLORS.orangePrimary : 'rgba(255,255,255,0.06)',
                      color: settings.defaultFilter === key ? '#FFFFFF' : FORGE_COLORS.textGrey,
                      border: `1px solid ${settings.defaultFilter === key ? FORGE_COLORS.orangePrimary : FORGE_COLORS.borderColor}`,
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* GPS automático */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: FORGE_COLORS.textWhite, fontSize: '0.82rem' }}>
                  Marcar GPS Automaticamente
                </Typography>
                <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, display: 'block' }}>
                  Traçar rota no minimapa ao entrar na página de detalhes do imóvel.
                </Typography>
              </Box>
              <Switch
                checked={settings.autoGpsOnTap}
                onChange={(e) => updateSetting('autoGpsOnTap', e.target.checked)}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: FORGE_COLORS.orangePrimary,
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: FORGE_COLORS.orangePrimary,
                  },
                }}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* ========================================================= */}
      {/* SEÇÃO 3: INFORMAÇÕES DO SISTEMA                           */}
      {/* ========================================================= */}
      <Card
        sx={{
          backgroundColor: 'rgba(255, 122, 26, 0.04)',
          border: '1px solid rgba(255, 122, 26, 0.15)',
          borderRadius: '12px',
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: FORGE_COLORS.textWhite,
              display: 'flex',
              alignItems: 'center',
              gap: 0.8,
              mb: 1,
              fontSize: '0.85rem',
            }}
          >
            <InfoOutlined sx={{ fontSize: 18, color: FORGE_COLORS.orangePrimary }} />
            Sobre o Forge Imóveis
          </Typography>

          <Stack spacing={0.6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey }}>Versão do Aplicativo</Typography>
              <Typography variant="caption" sx={{ color: FORGE_COLORS.textWhite, fontWeight: 700 }}>2.0.0 (Vite ESM)</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey }}>Ponte de Integração</Typography>
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>pr_bridge @lua54</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey }}>Design System</Typography>
              <Typography variant="caption" sx={{ color: FORGE_COLORS.orangePrimary, fontWeight: 700 }}>Forgebox UI Kit</Typography>
            </Box>
          </Stack>

          <Button
            fullWidth
            size="small"
            variant="outlined"
            onClick={handleResetSettings}
            startIcon={<RestartAlt sx={{ fontSize: 16 }} />}
            sx={{
              mt: 2,
              borderColor: FORGE_COLORS.borderColor,
              color: FORGE_COLORS.textGrey,
              fontSize: '0.72rem',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#EF4444',
                color: '#EF4444',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
              },
            }}
          >
            Restaurar Configurações Padrão
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SettingsTab;
