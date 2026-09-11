import { Building2 } from 'lucide-react';

const TIPUS = { empresa: 'Empresa', ajuntament: 'Ajuntament', grup: 'Grup' };

export const companiesManagerConfig = {
  id: 'entitats',
  title: 'Entitats i Grups',
  icon: Building2,
  facets: [
    {
      id: 'kind',
      type: 'flat',
      label: 'Tipus',
      options: [
        { id: 'empresa', name: 'Empresa', icon: Building2 },
        { id: 'ajuntament', name: 'Ajuntament', icon: Building2 },
        { id: 'grup', name: 'Grup', icon: Building2 },
      ],
      getValue: (item) => item.kind || 'empresa',
    }
  ],
  getItemId: (item) => item.id,
  getItemSearchText: (item) => `${item.name || ''} ${item.description || ''}`,
  getItemCard: (entitat) => ({
    titol: entitat.name,
    subtitol: TIPUS[entitat.kind || 'empresa'] || entitat.kind,
    icona: Building2,
  }),
};
