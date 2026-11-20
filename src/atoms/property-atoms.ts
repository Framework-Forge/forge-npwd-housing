import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { PropertyData, PropertyWithAccess, AccessType } from '../types/property';

// Lista de propriedades onde o jogador é dono
export const ownedPropertiesAtom = atom<PropertyData[]>({
  key: 'ownedPropertiesAtom',
  default: [],
});

// Lista de propriedades onde o jogador tem acesso (chave ou admin)
export const accessPropertiesAtom = atom<PropertyWithAccess[]>({
  key: 'accessPropertiesAtom',
  default: [],
});

// Propriedade selecionada para visualização detalhada
export const selectedPropertyAtom = atom<PropertyData | null>({
  key: 'selectedPropertyAtom',
  default: null,
});

// Tipo de acesso da propriedade atualmente selecionada ('owner' | 'key' | 'admin')
export const selectedPropertyAccessTypeAtom = atom<AccessType>({
  key: 'selectedPropertyAccessTypeAtom',
  default: 'owner',
});

// Estado de loading global para requisições de propriedades
export const propertiesLoadingAtom = atom<boolean>({
  key: 'propertiesLoadingAtom',
  default: false,
});

// Hooks utilitários para acesso e mutação
export const useOwnedProperties = () => useRecoilState(ownedPropertiesAtom);
export const useOwnedPropertiesValue = () => useRecoilValue(ownedPropertiesAtom);
export const useSetOwnedProperties = () => useSetRecoilState(ownedPropertiesAtom);

export const useAccessProperties = () => useRecoilState(accessPropertiesAtom);
export const useAccessPropertiesValue = () => useRecoilValue(accessPropertiesAtom);
export const useSetAccessProperties = () => useSetRecoilState(accessPropertiesAtom);

export const useSelectedProperty = () => useRecoilState(selectedPropertyAtom);
export const useSelectedPropertyValue = () => useRecoilValue(selectedPropertyAtom);
export const useSetSelectedProperty = () => useSetRecoilState(selectedPropertyAtom);

export const useSelectedPropertyAccessType = () => useRecoilState(selectedPropertyAccessTypeAtom);
export const useSetSelectedPropertyAccessType = () => useSetRecoilState(selectedPropertyAccessTypeAtom);

export const usePropertiesLoading = () => useRecoilState(propertiesLoadingAtom);
export const useSetPropertiesLoading = () => useSetRecoilState(propertiesLoadingAtom);
