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
import Apartment from '@mui/icons-material/Apartment';
import Home from '@mui/icons-material/Home';
import Key from '@mui/icons-material/Key';
import HousingService from '../services/housing.service';
import { PropertyData, PropertyWithAccess } from '../types/property';
import PropertyCard from '../components/PropertyCard';
import { FORGE_COLORS } from '../theme/forge.theme';

type FilterCategory = 'all' | 'apartments' | 'houses' | 'access';

export const MyPropertiesTab: React.FC = () => {
  const [properties, setProperties] = useState<(PropertyData | PropertyWithAccess)[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [accessCount, setAccessCount] = useState(0);

  const loadProperties = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const resp = await HousingService.getProperties();
      if (resp && resp.status === 'ok' && resp.data) {
        const owned = (resp.data.owned || []).map((p) => ({ ...p, accessType: 'owner' as const }));
        const access = (resp.data.access || []).map((p) => ({ ...p, accessType: (p.accessType || 'key') as 'key' | 'admin' }));
        setAccessCount(access.length);
        setProperties([...owned, ...access]);
      } else {
        setError(resp?.message || 'Não foi possível carregar seus imóveis.');
      }
    } catch {
      setError('Erro de conexão ao consultar imóveis.');
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
  const apartmentCount = useMemo(
    () =>
      properties.filter(
        (p) =>
          (p as PropertyWithAccess).accessType === 'owner' &&
          (p.category === 'apartment' || Boolean(p.apartment && p.apartment !== ''))
      ).length,
    [properties]
  );

  const houseCount = useMemo(
    () =>
      properties.filter(
        (p) =>
          (p as PropertyWithAccess).accessType === 'owner' &&
          p.category !== 'apartment' &&
          (!p.apartment || p.apartment === '')
      ).length,
    [properties]
  );

  // Filtragem e pesquisa
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      const isApt =
        prop.category === 'apartment' ||
        Boolean(prop.apartment && prop.apartment !== '');
      const accessType = (prop as PropertyWithAccess).accessType;

      // Filtro de Categoria
      if (activeFilter === 'apartments' && (isApt === false || accessType !== 'owner')) return false;
      if (activeFilter === 'houses' && (isApt === true || accessType !== 'owner')) return false;
      if (activeFilter === 'access' && accessType !== 'key' && accessType !== 'admin') return false;

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
  }, [properties, activeFilter, searchQuery]);

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
            Meus Imóveis
          </Typography>
          <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey }}>
            {properties.length === 1
              ? '1 imóvel disponível no aplicativo'
              : `${properties.length} imóveis disponíveis no aplicativo`}
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

      {/* Chips de Filtragem de Categorias */}
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
          label={`Todos (${properties.length})`}
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
          icon={<Apartment sx={{ fontSize: '14px !important', color: activeFilter === 'apartments' ? '#FFFFFF !important' : 'inherit' }} />}
          label={`Meus Apartamentos (${apartmentCount})`}
          size="small"
          onClick={() => setActiveFilter('apartments')}
          sx={{
            fontWeight: 700,
            fontSize: '0.72rem',
            backgroundColor: activeFilter === 'apartments' ? FORGE_COLORS.orangePrimary : FORGE_COLORS.bgCard,
            color: activeFilter === 'apartments' ? '#FFFFFF' : FORGE_COLORS.textGrey,
            border: `1px solid ${activeFilter === 'apartments' ? FORGE_COLORS.orangePrimary : FORGE_COLORS.borderColor}`,
            '&:hover': {
              backgroundColor: activeFilter === 'apartments' ? FORGE_COLORS.orangeHover : 'rgba(255, 122, 26, 0.1)',
            },
          }}
        />

        <Chip
          icon={<Home sx={{ fontSize: '14px !important', color: activeFilter === 'houses' ? '#FFFFFF !important' : 'inherit' }} />}
          label={`Minhas Casas (${houseCount})`}
          size="small"
          onClick={() => setActiveFilter('houses')}
          sx={{
            fontWeight: 700,
            fontSize: '0.72rem',
            backgroundColor: activeFilter === 'houses' ? FORGE_COLORS.orangePrimary : FORGE_COLORS.bgCard,
            color: activeFilter === 'houses' ? '#FFFFFF' : FORGE_COLORS.textGrey,
            border: `1px solid ${activeFilter === 'houses' ? FORGE_COLORS.orangePrimary : FORGE_COLORS.borderColor}`,
            '&:hover': {
              backgroundColor: activeFilter === 'houses' ? FORGE_COLORS.orangeHover : 'rgba(255, 122, 26, 0.1)',
            },
          }}
        />

        {accessCount > 0 && (
          <Chip
            icon={<Key sx={{ fontSize: '14px !important', color: activeFilter === 'access' ? '#FFFFFF !important' : 'inherit' }} />}
            label={`Com Chave (${accessCount})`}
            size="small"
            onClick={() => setActiveFilter('access')}
            sx={{
              fontWeight: 700,
              fontSize: '0.72rem',
              backgroundColor: activeFilter === 'access' ? FORGE_COLORS.orangePrimary : FORGE_COLORS.bgCard,
              color: activeFilter === 'access' ? '#FFFFFF' : FORGE_COLORS.textGrey,
              border: `1px solid ${activeFilter === 'access' ? FORGE_COLORS.orangePrimary : FORGE_COLORS.borderColor}`,
              '&:hover': {
                backgroundColor: activeFilter === 'access' ? FORGE_COLORS.orangeHover : 'rgba(255, 122, 26, 0.1)',
              },
            }}
          />
        )}
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
          <Home sx={{ fontSize: 44, color: FORGE_COLORS.textMuted }} />
          <Typography variant="subtitle2" sx={{ color: FORGE_COLORS.textWhite, fontWeight: 700 }}>
            Nenhum imóvel encontrado
          </Typography>
          <Typography variant="caption" sx={{ color: FORGE_COLORS.textGrey, maxWidth: 220 }}>
            {searchQuery
              ? 'Tente ajustar os termos da sua pesquisa ou mudar o filtro selecionado.'
              : activeFilter !== 'all'
              ? 'Você não possui propriedades registradas nesta categoria específica.'
              : 'Você ainda não é proprietário de nenhum imóvel ou apartamento em San Andreas.'}
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1.5} sx={{ mt: 0.5, pb: 2 }}>
          {filteredProperties.map((property) => (
            <PropertyCard key={property.property_id} property={property} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default MyPropertiesTab;
