// Tipos TypeScript para forge-housing e forge-npwd-housing

export interface TaxEntry {
  label: string;
  amount: number;           // valor da fatura
  intervalDays: number;     // frequência de cobrança em dias
  balance: number;          // saldo devedor acumulado
  nextDueAt: number;        // timestamp unix do próximo vencimento
  active?: boolean;         // indicador de serviço ativo (ex: segurança)
}

export interface TaxData {
  luz: TaxEntry;
  agua: TaxEntry;
  iptu: TaxEntry;
  security?: TaxEntry;
}

export interface DoorData {
  x?: number;
  y?: number;
  z?: number;
  h?: number;
  origin?: { x: number; y: number; z: number; h?: number };
  [key: string]: any;
}

export interface PropertyData {
  property_id: string;
  owner: string | null;        // citizenid do dono (null se desocupado/à venda)
  street: string;              // endereço / rua
  region: string;              // bairro / região
  shell: string;               // tipo de interior / shell
  for_sale: 0 | 1;             // 1 = à venda
  price: number;
  has_access: string[];        // array de citizenids com chave
  admin_access: string[];      // array de citizenids com admin
  tax_data: TaxData;
  extra_imgs: string[];
  description?: string;
  category?: 'house' | 'apartment' | string;
  apartment?: string;
  garage_data?: any;
  door_data?: DoorData[] | DoorData;
}

export interface AccessEntry {
  citizenid: string;
  name: string;
}

export interface NearbyPlayer {
  src: number;
  name: string;
  distance: number;
}

export type AccessType = 'owner' | 'key' | 'admin';

export interface PropertyWithAccess extends PropertyData {
  accessType: 'key' | 'admin';
}

export interface PropertiesResponseData {
  owned: PropertyData[];
  access: PropertyWithAccess[];
  citizenid: string;
}

export interface PropertyManagementData {
  owner: string;
  isOwner: boolean;
  isAdmin: boolean;
  hasKey: boolean;
  keys: AccessEntry[];
  admins: AccessEntry[];
  taxes: TaxData;
  keyPrice: number;
  adminPrice: number;
  transfer?: {
    minimumPrice: number;
    taxPercent: number;
    revision: number;
  };
}

export interface SecurityCamera {
  id: string;
  label: string;
  online: boolean;
  coords: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  image?: string;
  model?: string;
  settings?: any;
}

export interface SecurityState {
  alarm: boolean;            // alarme residencial contratado
  security: boolean;         // segurança monitorada contratada
  alarmArmed: boolean;       // alarme residencial ativo
  securityArmed: boolean;    // segurança monitorada ativa
  incident?: {
    at: number;
    kind: string;
    deadline?: number;       // timestamp unix
    dispatched: boolean;
  } | null;
  cameras: SecurityCamera[];
  panel?: { x: number; y: number; z: number; rotation?: any };
  revision: number;
  success?: boolean;
  now?: number;
  prices?: {
    alarm: number;
    security: number;
  };
}

export interface ServerResp<T = any> {
  status: 'ok' | 'error';
  data?: T;
  message?: string;
}

export interface TransferTerms {
  minimumPrice: number;
  taxPercent: number;
  revision: number;
}
