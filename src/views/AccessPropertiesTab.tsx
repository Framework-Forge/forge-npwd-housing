import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Skeleton,
  Button,
  Stack,
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import Refresh from '@mui/icons-material/Refresh';
import Key from '@mui/icons-material/Key';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import HousingService from '../services/housing.service';
import { PropertyWithAccess } from '../types/property';
import PropertyCard from '../components/PropertyCard';
import { FORGE_COLORS } from '../theme/forge.theme';

type FilterAccess = 'all' | 'key' | 'admin';

export const AccessPropertiesTab: React.FC = () => {
  const [accessProperties, setAccessProperties] = useState<PropertyWithAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterAccess>('all');

  const loadProperties = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const resp = await HousingService.getProperties();
      if (resp && resp.status === 'ok' && resp.data) {
        setAccessProperties(resp.data.access || []);
      } else {
        setError(resp?.message || 'Não foi possível carregar os imóveis compartilhados.');
      }
    } catch {
      setError('Erro de conexão ao consultar imóveis compartilhados.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  // Listener para atualização instantânea via NUI (quando conceder/revogar acesso ou receber notificação)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.action === 'refreshProperties') {
        loadProperties(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [loadProperties]);

  // Contadores
  const keyCount = useMemo(
    () => accessProperties.filter((p) => p.accessType === 'key').length,
    [accessProperties]
  );
  const adminCount = useMemo(
    () => accessProperties.filter((p) => p.accessType === 'admin').length,
    [accessProperties]
  );

  // Filtragem e pesquisa
  const filteredProperties = useMemo(() => {
    return accessProperties.filter((prop) => {
      // Filtro de Permissão
      if (activeFilter === 'key' && prop.accessType !== 'key') return false;
      if (activeFilter === 'admin' && prop.accessType !== 'admin') return false;

      // Filtro de Texto
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const street = (prop.street || '').toLowerCase();
        const region = (prop.region || '').toLowerCase();
        const apartment = (prop.apartment || '').toLowerCase();
        const id = (prop.property_id || '').toLowerCase();

        return (
          street.includes(query) ||
          region.includes(query) ||
          apartment.includes(query) ||
          id.includes(query)
        );
      }

      return true;
    });
  }, [accessProperties, activeFilter, searchQuery]);

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        gap: 1.5,
      }}
    >
      {/* Cabeçalho da Aba */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
            Imóveis com Acesso
          </Typography>
          <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey }}>
            {accessProperties.length === 1
              ? '1 imóvel compartilhado com você'
              : `${accessProperties.length} imóveis compartilhados com você`}
          </Typography>
        </Box>

        <IconButton
          size="small"
          onClick={() => loadProperties(true)}
          disabled={loading || refreshing}
          sx={{
            color: FORGE_COLORS.textGrey,
            backgroundColor: FORGE_COLORS.bgCard,
            border: `1px solid ${FORGE_COLORS.borderColor}`,
            '&:hover': {
              color: FORGE_COLORS.orangePrimary,
              borderColor: FORGE_COLORS.orangePrimary,
            },
          }}
        >
          <Refresh
            fontSize="small"
            sx={{
              animation: refreshing ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
        </IconButton>
      </Box>

      {/* Campo de Busca */}
      <TextField
        fullWidth
        size="small"
        placeholder="Buscar endereço, bairro ou ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: FORGE_COLORS.textGrey, fontSize: 19 }} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: FORGE_COLORS.bgInput,
            borderRadius: '10px',
            fontSize: '0.85rem',
            color: FORGE_COLORS.textWhite,
            '& fieldset': {
              borderColor: FORGE_COLORS.borderColor,
            },
            '&:hover fieldset': {
              borderColor: FORGE_COLORS.borderHover,
            },
            '&.Mui-focused fieldset': {
              borderColor: FORGE_COLORS.orangePrimary,
            },
          },
        }}
      />

      {/* Chips de Filtragem de Tipo de Acesso */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          overflowX: 'auto',
          pb: 0.5,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <Chip
          label={`Todos (${accessProperties.length})`}
          size="small"
          onClick={() => setActiveFilter('all')}
          sx={{
            fontWeight: 700,
            fontSize: '0.72rem',
            backgroundColor: activeFilter === 'all' ? FORGE_COLORS.orangePrimary : FORGE_COLORS.bgCard,
            color: activeFilter === 'all' ? '#FFFFFF' : FORGE_COLORS.textGrey,
            border: `1px solid ${activeFilter === 'all' ? FORGE_COLORS.orangePrimary : FORGE_COLORS.borderColor}`,
            '&:hover': {
              backgroundColor: activeFilter === 'all' ? FORGE_COLORS.orangeHover : 'rgba(255, 122, 26, 0.1)',
            },
          }}
        />

        <Chip
          icon={<Key sx={{ fontSize: '14px !important', color: activeFilter === 'key' ? '#FFFFFF !important' : 'inherit' }} />}
          label={`Chaves (${keyCount})`}
          size="small"
          onClick={() => setActiveFilter('key')}
          sx={{
            fontWeight: 700,
            fontSize: '0.72rem',
            backgroundColor: activeFilter === 'key' ? FORGE_COLORS.orangePrimary : FORGE_COLORS.bgCard,
            color: activeFilter === 'key' ? '#FFFFFF' : FORGE_COLORS.textGrey,
            border: `1px solid ${activeFilter === 'key' ? FORGE_COLORS.orangePrimary : FORGE_COLORS.borderColor}`,
            '&:hover': {
              backgroundColor: activeFilter === 'key' ? FORGE_COLORS.orangeHover : 'rgba(255, 122, 26, 0.1)',
            },
          }}
        />

        <Chip
          icon={<AdminPanelSettings sx={{ fontSize: '14px !important', color: activeFilter === 'admin' ? '#FFFFFF !important' : 'inherit' }} />}
          label={`Administração (${adminCount})`}
          size="small"
          onClick={() => setActiveFilter('admin')}
          sx={{
            fontWeight: 700,
            fontSize: '0.72rem',
            backgroundColor: activeFilter === 'admin' ? FORGE_COLORS.orangePrimary : FORGE_COLORS.bgCard,
            color: activeFilter === 'admin' ? '#FFFFFF' : FORGE_COLORS.textGrey,
            border: `1px solid ${activeFilter === 'admin' ? FORGE_COLORS.orangePrimary : FORGE_COLORS.borderColor}`,
            '&:hover': {
              backgroundColor: activeFilter === 'admin' ? FORGE_COLORS.orangeHover : 'rgba(255, 122, 26, 0.1)',
            },
          }}
        />
      </Stack>

      {/* Lista de Imóveis / Estados */}
      {loading ? (
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          {[1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                borderRadius: '12px',
                border: `1px solid ${FORGE_COLORS.borderColor}`,
                backgroundColor: FORGE_COLORS.bgCard,
                p: 1.5,
              }}
            >
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.05)' }} />
              <Skeleton variant="text" width="60%" sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.05)' }} />
              <Skeleton variant="text" width="40%" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
            </Box>
          ))}
        </Stack>
      ) : error ? (
        <Box
          sx={{
            p: 3,
            textAlign: 'center',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '12px',
            mt: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: '#FCA5A5', mb: 1.5 }}>
            {error}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => loadProperties(false)}
            sx={{
              borderColor: '#EF4444',
              color: '#EF4444',
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          >
            Tentar Novamente
          </Button>
        </Box>
      ) : filteredProperties.length === 0 ? (
        <Box
          sx={{
            py: 6,
            px: 2,
            textAlign: 'center',
            backgroundColor: FORGE_COLORS.bgCard,
            border: `1px solid ${FORGE_COLORS.borderColor}`,
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            mt: 1,
          }}
        >
          <Key sx={{ fontSize: 44, color: FORGE_COLORS.textMuted }} />
          <Typography variant="subtitle2" sx={{ color: FORGE_COLORS.textWhite, fontWeight: 700 }}>
            Nenhum imóvel com acesso
          </Typography>
          <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, maxWidth: 220 }}>
            {searchQuery
              ? 'Nenhum imóvel com acesso corresponde aos termos da sua pesquisa.'
              : activeFilter !== 'all'
              ? 'Você não possui propriedades com este tipo de permissão.'
              : 'Nenhum morador concedeu chaves ou acesso de administração para você ainda.'}
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1.5} sx={{ mt: 0.5, pb: 2 }}>
          {filteredProperties.map((property) => (
            <PropertyCard key={property.property_id} property={property} isAccessTab={true} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default AccessPropertiesTab;
