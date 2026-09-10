import { FileText, Inbox, Newspaper, ShoppingCart, LandPlot, GalleryVerticalEnd, NotebookPen, Calendar, MapPinned } from 'lucide-react';

const FOLDER_ICONS = {
  'f-tot': Inbox,
  'f-mur': Newspaper,
  'f-mercat': ShoppingCart,
  'f-pobles': LandPlot,
  'f-media': GalleryVerticalEnd,
  'f-events': Calendar,
  'f-mapa': MapPinned,
  'f-notes': NotebookPen
};

export function buildNotesFacets(noteFolders = []) {
  // 1. Faceta de carpetes
  const folderOptions = noteFolders.map(f => {
    const Icon = FOLDER_ICONS[f.id] || NotebookPen;
    return {
      id: f.id,
      label: f.name,
      icon: Icon,
      isGlobal: !!FOLDER_ICONS[f.id]
    };
  });

  const folderFacet = {
    id: 'folderId',
    title: 'CARPETES',
    type: 'tree', // Use tree or flat. ManagerFacets renders them.
    options: folderOptions
  };

  // 2. Faceta de categories
  const categoryFacet = {
    id: 'category',
    title: 'CATEGORIES',
    type: 'flat',
    options: [
      { id: 'Sistema', label: 'Sistema' },
      { id: 'Productivitat', label: 'Productivitat' }
    ]
  };

  // 3. Faceta d'etiquetes
  const tagsFacet = {
    id: 'tags',
    title: 'ETIQUETES',
    type: 'flat',
    options: [
      { id: 'Tutorial', label: 'Tutorial' }
    ]
  };

  return [folderFacet, categoryFacet, tagsFacet];
}

export const notesManagerConfig = {
  id: 'notes',
  title: 'Notes',
  icon: FileText,
  getItemId: (item) => item.id,
  getItemSearchText: (item) => item.searchText || item.title || '',
};
