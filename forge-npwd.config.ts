import App from './src/App';
import { HouseIcon, NotificationIcon } from './icon';
import { HousingWidget } from './src/widgets/HousingWidget';

export const path = '/housing';

export default () => ({
  id: 'housing',
  nameLocale: 'Imóveis',
  color: '#FFFFFF',
  backgroundColor: '#FF7A1A',
  path,
  icon: HouseIcon,
  notificationIcon: NotificationIcon,
  app: App,
  homeWidgets: [{
    id: 'properties',
    name: 'Meus imóveis',
    description: 'Propriedades, contas e segurança residencial.',
    sizes: [
      { width: 2, height: 1, label: 'Compacto 2×1' },
      { width: 4, height: 1, label: 'Resumo 4×1' },
      { width: 4, height: 2, label: 'Completo 4×2' },
    ],
    Component: HousingWidget,
    path,
  }],
});
