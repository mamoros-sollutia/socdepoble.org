import { User } from 'lucide-react';

export const usersManagerConfig = {
  id: 'usuaris',
  title: 'Usuaris de la Plataforma',
  icon: User,
  facets: [],
  getItemId: (item) => item.id,
  getItemSearchText: (item) => item.email || '',
  getItemCard: (usuari) => ({ titol: usuari.email, icona: User }),
};
