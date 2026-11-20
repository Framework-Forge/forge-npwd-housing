import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Stack,
  Divider,
  Alert,
} from '@mui/material';
import { useParams, useHistory } from 'react-router-dom';
import ArrowBack from '@mui/icons-material/ArrowBack';
import LocationOn from '@mui/icons-material/LocationOn';
import ReceiptLong from '@mui/icons-material/ReceiptLong';
import Key from '@mui/icons-material/Key';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import PersonAdd from '@mui/icons-material/PersonAdd';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Paid from '@mui/icons-material/Paid';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Warning from '@mui/icons-material/Warning';
import SwapHoriz from '@mui/icons-material/SwapHoriz';
import Apartment from '@mui/icons-material/Apartment';
import Home from '@mui/icons-material/Home';
import Security from '@mui/icons-material/Security';
import Shield from '@mui/icons-material/Shield';
import NotificationsActive from '@mui/icons-material/NotificationsActive';
import Videocam from '@mui/icons-material/Videocam';
import Visibility from '@mui/icons-material/Visibility';
import Refresh from '@mui/icons-material/Refresh';
import HousingService from '../services/housing.service';
import { PropertyData, PropertyManagementData, NearbyPlayer, SecurityState, SecurityCamera } from '../types/property';
import { FORGE_COLORS } from '../theme/forge.theme';
import { useSnackbar } from '../snackbar/useSnackbar';
import EmergencyAlarmDialog from '../components/EmergencyAlarmDialog';
import InPhoneModal from '../components/InPhoneModal';

export const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { addAlert } = useSnackbar();

  const [activeTab, setActiveTab] = useState<'bills' | 'security' | 'access' | 'transfer'>('bills');
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [details, setDetails] = useState<PropertyManagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Estado de Segurança e Câmeras
  const [securityState, setSecurityState] = useState<SecurityState | null>(null);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [cameraSearch, setCameraSearch] = useState('');
  const [cameraFilter, setCameraFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [connectingCameraId, setConnectingCameraId] = useState<string | null>(null);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  // Modais de ação
  const [nearbyPlayers, setNearbyPlayers] = useState<NearbyPlayer[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [openAccessModal, setOpenAccessModal] = useState<'giveKey' | 'giveAdmin' | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<NearbyPlayer | null>(null);

  // Modal de confirmação de pagamento
  const [payConfirmBill, setPayConfirmBill] = useState<{ key: string; label: string; amount: number } | null>(null);

  // Estado de Transferência
  const [transferTarget, setTransferTarget] = useState<NearbyPlayer | null>(null);
  const [transferPrice, setTransferPrice] = useState<number>(0);
  const [openTransferConfirm, setOpenTransferConfirm] = useState(false);

  // Carrega estado de segurança
  const loadSecurityData = useCallback(async () => {
    setSecurityLoading(true);
    try {
      const res = await HousingService.getSecurityState(id);
      if (res.status === 'ok' && res.data) {
        setSecurityState(res.data);
      }
    } catch {
      // silencioso
    } finally {
      setSecurityLoading(false);
    }
  }, [id]);

  // Carrega os dados da propriedade
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Busca propriedades para dados cadastrais
      const propRes = await HousingService.getProperties();
      if (propRes.status === 'ok' && propRes.data) {
        const all = [...(propRes.data.owned || []), ...(propRes.data.access || [])];
        const current = all.find((p) => String(p.property_id) === String(id));
        if (current) setProperty(current);
      }

      // 2. Busca detalhes de gestão
      const detailsRes = await HousingService.getPropertyDetails(id);
      if (detailsRes.status === 'ok' && detailsRes.data) {
        setDetails(detailsRes.data);
        if (detailsRes.data.transfer) {
          setTransferPrice(detailsRes.data.transfer.minimumPrice || 0);
        }
      } else {
        addAlert({ message: detailsRes.message || 'Erro ao carregar gestão do imóvel.', type: 'error' });
      }

      // 3. Busca segurança e câmeras
      await loadSecurityData();
    } catch {
      addAlert({ message: 'Erro de comunicação ao consultar detalhes.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [id, addAlert, loadSecurityData]);

  // Ação de Ativar/Desativar Alarme ou Monitoramento
  const handleToggleArm = async (kind: 'alarm' | 'security') => {
    if (!securityState) return;
    const isArmed = kind === 'alarm' ? securityState.alarmArmed : securityState.securityArmed;
    setActionLoading(true);
    try {
      const res = await HousingService.toggleSecurityArm(id, kind, !isArmed, securityState.revision);
      if (res.status === 'ok' && res.data) {
        setSecurityState(res.data);
        addAlert({ message: res.message || (!isArmed ? 'Sistema ativado.' : 'Sistema desativado.'), type: 'success' });
      } else {
        addAlert({ message: res.message || 'Falha ao alterar estado do sistema.', type: 'error' });
        loadSecurityData();
      }
    } catch {
      addAlert({ message: 'Erro de comunicação ao acionar sistema.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  // Ação de Visualizar Câmera em Tempo Real
  const handleViewCamera = async (cam: SecurityCamera) => {
    if (!cam.online) {
      addAlert({ message: 'Esta câmera está desativada ou danificada.', type: 'warning' });
      return;
    }
    setConnectingCameraId(cam.id);
    try {
      await HousingService.viewSecurityCamera(id, cam.id, 'normal');
      loadSecurityData();
    } catch {
      addAlert({ message: 'Falha ao conectar à transmissão da câmera.', type: 'error' });
    } finally {
      setConnectingCameraId(null);
    }
  };

  const camerasList: SecurityCamera[] = useMemo(() => {
    if (!securityState?.cameras) return [];
    if (Array.isArray(securityState.cameras)) return securityState.cameras;
    return Object.values(securityState.cameras);
  }, [securityState]);

  const filteredCameras = useMemo(() => {
    return camerasList.filter((c) => {
      const matchesFilter =
        cameraFilter === 'all' || (cameraFilter === 'online' ? c.online : !c.online);
      const searchLower = cameraSearch.toLowerCase();
      const matchesSearch =
        !cameraSearch ||
        (c.label && c.label.toLowerCase().includes(searchLower)) ||
        c.id.toLowerCase().includes(searchLower);
      return matchesFilter && matchesSearch;
    });
  }, [camerasList, cameraFilter, cameraSearch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Carrega jogadores próximos ao abrir modal
  const fetchNearby = async () => {
    setLoadingPlayers(true);
    try {
      const res = await HousingService.getNearbyPlayers();
      if (res.status === 'ok' && res.data) {
        setNearbyPlayers(res.data);
      }
    } catch {
      addAlert({ message: 'Erro ao listar jogadores próximos.', type: 'error' });
    } finally {
      setLoadingPlayers(false);
    }
  };

  // Traçar rota GPS
  const handleGPS = async () => {
    try {
      let coords: { x: number; y: number; z?: number } | undefined;
      const doors = property?.door_data;
      if (Array.isArray(doors) && doors[1]) {
        coords = doors[1].origin || doors[1];
      } else if (doors && typeof doors === 'object' && 'x' in doors) {
        coords = (doors as any).origin || doors;
      }

      const res = await HousingService.setWaypoint(id, coords);
      if (res.status === 'ok') {
        addAlert({ message: res.message || 'GPS marcado no mapa.', type: 'success' });
      }
    } catch {
      addAlert({ message: 'Falha ao traçar rota no GPS.', type: 'error' });
    }
  };

  // Pagamento de Faturas
  const handleConfirmPay = async () => {
    if (!payConfirmBill) return;
    setActionLoading(true);
    try {
      const res = await HousingService.payBill(id, payConfirmBill.key as any);
      if (res.status === 'ok') {
        addAlert({ message: res.message || 'Fatura paga com sucesso!', type: 'success' });
        setPayConfirmBill(null);
        loadData();
      } else {
        addAlert({ message: res.message || 'Erro ao pagar fatura.', type: 'error' });
      }
    } catch {
      addAlert({ message: 'Erro ao processar pagamento.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  // Conceder Acesso (Chave ou Admin)
  const handleGrantAccess = async () => {
    if (!selectedPlayer || !openAccessModal) return;
    setActionLoading(true);
    try {
      const isGrantAdmin = openAccessModal === 'giveAdmin';
      const res = isGrantAdmin
        ? await HousingService.giveAdmin(id, selectedPlayer.src)
        : await HousingService.giveKey(id, selectedPlayer.src);

      if (res.status === 'ok') {
        addAlert({ message: res.message || 'Acesso concedido com sucesso!', type: 'success' });
        setOpenAccessModal(null);
        setSelectedPlayer(null);
        loadData();
      } else {
        addAlert({ message: res.message || 'Falha ao conceder acesso.', type: 'error' });
      }
    } catch {
      addAlert({ message: 'Erro ao registrar permissão.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  // Revogar Acesso
  const handleRevoke = async (type: 'key' | 'admin', citizenid: string, name: string) => {
    setActionLoading(true);
    try {
      const res =
        type === 'admin'
          ? await HousingService.revokeAdmin(id, citizenid)
          : await HousingService.revokeKey(id, citizenid);

      if (res.status === 'ok') {
        addAlert({ message: `${type === 'admin' ? 'Administrador' : 'Chave'} de ${name} revogada.`, type: 'success' });
        loadData();
      } else {
        addAlert({ message: res.message || 'Erro ao revogar permissão.', type: 'error' });
      }
    } catch {
      addAlert({ message: 'Erro ao processar revogação.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  // Transferência de Propriedade
  const handleTransfer = async () => {
    if (!transferTarget || !details?.transfer) return;
    setActionLoading(true);
    try {
      const res = await HousingService.transferProperty(
        id,
        transferTarget.src,
        transferPrice,
        details.transfer.revision
      );
      if (res.status === 'ok') {
        addAlert({ message: res.message || 'Proposta de transferência enviada ao comprador.', type: 'success' });
        setOpenTransferConfirm(false);
        history.push('/housing');
      } else {
        addAlert({ message: res.message || 'Falha ao enviar proposta de transferência.', type: 'error' });
      }
    } catch {
      addAlert({ message: 'Erro ao transferir imóvel.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  // Total de débitos acumulados
  const totalDebt = useMemo(() => {
    const taxes = details?.taxes || property?.tax_data || {};
    return (
      (Number(taxes.luz?.balance) || 0) +
      (Number(taxes.agua?.balance) || 0) +
      (Number(taxes.iptu?.balance) || 0) +
      (Number(taxes.security?.balance) || 0)
    );
  }, [details, property]);

  const isApartment =
    property?.category === 'apartment' ||
    Boolean(property?.apartment && property.apartment !== '');

  if (loading && !details) {
    return (
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <CircularProgress sx={{ color: FORGE_COLORS.orangePrimary }} />
        <Typography variant="caption" sx={{ mt: 2, color: FORGE_COLORS.textGrey }}>
          Carregando gestão do imóvel #{id}...
        </Typography>
      </Box>
    );
  }

  const taxes = details?.taxes || property?.tax_data || {};
  const taxEntries: { key: string; label: string; data?: any }[] = [
    { key: 'luz', label: 'Energia Elétrica', data: taxes.luz },
    { key: 'agua', label: 'Água e Saneamento', data: taxes.agua },
    { key: 'iptu', label: 'IPTU Residencial', data: taxes.iptu },
  ];
  if (taxes.security) {
    taxEntries.push({ key: 'security', label: 'Segurança Monitorada', data: taxes.security });
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2, gap: 1.5, pb: 4, position: 'relative' }}>
      {/* Top Header com Botão Voltar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton
          size="small"
          onClick={() => history.push('/housing')}
          sx={{
            color: FORGE_COLORS.textWhite,
            backgroundColor: FORGE_COLORS.bgCard,
            border: `1px solid ${FORGE_COLORS.borderColor}`,
            '&:hover': {
              borderColor: FORGE_COLORS.orangePrimary,
              color: FORGE_COLORS.orangePrimary,
            },
          }}
        >
          <ArrowBack fontSize="small" />
        </IconButton>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: '1.05rem',
              color: FORGE_COLORS.textWhite,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {property?.street || `Imóvel #${id}`}
          </Typography>
          <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOn sx={{ fontSize: 13, color: FORGE_COLORS.orangePrimary }} />
            {property?.region || 'San Andreas'}
          </Typography>
        </Box>

        <Button
          size="small"
          variant="outlined"
          onClick={handleGPS}
          startIcon={<LocationOn sx={{ fontSize: 14 }} />}
          sx={{
            borderColor: 'rgba(255, 122, 26, 0.4)',
            color: FORGE_COLORS.orangePrimary,
            fontWeight: 700,
            fontSize: '0.72rem',
            px: 1,
            py: 0.4,
            '&:hover': {
              borderColor: FORGE_COLORS.orangePrimary,
              backgroundColor: 'rgba(255, 122, 26, 0.1)',
            },
          }}
        >
          GPS
        </Button>
      </Box>

      {/* Badges do Imóvel */}
      <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
        <Chip
          size="small"
          icon={isApartment ? <Apartment sx={{ fontSize: '13px !important' }} /> : <Home sx={{ fontSize: '13px !important' }} />}
          label={isApartment ? 'Apartamento' : 'Casa'}
          sx={{
            backgroundColor: FORGE_COLORS.bgCard,
            color: FORGE_COLORS.textWhite,
            fontWeight: 700,
            fontSize: '0.68rem',
            border: `1px solid ${FORGE_COLORS.borderColor}`,
          }}
        />
        <Chip
          size="small"
          icon={details?.isOwner ? <CheckCircle sx={{ fontSize: '13px !important', color: `${FORGE_COLORS.orangePrimary} !important` }} /> : <Key sx={{ fontSize: '13px !important' }} />}
          label={details?.isOwner ? 'Proprietário' : details?.isAdmin ? 'Administrador' : 'Chaveiro'}
          sx={{
            backgroundColor: details?.isOwner ? 'rgba(255, 122, 26, 0.15)' : 'rgba(30, 58, 138, 0.25)',
            color: details?.isOwner ? FORGE_COLORS.orangePrimary : '#93C5FD',
            fontWeight: 700,
            fontSize: '0.68rem',
            border: `1px solid ${details?.isOwner ? 'rgba(255, 122, 26, 0.35)' : 'rgba(96, 165, 250, 0.3)'}`,
          }}
        />
        <Chip
          size="small"
          label={totalDebt > 0 ? `Débitos: R$ ${totalDebt.toLocaleString('pt-BR')}` : 'Faturas em dia'}
          sx={{
            backgroundColor: totalDebt > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            color: totalDebt > 0 ? '#FCA5A5' : '#6EE7B7',
            fontWeight: 700,
            fontSize: '0.68rem',
            border: `1px solid ${totalDebt > 0 ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.3)'}`,
          }}
        />
      </Box>

      {/* Navegação por Sub-Abas */}
      <Tabs
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        variant="fullWidth"
        sx={{
          minHeight: 38,
          backgroundColor: FORGE_COLORS.bgCard,
          borderRadius: '10px',
          border: `1px solid ${FORGE_COLORS.borderColor}`,
          p: 0.4,
          '& .MuiTabs-indicator': {
            backgroundColor: FORGE_COLORS.orangePrimary,
            height: 3,
            borderRadius: '3px',
          },
          '& .MuiTab-root': {
            minHeight: 34,
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'none',
            color: FORGE_COLORS.textGrey,
            transition: 'all 0.2s',
            '&.Mui-selected': {
              color: FORGE_COLORS.orangePrimary,
            },
          },
        }}
      >
        <Tab icon={<ReceiptLong sx={{ fontSize: 15 }} />} iconPosition="start" label="Contas" value="bills" sx={{ minWidth: 0, px: 0.8 }} />
        <Tab icon={<Security sx={{ fontSize: 15 }} />} iconPosition="start" label="Segurança" value="security" sx={{ minWidth: 0, px: 0.8 }} />
        <Tab icon={<Key sx={{ fontSize: 15 }} />} iconPosition="start" label="Acessos" value="access" sx={{ minWidth: 0, px: 0.8 }} />
        <Tab icon={<SwapHoriz sx={{ fontSize: 15 }} />} iconPosition="start" label="Venda" value="transfer" sx={{ minWidth: 0, px: 0.8 }} />
      </Tabs>

      {/* ========================================================= */}
      {/* ABA 1: CONTAS E FATURAS                                   */}
      {/* ========================================================= */}
      {activeTab === 'bills' && (
        <Stack spacing={1.5}>
          {/* Card Resumo do Total de Débitos */}
          <Card
            sx={{
              backgroundColor: totalDebt > 0 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
              border: `1px solid ${totalDebt > 0 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Saldo Devedor Total
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 800,
                  color: totalDebt > 0 ? '#EF4444' : '#10B981',
                  my: 0.5,
                }}
              >
                R$ {totalDebt.toLocaleString('pt-BR')}
              </Typography>

              {totalDebt > 0 && (
                <Button
                  fullWidth
                  variant="contained"
                  size="small"
                  onClick={() => setPayConfirmBill({ key: 'all', label: 'Todas as Contas', amount: totalDebt })}
                  sx={{
                    mt: 1,
                    backgroundColor: FORGE_COLORS.orangePrimary,
                    color: '#FFFFFF',
                    fontWeight: 700,
                    '&:hover': { backgroundColor: FORGE_COLORS.orangeHover },
                  }}
                >
                  Pagar Todas as Contas (R$ {totalDebt.toLocaleString('pt-BR')})
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Lista de Faturas Individuais */}
          {taxEntries.map(({ key, label, data }) => {
            const balance = Number(data?.balance) || 0;
            const amount = Number(data?.amount) || 0;
            const daysLeft = data?.nextDueAt
              ? Math.max(0, Math.ceil((data.nextDueAt - Math.floor(Date.now() / 1000)) / 86400))
              : null;

            return (
              <Box
                key={key}
                sx={{
                  backgroundColor: FORGE_COLORS.bgCard,
                  border: `1px solid ${FORGE_COLORS.borderColor}`,
                  borderRadius: '10px',
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: FORGE_COLORS.textWhite, fontSize: '0.85rem' }}>
                    {data?.label || label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, display: 'block' }}>
                    Fatura: R$ {amount.toLocaleString('pt-BR')} • Ciclo: a cada {data?.intervalDays || 7} dias
                  </Typography>
                  <Typography variant="caption" sx={{ color: balance > 0 ? '#FCA5A5' : '#6EE7B7' }}>
                    {balance > 0 ? `Pendente: R$ ${balance.toLocaleString('pt-BR')}` : 'Status: Em dia'}
                    {daysLeft !== null && ` • Próx. cobrança em ${daysLeft} dia(s)`}
                  </Typography>
                </Box>

                <Button
                  size="small"
                  variant="outlined"
                  disabled={balance <= 0 || actionLoading}
                  onClick={() => setPayConfirmBill({ key, label: data?.label || label, amount: balance })}
                  sx={{
                    borderColor: balance > 0 ? FORGE_COLORS.orangePrimary : FORGE_COLORS.borderColor,
                    color: balance > 0 ? FORGE_COLORS.orangePrimary : FORGE_COLORS.textMuted,
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    minWidth: 70,
                  }}
                >
                  {balance > 0 ? 'Pagar' : 'Pago'}
                </Button>
              </Box>
            );
          })}
        </Stack>
      )}

      {/* ========================================================= */}
      {/* ABA SEGURANÇA E CÂMERAS                                   */}
      {/* ========================================================= */}
      {activeTab === 'security' && (
        <Stack spacing={1.5}>
          {/* Header com Atualizar */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: FORGE_COLORS.textWhite, fontSize: '0.88rem' }}>
                Segurança da Residência
              </Typography>
              <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, fontSize: '0.72rem' }}>
                Portas, alarmes e câmeras monitoram este imóvel.
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={loadSecurityData}
              disabled={securityLoading}
              sx={{
                color: FORGE_COLORS.textGrey,
                border: `1px solid ${FORGE_COLORS.borderColor}`,
                backgroundColor: FORGE_COLORS.bgCard,
                '&:hover': { color: FORGE_COLORS.orangePrimary, borderColor: FORGE_COLORS.orangePrimary },
              }}
            >
              <Refresh fontSize="small" sx={{ animation: securityLoading ? 'spin 1s linear infinite' : 'none' }} />
            </IconButton>
          </Box>

          {/* Alerta de Incidente se houver - Clicável para abrir Popup de Emergência */}
          {securityState?.incident && (
            <Card
              onClick={() => setEmergencyOpen(true)}
              sx={{
                cursor: 'pointer',
                backgroundColor: 'rgba(239, 68, 68, 0.16)',
                border: '1px solid #EF4444',
                borderRadius: 2,
                p: 1.5,
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 0 12px rgba(239, 68, 68, 0.35)',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.24)',
                  borderColor: '#F87171',
                  transform: 'scale(1.01)',
                },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flex: 1, minWidth: 0 }}>
                  <Warning sx={{ color: '#EF4444', fontSize: 28, flexShrink: 0 }} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ color: '#FCA5A5', fontWeight: 800, letterSpacing: '0.02em', fontSize: '0.8rem' }}>
                      INVASÃO DETECTADA!
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#FECACA', display: 'block', fontSize: '0.7rem' }}>
                      {securityState.incident.dispatched
                        ? 'Polícia já acionada. Clique para gerenciar ações.'
                        : 'Alarme sonoro ativo. Clique para abrir opções.'}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label="Ações"
                  size="small"
                  sx={{
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.68rem',
                    height: 22,
                    cursor: 'pointer',
                  }}
                />
              </Stack>
            </Card>
          )}

          {/* Grid dos Controles: Alarme Residencial e Segurança Monitorada */}
          <Stack spacing={1.2}>
            {/* 1. Alarme Residencial */}
            <Card
              sx={{
                backgroundColor: FORGE_COLORS.bgCard,
                border: `1px solid ${securityState?.alarmArmed ? 'rgba(255, 122, 26, 0.4)' : FORGE_COLORS.borderColor}`,
                borderRadius: '12px',
                boxShadow: securityState?.alarmArmed ? '0 0 12px rgba(255, 122, 26, 0.15)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <CardContent sx={{ p: 1.8, '&:last-child': { pb: 1.8 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NotificationsActive sx={{ fontSize: 20, color: securityState?.alarmArmed ? FORGE_COLORS.orangePrimary : FORGE_COLORS.textGrey }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: FORGE_COLORS.textWhite, fontSize: '0.85rem' }}>
                      Alarme Residencial
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={securityState?.alarmArmed ? 'Ativo' : 'Desativado'}
                    sx={{
                      height: 22,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      backgroundColor: securityState?.alarmArmed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(113, 113, 122, 0.15)',
                      color: securityState?.alarmArmed ? '#34D399' : '#A1A1AA',
                      border: `1px solid ${securityState?.alarmArmed ? 'rgba(16, 185, 129, 0.35)' : 'rgba(113, 113, 122, 0.3)'}`,
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, display: 'block', mb: 1.5, fontSize: '0.72rem' }}>
                  Avisa o proprietário online ao detectar arrombamento ou presença não autorizada.
                </Typography>
                <Button
                  fullWidth
                  size="small"
                  variant={securityState?.alarmArmed ? 'outlined' : 'contained'}
                  disabled={actionLoading || (!securityState?.alarm && !securityState?.security)}
                  onClick={() => handleToggleArm('alarm')}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    py: 0.6,
                    borderRadius: '8px',
                    backgroundColor: !securityState?.alarmArmed ? FORGE_COLORS.orangePrimary : 'transparent',
                    borderColor: securityState?.alarmArmed ? 'rgba(239, 68, 68, 0.5)' : 'transparent',
                    color: securityState?.alarmArmed ? '#EF4444' : '#FFFFFF',
                    '&:hover': {
                      backgroundColor: !securityState?.alarmArmed ? '#E06510' : 'rgba(239, 68, 68, 0.1)',
                      borderColor: securityState?.alarmArmed ? '#EF4444' : 'transparent',
                    },
                  }}
                >
                  {securityState?.alarmArmed ? 'Desativar Alarme' : 'Ativar Alarme'}
                </Button>
              </CardContent>
            </Card>

            {/* 2. Segurança Monitorada */}
            <Card
              sx={{
                backgroundColor: FORGE_COLORS.bgCard,
                border: `1px solid ${securityState?.securityArmed ? 'rgba(59, 130, 246, 0.4)' : FORGE_COLORS.borderColor}`,
                borderRadius: '12px',
                boxShadow: securityState?.securityArmed ? '0 0 12px rgba(59, 130, 246, 0.15)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <CardContent sx={{ p: 1.8, '&:last-child': { pb: 1.8 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Shield sx={{ fontSize: 20, color: securityState?.securityArmed ? '#3B82F6' : FORGE_COLORS.textGrey }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: FORGE_COLORS.textWhite, fontSize: '0.85rem' }}>
                      Segurança Monitorada
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={securityState?.securityArmed ? 'Ativa' : 'Desativada'}
                    sx={{
                      height: 22,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      backgroundColor: securityState?.securityArmed ? 'rgba(59, 130, 246, 0.15)' : 'rgba(113, 113, 122, 0.15)',
                      color: securityState?.securityArmed ? '#60A5FA' : '#A1A1AA',
                      border: `1px solid ${securityState?.securityArmed ? 'rgba(59, 130, 246, 0.35)' : 'rgba(113, 113, 122, 0.3)'}`,
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, display: 'block', mb: 1.5, fontSize: '0.72rem' }}>
                  Avisa o proprietário e dispara despacho policial de emergência após 120s sem desarme.
                </Typography>
                <Button
                  fullWidth
                  size="small"
                  variant={securityState?.securityArmed ? 'outlined' : 'contained'}
                  disabled={actionLoading || !securityState?.security}
                  onClick={() => handleToggleArm('security')}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    py: 0.6,
                    borderRadius: '8px',
                    backgroundColor: !securityState?.securityArmed ? '#2563EB' : 'transparent',
                    borderColor: securityState?.securityArmed ? 'rgba(239, 68, 68, 0.5)' : 'transparent',
                    color: securityState?.securityArmed ? '#EF4444' : '#FFFFFF',
                    '&:hover': {
                      backgroundColor: !securityState?.securityArmed ? '#1D4ED8' : 'rgba(239, 68, 68, 0.1)',
                      borderColor: securityState?.securityArmed ? '#EF4444' : 'transparent',
                    },
                  }}
                >
                  {securityState?.securityArmed ? 'Desativar Monitoramento' : 'Ativar Monitoramento'}
                </Button>
              </CardContent>
            </Card>

            {/* 3. Ponto de Desarme Físico */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1.5,
                py: 1,
                borderRadius: '8px',
                backgroundColor: 'rgba(24, 24, 28, 0.6)',
                border: `1px dashed ${FORGE_COLORS.borderColor}`,
              }}
            >
              <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, fontSize: '0.72rem' }}>
                Ponto de desarme físico:
              </Typography>
              <Chip
                size="small"
                label={securityState?.panel ? 'Definido • Circuit Breaker' : 'Pendente de Instalação'}
                sx={{
                  height: 20,
                  fontSize: '0.64rem',
                  fontWeight: 700,
                  backgroundColor: securityState?.panel ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: securityState?.panel ? '#34D399' : '#FBBF24',
                }}
              />
            </Box>
          </Stack>

          <Divider sx={{ borderColor: FORGE_COLORS.borderColor, my: 0.5 }} />

          {/* Seção Câmeras de Segurança */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: FORGE_COLORS.textWhite, fontSize: '0.88rem' }}>
              Câmeras de Segurança • {camerasList.length}
            </Typography>
          </Box>

          {/* Barra de Pesquisa e Filtro de Câmeras */}
          {camerasList.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Buscar câmera..."
                value={cameraSearch}
                onChange={(e) => setCameraSearch(e.target.value)}
                sx={{
                  flex: 1,
                  '& .MuiInputBase-root': {
                    height: 34,
                    fontSize: '0.75rem',
                    backgroundColor: FORGE_COLORS.bgCard,
                    borderRadius: '8px',
                  },
                }}
              />
              <Stack direction="row" spacing={0.5}>
                {(['all', 'online', 'offline'] as const).map((filter) => (
                  <Chip
                    key={filter}
                    size="small"
                    clickable
                    onClick={() => setCameraFilter(filter)}
                    label={filter === 'all' ? 'Todas' : filter === 'online' ? 'Ativas' : 'Off'}
                    sx={{
                      height: 34,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      backgroundColor: cameraFilter === filter ? FORGE_COLORS.orangePrimary : FORGE_COLORS.bgCard,
                      color: cameraFilter === filter ? '#FFFFFF' : FORGE_COLORS.textGrey,
                      border: `1px solid ${cameraFilter === filter ? FORGE_COLORS.orangePrimary : FORGE_COLORS.borderColor}`,
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Lista das Câmeras */}
          {filteredCameras.length === 0 ? (
            <Box
              sx={{
                p: 3,
                textAlign: 'center',
                backgroundColor: FORGE_COLORS.bgCard,
                borderRadius: '12px',
                border: `1px solid ${FORGE_COLORS.borderColor}`,
              }}
            >
              <Videocam sx={{ fontSize: 36, color: FORGE_COLORS.textGrey, mb: 1, opacity: 0.5 }} />
              <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, display: 'block', fontSize: '0.75rem' }}>
                {camerasList.length === 0
                  ? 'Nenhuma câmera de segurança instalada neste imóvel.'
                  : 'Nenhuma câmera encontrada com os filtros atuais.'}
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {filteredCameras.map((cam) => {
                const hasImage = cam.image && (cam.image.startsWith('data:image/webp;base64,') || cam.image.startsWith('data:image/jpeg;base64,'));
                const isConnecting = connectingCameraId === cam.id;

                return (
                  <Card
                    key={cam.id}
                    sx={{
                      backgroundColor: FORGE_COLORS.bgCard,
                      border: `1px solid ${FORGE_COLORS.borderColor}`,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'rgba(255, 122, 26, 0.4)',
                      },
                    }}
                  >
                    {/* Preview / Imagem da Câmera */}
                    <Box
                      onClick={() => handleViewCamera(cam)}
                      sx={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '16/9',
                        backgroundColor: '#0D0E11',
                        cursor: cam.online ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        '&:hover .camera-overlay': {
                          opacity: 1,
                        },
                      }}
                    >
                      {hasImage ? (
                        <Box
                          component="img"
                          src={cam.image}
                          alt={cam.label}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: cam.online ? 'none' : 'grayscale(100%) brightness(0.6)',
                          }}
                        />
                      ) : (
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Videocam sx={{ fontSize: 32, color: '#3A3A42', mb: 0.5 }} />
                          <Typography variant="caption" sx={{ color: '#6A6A75', display: 'block', fontSize: '0.68rem' }}>
                            Toque para conectar e capturar
                          </Typography>
                        </Box>
                      )}

                      {/* Badge Status Flutuante */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          backgroundColor: cam.online ? 'rgba(16, 185, 129, 0.85)' : 'rgba(239, 68, 68, 0.85)',
                          color: '#FFFFFF',
                          px: 0.8,
                          py: 0.3,
                          borderRadius: '4px',
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                          }}
                        />
                        {cam.online ? 'AO VIVO' : 'OFFLINE'}
                      </Box>

                      {/* Overlay de Hover para Visualização */}
                      {cam.online && (
                        <Box
                          className="camera-overlay"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.45)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                          }}
                        >
                          <Box
                            sx={{
                              backgroundColor: FORGE_COLORS.orangePrimary,
                              color: '#FFFFFF',
                              px: 1.5,
                              py: 0.6,
                              borderRadius: '20px',
                              fontWeight: 700,
                              fontSize: '0.72rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.6,
                              boxShadow: '0 4px 12px rgba(255, 122, 26, 0.4)',
                            }}
                          >
                            <Visibility sx={{ fontSize: 16 }} />
                            Conectar ao Vivo
                          </Box>
                        </Box>
                      )}
                    </Box>

                    {/* Informações da Câmera e Botão de Ação */}
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: FORGE_COLORS.textWhite, fontSize: '0.85rem' }}>
                            {cam.label || 'Câmera CCTV'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, fontSize: '0.68rem' }}>
                            #{cam.id} • Alcance: 15 m
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        fullWidth
                        size="small"
                        variant="contained"
                        disabled={!cam.online || isConnecting}
                        onClick={() => handleViewCamera(cam)}
                        startIcon={isConnecting ? <CircularProgress size={14} color="inherit" /> : <Visibility sx={{ fontSize: 16 }} />}
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.76rem',
                          py: 0.6,
                          borderRadius: '8px',
                          backgroundColor: FORGE_COLORS.orangePrimary,
                          color: '#FFFFFF',
                          '&:hover': {
                            backgroundColor: '#E06510',
                          },
                          '&:disabled': {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            color: 'rgba(255, 255, 255, 0.3)',
                          },
                        }}
                      >
                        {isConnecting ? 'Conectando...' : cam.online ? 'Visualizar Câmera' : 'Câmera Desativada'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}
        </Stack>
      )}

      {/* ========================================================= */}
      {/* ABA 3: CHAVES E ACESSOS                                   */}
      {/* ========================================================= */}
      {activeTab === 'access' && (
        <Stack spacing={2}>
          {/* Seção de Chaveiros */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: FORGE_COLORS.textWhite, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Key sx={{ fontSize: 16, color: '#FBBF24' }} />
                Portadores de Chave ({details?.keys?.length || 0})
              </Typography>

              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setOpenAccessModal('giveKey');
                  fetchNearby();
                }}
                startIcon={<PersonAdd sx={{ fontSize: 14 }} />}
                sx={{
                  borderColor: 'rgba(251, 191, 36, 0.4)',
                  color: '#FDE68A',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  py: 0.3,
                  '&:hover': { borderColor: '#FBBF24', backgroundColor: 'rgba(251, 191, 36, 0.1)' },
                }}
              >
                Conceder Chave
              </Button>
            </Box>

            {(!details?.keys || details.keys.length === 0) ? (
              <Box sx={{ p: 2, textAlign: 'center', backgroundColor: FORGE_COLORS.bgCard, borderRadius: '8px', border: `1px solid ${FORGE_COLORS.borderColor}` }}>
                <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey }}>
                  Nenhum chaveiro cadastrado nesta propriedade.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1}>
                {details.keys.map((k) => (
                  <Box
                    key={k.citizenid}
                    sx={{
                      backgroundColor: FORGE_COLORS.bgCard,
                      border: `1px solid ${FORGE_COLORS.borderColor}`,
                      borderRadius: '8px',
                      p: 1.2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: FORGE_COLORS.textWhite, fontSize: '0.82rem' }}>
                        {k.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey }}>
                        ID: {k.citizenid}
                      </Typography>
                    </Box>

                    <IconButton
                      size="small"
                      disabled={actionLoading}
                      onClick={() => handleRevoke('key', k.citizenid, k.name)}
                      sx={{ color: '#EF4444', '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' } }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>

          <Divider sx={{ borderColor: FORGE_COLORS.borderColor }} />

          {/* Seção de Administradores */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: FORGE_COLORS.textWhite, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AdminPanelSettings sx={{ fontSize: 16, color: '#60A5FA' }} />
                Administradores ({details?.admins?.length || 0})
              </Typography>

              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setOpenAccessModal('giveAdmin');
                  fetchNearby();
                }}
                startIcon={<PersonAdd sx={{ fontSize: 14 }} />}
                sx={{
                  borderColor: 'rgba(96, 165, 250, 0.4)',
                  color: '#93C5FD',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  py: 0.3,
                  '&:hover': { borderColor: '#60A5FA', backgroundColor: 'rgba(96, 165, 250, 0.1)' },
                }}
              >
                Conceder Admin
              </Button>
            </Box>

            {(!details?.admins || details.admins.length === 0) ? (
              <Box sx={{ p: 2, textAlign: 'center', backgroundColor: FORGE_COLORS.bgCard, borderRadius: '8px', border: `1px solid ${FORGE_COLORS.borderColor}` }}>
                <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey }}>
                  Nenhum administrador adicional cadastrado.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1}>
                {details.admins.map((adm) => (
                  <Box
                    key={adm.citizenid}
                    sx={{
                      backgroundColor: FORGE_COLORS.bgCard,
                      border: `1px solid ${FORGE_COLORS.borderColor}`,
                      borderRadius: '8px',
                      p: 1.2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: FORGE_COLORS.textWhite, fontSize: '0.82rem' }}>
                        {adm.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey }}>
                        ID: {adm.citizenid}
                      </Typography>
                    </Box>

                    <IconButton
                      size="small"
                      disabled={actionLoading}
                      onClick={() => handleRevoke('admin', adm.citizenid, adm.name)}
                      sx={{ color: '#EF4444', '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' } }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      )}

      {/* ========================================================= */}
      {/* ABA 3: TRANSFERÊNCIA DE PROPRIEDADE                      */}
      {/* ========================================================= */}
      {activeTab === 'transfer' && (
        <Stack spacing={2}>
          <Alert severity="info" sx={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#93C5FD', fontSize: '0.75rem', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
            O comprador deve estar online e próximo de você para receber a oferta de transferência.
          </Alert>

          {/* Termos de Transferência */}
          <Box sx={{ backgroundColor: FORGE_COLORS.bgCard, p: 1.8, borderRadius: '10px', border: `1px solid ${FORGE_COLORS.borderColor}` }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: FORGE_COLORS.textWhite, mb: 1 }}>
              Termos de Venda
            </Typography>
            <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, display: 'block' }}>
              Valor mínimo de revenda:{' '}
              <b style={{ color: FORGE_COLORS.textWhite }}>
                R$ {(details?.transfer?.minimumPrice || 0).toLocaleString('pt-BR')}
              </b>
            </Typography>
            <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, display: 'block' }}>
              Taxa de transferência imobiliária:{' '}
              <b style={{ color: '#F59E0B' }}>{details?.transfer?.taxPercent || 10}%</b>
            </Typography>
          </Box>

          {/* Selecionar Comprador Próximo */}
          <Box>
            <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, mb: 0.5, display: 'block' }}>
              Selecione o Comprador Próximo:
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              onClick={fetchNearby}
              sx={{
                borderColor: FORGE_COLORS.borderColor,
                color: FORGE_COLORS.textWhite,
                justifyContent: 'space-between',
                py: 1,
              }}
            >
              <span>{transferTarget ? `${transferTarget.name} (ID ${transferTarget.src})` : 'Escolher jogador próximo...'}</span>
              <SwapHoriz fontSize="small" sx={{ color: FORGE_COLORS.orangePrimary }} />
            </Button>

            {nearbyPlayers.length > 0 && (
              <Stack spacing={0.8} sx={{ mt: 1 }}>
                {nearbyPlayers.map((p) => (
                  <Box
                    key={p.src}
                    onClick={() => setTransferTarget(p)}
                    sx={{
                      p: 1,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: `1px solid ${transferTarget?.src === p.src ? FORGE_COLORS.orangePrimary : FORGE_COLORS.borderColor}`,
                      backgroundColor: transferTarget?.src === p.src ? 'rgba(255, 122, 26, 0.12)' : FORGE_COLORS.bgCard,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', color: FORGE_COLORS.textWhite }}>
                      {p.name} <span style={{ color: FORGE_COLORS.textGrey }}>[ID {p.src}]</span>
                    </Typography>
                    <Typography variant="caption" sx={{ color: FORGE_COLORS.orangePrimary }}>
                      {p.distance.toFixed(1)}m
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>

          {/* Campo de Preço */}
          <Box>
            <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, mb: 0.5, display: 'block' }}>
              Preço de Venda (R$):
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="number"
              value={transferPrice}
              onChange={(e) => setTransferPrice(Math.max(0, Number(e.target.value)))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: FORGE_COLORS.bgInput,
                  color: FORGE_COLORS.textWhite,
                  fontSize: '0.85rem',
                  borderRadius: '8px',
                  '& fieldset': { borderColor: FORGE_COLORS.borderColor },
                  '&:hover fieldset': { borderColor: FORGE_COLORS.borderHover },
                  '&.Mui-focused fieldset': { borderColor: FORGE_COLORS.orangePrimary },
                },
              }}
            />
          </Box>

          {/* Resumo Financeiro da Transferência */}
          {transferPrice > 0 && details?.transfer && (
            <Box sx={{ p: 1.5, backgroundColor: 'rgba(255, 122, 26, 0.06)', border: '1px solid rgba(255, 122, 26, 0.2)', borderRadius: '8px' }}>
              <Typography variant="caption" sx={{ display: 'block', color: FORGE_COLORS.textGrey }}>
                Comprador paga: <b style={{ color: '#FFFFFF' }}>R$ {transferPrice.toLocaleString('pt-BR')}</b>
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: '#EF4444' }}>
                Imposto descontado ({details.transfer.taxPercent}%): - R${' '}
                {Math.floor((transferPrice * details.transfer.taxPercent) / 100).toLocaleString('pt-BR')}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: '#10B981', fontWeight: 700, mt: 0.5 }}>
                Você recebe no banco: R${' '}
                {Math.floor(transferPrice - (transferPrice * details.transfer.taxPercent) / 100).toLocaleString('pt-BR')}
              </Typography>
            </Box>
          )}

          <Button
            fullWidth
            variant="contained"
            disabled={!transferTarget || transferPrice < (details?.transfer?.minimumPrice || 0) || actionLoading}
            onClick={() => setOpenTransferConfirm(true)}
            sx={{
              backgroundColor: FORGE_COLORS.orangePrimary,
              color: '#FFFFFF',
              fontWeight: 700,
              py: 1,
              '&:hover': { backgroundColor: FORGE_COLORS.orangeHover },
            }}
          >
            Enviar Proposta de Venda
          </Button>
        </Stack>
      )}

      {/* ========================================================= */}
      {/* MODAL: CONCEDER CHAVE OU ADMIN (Dentro do Celular)         */}
      {/* ========================================================= */}
      <InPhoneModal
        open={Boolean(openAccessModal)}
        onClose={() => setOpenAccessModal(null)}
        title={openAccessModal === 'giveAdmin' ? 'Conceder Acesso de Administrador' : 'Conceder Chave do Imóvel'}
        actions={
          <>
            <Button size="small" onClick={() => setOpenAccessModal(null)} sx={{ color: FORGE_COLORS.textGrey }}>
              Cancelar
            </Button>
            <Button
              size="small"
              variant="contained"
              disabled={!selectedPlayer || actionLoading}
              onClick={handleGrantAccess}
              sx={{ backgroundColor: FORGE_COLORS.orangePrimary, color: '#FFFFFF', fontWeight: 700 }}
            >
              Confirmar Concessão
            </Button>
          </>
        }
      >
        <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, display: 'block', mb: 1.5 }}>
          Selecione o jogador próximo para entregar a permissão:
        </Typography>

        {loadingPlayers ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} sx={{ color: FORGE_COLORS.orangePrimary }} />
          </Box>
        ) : nearbyPlayers.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#FCA5A5', textAlign: 'center', py: 2 }}>
            Nenhum jogador próximo encontrado no alcance.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {nearbyPlayers.map((p) => (
              <Box
                key={p.src}
                onClick={() => setSelectedPlayer(p)}
                sx={{
                  p: 1.2,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: `1px solid ${selectedPlayer?.src === p.src ? FORGE_COLORS.orangePrimary : FORGE_COLORS.borderColor}`,
                  backgroundColor: selectedPlayer?.src === p.src ? 'rgba(255, 122, 26, 0.15)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: FORGE_COLORS.orangePrimary,
                    backgroundColor: 'rgba(255, 122, 26, 0.08)',
                  },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700, color: FORGE_COLORS.textWhite }}>
                  {p.name} <span style={{ color: FORGE_COLORS.textGrey, fontWeight: 400 }}>[ID {p.src}]</span>
                </Typography>
                <Typography variant="caption" sx={{ color: FORGE_COLORS.orangePrimary, fontWeight: 700 }}>
                  {p.distance.toFixed(1)}m
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </InPhoneModal>

      {/* ========================================================= */}
      {/* MODAL: CONFIRMAR PAGAMENTO DE CONTA (Dentro do Celular)    */}
      {/* ========================================================= */}
      <InPhoneModal
        open={Boolean(payConfirmBill)}
        onClose={() => setPayConfirmBill(null)}
        title="Confirmar Pagamento"
        actions={
          <>
            <Button size="small" onClick={() => setPayConfirmBill(null)} sx={{ color: FORGE_COLORS.textGrey }}>
              Cancelar
            </Button>
            <Button
              size="small"
              variant="contained"
              disabled={actionLoading}
              onClick={handleConfirmPay}
              sx={{ backgroundColor: FORGE_COLORS.orangePrimary, color: '#FFFFFF', fontWeight: 700 }}
            >
              Pagar com Saldo Bancário
            </Button>
          </>
        }
      >
        <Typography variant="body2" sx={{ color: FORGE_COLORS.textGrey, mb: 1 }}>
          Deseja quitar a fatura de <b style={{ color: '#FFFFFF' }}>{payConfirmBill?.label}</b> no valor de:
        </Typography>
        <Typography variant="h5" sx={{ color: FORGE_COLORS.orangePrimary, fontWeight: 800, textAlign: 'center', py: 1.5 }}>
          R$ {(payConfirmBill?.amount || 0).toLocaleString('pt-BR')}
        </Typography>
        <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, display: 'block', textAlign: 'center' }}>
          O valor será debitado diretamente do seu saldo bancário.
        </Typography>
      </InPhoneModal>

      {/* ========================================================= */}
      {/* MODAL: CONFIRMAR PROPOSTA DE TRANSFERÊNCIA (Dentro Celular)*/}
      {/* ========================================================= */}
      <InPhoneModal
        open={openTransferConfirm}
        onClose={() => setOpenTransferConfirm(false)}
        title="Confirmar Venda do Imóvel"
        actions={
          <>
            <Button size="small" onClick={() => setOpenTransferConfirm(false)} sx={{ color: FORGE_COLORS.textGrey }}>
              Cancelar
            </Button>
            <Button
              size="small"
              variant="contained"
              disabled={actionLoading}
              onClick={handleTransfer}
              sx={{ backgroundColor: FORGE_COLORS.orangePrimary, color: '#FFFFFF', fontWeight: 700 }}
            >
              Enviar Proposta
            </Button>
          </>
        }
      >
        <Typography variant="body2" sx={{ color: FORGE_COLORS.textGrey, lineHeight: 1.5 }}>
          Você está prestes a propor a transferência de <b style={{ color: '#FFFFFF' }}>{property?.street}</b> para{' '}
          <b style={{ color: FORGE_COLORS.orangePrimary }}>{transferTarget?.name}</b> pelo valor de{' '}
          <b style={{ color: '#10B981' }}>R$ {transferPrice.toLocaleString('pt-BR')}</b>.
        </Typography>
        <Typography variant="caption" sx={{ color: '#FCA5A5', display: 'block', mt: 1.5 }}>
          Após a confirmação do comprador, a posse do imóvel será transferida imediatamente.
        </Typography>
      </InPhoneModal>

      {/* Diálogo de Emergência Contido Dentro da Tela do Celular */}
      <EmergencyAlarmDialog
        open={emergencyOpen}
        key={`${id}:${securityState?.incident?.at || 0}`}
        propertyId={id}
        incidentAt={securityState?.incident?.at || 0}
        revision={securityState?.revision || 0}
        onResolved={() => {
          setSecurityState((current) => current ? { ...current, incident: null } : current);
          setEmergencyOpen(false);
        }}
        street={property?.street || `Imóvel #${id}`}
        onClose={() => {
          setEmergencyOpen(false);
          loadSecurityData();
        }}
        onViewCameras={() => {
          setEmergencyOpen(false);
        }}
      />
    </Box>
  );
};

export default PropertyDetailsPage;
