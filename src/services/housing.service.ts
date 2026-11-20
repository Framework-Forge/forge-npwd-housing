import { fetchNui } from '../utils/fetchNui';
import {
  PropertiesResponseData,
  PropertyManagementData,
  NearbyPlayer,
  SecurityState,
  ServerResp,
} from '../types/property';

// Dados simulados para ambiente fora do FiveM (navegador / dev)
const MOCK_PROPERTIES: PropertiesResponseData = {
  citizenid: 'BRU12345',
  owned: [
    {
      property_id: '1',
      owner: 'BRU12345',
      street: 'Eclipse Towers, Apt 31',
      region: 'Vinewood Oeste',
      shell: 'modern_apt',
      for_sale: 0,
      price: 450000,
      category: 'apartment',
      apartment: 'Eclipse Towers',
      has_access: ['KEY999'],
      admin_access: [],
      tax_data: {
        luz: { label: 'Energia Elétrica', amount: 350, intervalDays: 7, balance: 350, nextDueAt: Math.floor(Date.now() / 1000) + 86400 * 3 },
        agua: { label: 'Água e Saneamento', amount: 180, intervalDays: 7, balance: 0, nextDueAt: Math.floor(Date.now() / 1000) + 86400 * 5 },
        iptu: { label: 'IPTU Residencial', amount: 1200, intervalDays: 14, balance: 0, nextDueAt: Math.floor(Date.now() / 1000) + 86400 * 10 },
      },
      extra_imgs: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      ],
      description: 'Apartamento de alto padrão com vista panorâmica para Los Santos.',
      door_data: [{ x: -774.2, y: 312.4, z: 85.7 }],
    },
    {
      property_id: '2',
      owner: 'BRU12345',
      street: '3671 Whispymound Drive',
      region: 'Vinewood Hills',
      shell: 'mansion_lux',
      for_sale: 0,
      price: 1850000,
      category: 'house',
      has_access: ['KEY777'],
      admin_access: ['ADM888'],
      tax_data: {
        luz: { label: 'Energia Elétrica', amount: 800, intervalDays: 7, balance: 0, nextDueAt: Math.floor(Date.now() / 1000) + 86400 * 6 },
        agua: { label: 'Água e Saneamento', amount: 450, intervalDays: 7, balance: 450, nextDueAt: Math.floor(Date.now() / 1000) + 86400 * 2 },
        iptu: { label: 'IPTU Residencial', amount: 3500, intervalDays: 14, balance: 3500, nextDueAt: Math.floor(Date.now() / 1000) + 86400 * 1 },
      },
      extra_imgs: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
      ],
      description: 'Mansão exclusiva com garagem ampla e sistema de segurança.',
      door_data: [{ x: 118.4, y: 566.2, z: 183.9 }],
    },
  ],
  access: [
    {
      property_id: '3',
      owner: 'JOHN999',
      street: '2866 South Mo Milton Drive',
      region: 'Vinewood Hills',
      shell: 'modern_villa',
      for_sale: 0,
      price: 920000,
      category: 'house',
      has_access: ['BRU12345'],
      admin_access: [],
      accessType: 'key',
      tax_data: {
        luz: { label: 'Energia Elétrica', amount: 500, intervalDays: 7, balance: 0, nextDueAt: Math.floor(Date.now() / 1000) + 86400 * 4 },
        agua: { label: 'Água e Saneamento', amount: 250, intervalDays: 7, balance: 0, nextDueAt: Math.floor(Date.now() / 1000) + 86400 * 4 },
        iptu: { label: 'IPTU Residencial', amount: 1900, intervalDays: 14, balance: 0, nextDueAt: Math.floor(Date.now() / 1000) + 86400 * 8 },
      },
      extra_imgs: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      ],
      description: 'Casa de amigos com chave compartilhada.',
      door_data: [{ x: -372.5, y: 445.1, z: 110.2 }],
    },
  ],
};

const MOCK_DETAILS: PropertyManagementData = {
  owner: 'BRU12345',
  isOwner: true,
  isAdmin: true,
  hasKey: true,
  keys: [
    { citizenid: 'KEY999', name: 'Carlos Ferreira' },
    { citizenid: 'KEY777', name: 'Amanda Souza' },
  ],
  admins: [
    { citizenid: 'ADM888', name: 'Rodrigo Lima' },
  ],
  taxes: {
    luz: { label: 'Energia Elétrica', amount: 350, intervalDays: 7, balance: 350, nextDueAt: Math.floor(Date.now() / 1000) + 86400 * 3 },
    agua: { label: 'Água e Saneamento', amount: 180, intervalDays: 7, balance: 0, nextDueAt: Math.floor(Date.now() / 1000) + 86400 * 5 },
    iptu: { label: 'IPTU Residencial', amount: 1200, intervalDays: 14, balance: 0, nextDueAt: Math.floor(Date.now() / 1000) + 86400 * 10 },
  },
  keyPrice: 1500,
  adminPrice: 5000,
  transfer: {
    minimumPrice: 300000,
    taxPercent: 10,
    revision: 1,
  },
};

const MOCK_NEARBY_PLAYERS: NearbyPlayer[] = [
  { src: 12, name: 'Lucas Silva', distance: 1.8 },
  { src: 24, name: 'Beatriz Costa', distance: 3.2 },
  { src: 37, name: 'Fernando Dias', distance: 4.5 },
];

const MOCK_SECURITY: SecurityState = {
  alarm: true,
  security: true,
  alarmArmed: false,
  securityArmed: false,
  panel: { x: -794.3, y: 322.0, z: 217.5 },
  revision: 1,
  cameras: [
    {
      id: 'cam-101',
      label: 'Entrada Principal',
      online: true,
      coords: { x: -795.0, y: 321.1, z: 219.1 },
    },
    {
      id: 'cam-102',
      label: 'Sala de Estar',
      online: true,
      coords: { x: -790.0, y: 325.0, z: 218.5 },
    },
  ],
};

export const HousingService = {
  /**
   * Obtém a lista de propriedades do jogador (próprias e com acesso)
   */
  async getProperties(): Promise<ServerResp<PropertiesResponseData>> {
    return fetchNui<ServerResp<PropertiesResponseData>>(
      'getProperties',
      {},
      { status: 'ok', data: MOCK_PROPERTIES }
    );
  },

  /**
   * Obtém os detalhes de gestão de um imóvel específico
   */
  async getPropertyDetails(propertyId: string): Promise<ServerResp<PropertyManagementData>> {
    return fetchNui<ServerResp<PropertyManagementData>, { property_id: string }>(
      'getPropertyDetails',
      { property_id: propertyId },
      { status: 'ok', data: MOCK_DETAILS }
    );
  },

  /**
   * Marca o waypoint / GPS no mapa do GTA FiveM
   */
  async setWaypoint(propertyId: string, coords?: { x: number; y: number; z?: number }): Promise<ServerResp<{ success: boolean }>> {
    return fetchNui<ServerResp<{ success: boolean }>, { property_id: string; coords?: { x: number; y: number; z?: number } }>(
      'setWaypoint',
      { property_id: propertyId, coords },
      { status: 'ok', data: { success: true }, message: 'Destino marcado no GPS.' }
    );
  },

  /**
   * Paga uma conta individual ('luz', 'agua', 'iptu', 'security') ou todas ('all')
   */
  async payBill(propertyId: string, billKey: 'luz' | 'agua' | 'iptu' | 'security' | 'all'): Promise<ServerResp<boolean>> {
    return fetchNui<ServerResp<boolean>, { property_id: string; billKey: string }>(
      'payBill',
      { property_id: propertyId, billKey },
      { status: 'ok', data: true, message: 'Fatura paga com sucesso.' }
    );
  },

  /**
   * Obtém os jogadores próximos para concessão de chave ou transferência
   */
  async getNearbyPlayers(): Promise<ServerResp<NearbyPlayer[]>> {
    return fetchNui<ServerResp<NearbyPlayer[]>>(
      'getNearbyPlayers',
      {},
      { status: 'ok', data: MOCK_NEARBY_PLAYERS }
    );
  },

  /**
   * Concede chave a um jogador próximo (via targetSource)
   */
  async giveKey(propertyId: string, targetSource: number): Promise<ServerResp<boolean>> {
    return fetchNui<ServerResp<boolean>, { action: string; property_id: string; targetSource: number }>(
      'giveAccess',
      { action: 'giveKey', property_id: propertyId, targetSource },
      { status: 'ok', data: true, message: 'Chave concedida com sucesso.' }
    );
  },

  /**
   * Revoga a chave de um cidadão (via citizenid)
   */
  async revokeKey(propertyId: string, targetCitizenId: string): Promise<ServerResp<boolean>> {
    return fetchNui<ServerResp<boolean>, { action: string; property_id: string; targetCitizenId: string }>(
      'revokeAccess',
      { action: 'revokeKey', property_id: propertyId, targetCitizenId },
      { status: 'ok', data: true, message: 'Chave revogada com sucesso.' }
    );
  },

  /**
   * Concede permissão de administrador a um jogador próximo
   */
  async giveAdmin(propertyId: string, targetSource: number): Promise<ServerResp<boolean>> {
    return fetchNui<ServerResp<boolean>, { action: string; property_id: string; targetSource: number }>(
      'giveAccess',
      { action: 'giveAdmin', property_id: propertyId, targetSource },
      { status: 'ok', data: true, message: 'Acesso administrativo concedido.' }
    );
  },

  /**
   * Revoga permissão de administrador de um cidadão
   */
  async revokeAdmin(propertyId: string, targetCitizenId: string): Promise<ServerResp<boolean>> {
    return fetchNui<ServerResp<boolean>, { action: string; property_id: string; targetCitizenId: string }>(
      'revokeAccess',
      { action: 'revokeAdmin', property_id: propertyId, targetCitizenId },
      { status: 'ok', data: true, message: 'Acesso administrativo revogado.' }
    );
  },

  /**
   * Inicia proposta de transferência de propriedade
   */
  async transferProperty(
    propertyId: string,
    targetSource: number,
    price: number,
    revision: number
  ): Promise<ServerResp<boolean>> {
    return fetchNui<ServerResp<boolean>, { property_id: string; targetSource: number; price: number; revision: number }>(
      'transferProperty',
      { property_id: propertyId, targetSource, price, revision },
      { status: 'ok', data: true, message: 'Proposta de transferência enviada.' }
    );
  },

  /**
   * Obtém o estado de segurança e câmeras do imóvel
   */
  async getSecurityState(propertyId: string): Promise<ServerResp<SecurityState>> {
    return fetchNui<ServerResp<SecurityState>, { property_id: string }>(
      'getSecurityState',
      { property_id: propertyId },
      { status: 'ok', data: MOCK_SECURITY }
    );
  },

  /**
   * Ativa ou desativa o alarme ou segurança monitorada
   */
  async toggleSecurityArm(
    propertyId: string,
    kind: 'alarm' | 'security',
    enabled: boolean,
    revision: number
  ): Promise<ServerResp<SecurityState>> {
    return fetchNui<ServerResp<SecurityState>, { property_id: string; kind: 'alarm' | 'security'; enabled: boolean; revision: number }>(
      'toggleSecurityArm',
      { property_id: propertyId, kind, enabled, revision },
      {
        status: 'ok',
        data: {
          ...MOCK_SECURITY,
          [kind === 'alarm' ? 'alarmArmed' : 'securityArmed']: enabled,
        },
        message: enabled ? 'Sistema ativado com sucesso.' : 'Sistema desativado.',
      }
    );
  },

  /**
   * Conecta à câmera de segurança 3D em tempo real
   */
  async viewSecurityCamera(
    propertyId: string,
    cameraId: string,
    filter: string = 'normal'
  ): Promise<ServerResp<{ success: boolean }>> {
    return fetchNui<ServerResp<{ success: boolean }>, { property_id: string; cameraId: string; filter: string }>(
      'viewSecurityCamera',
      { property_id: propertyId, cameraId, filter },
      { status: 'ok', data: { success: true }, message: 'Visualização encerrada.' }
    );
  },

  /**
   * Despacha alerta de emergência 10-90 para a polícia via ps-dispatch
   */
  async resolveSecurityIncident(propertyId: string, incidentAt: number, action: 'dispatch' | 'dismiss'): Promise<ServerResp<SecurityState>> {
    return fetchNui('resolveSecurityIncident', { property_id: propertyId, incidentAt, action });
  },
  async dispatchPolice(propertyId: string): Promise<ServerResp<boolean>> {
    return fetchNui<ServerResp<boolean>, { property_id: string }>(
      'dispatchPolice',
      { property_id: propertyId },
      { status: 'ok', data: true, message: 'Polícia acionada com sucesso! Código 10-90 despachado.' }
    );
  },
};

export default HousingService;
