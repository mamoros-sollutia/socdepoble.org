import { useState } from 'react';
import { useNotes } from './NotesContext';
import { Folder, Bookmark, Hash, PanelLeftClose, MessageSquare, Newspaper, ShoppingCart, LandPlot, GalleryVerticalEnd, NotebookPen, CalendarDays, Calendar, MapPinned, Inbox } from 'lucide-react';

const CATEGORIES = ['Sistema'];

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

export default function NotesSidebar() {
  const [accFoldersOpen, setAccFoldersOpen] = useState(true);
  const { 
    noteFolders, activeFolderId, handleSelectFolder, 
    activeCategory, handleSelectCategory,
    colFoldersCollapsed, setColFoldersCollapsed,
    accCategoriesOpen, setAccCategoriesOpen,
    accTagsOpen, setAccTagsOpen,
    isCompact, mobilePanel,
    t
  } = useNotes();

  const getCategoryLabel = (category) => t(`section.notes.category.${category}`, category);

  if (colFoldersCollapsed && !isCompact) {
    return (
      <aside className="notes-column notes-column--left collapsed">
        <div className="notes-column-header notes-column-header--collapsed">
          <button 
            onClick={() => setColFoldersCollapsed(false)}
            className="btn-icon hover-bg"
            title="Expandir Carpetes"
          >
            <Folder size={20} />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="notes-column notes-column--left" hidden={isCompact && mobilePanel !== 'folders'}>
      <div className="notes-column__body" style={{ padding: 0 }}>
        
        {/* LLISTA CARPETES */}
        <div 
          className="notes-column-header cursor-pointer" 
          onClick={() => setAccFoldersOpen(!accFoldersOpen)}
          title="Plegar/Desplegar Carpetes"
        >
          <div className="notes-column-title">CARPETES</div>
          <button 
            onClick={(e) => { e.stopPropagation(); setColFoldersCollapsed(true); }} 
            className="btn-icon btn-icon--transparent d-desktop-only" 
            title="Replegar Columna"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>
        
        {accFoldersOpen && (
          <div className="folders-list">
            {noteFolders.map((folder) => {
              const isGlobal = !!FOLDER_ICONS[folder.id];
              const Icon = FOLDER_ICONS[folder.id] || Folder;
              
              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => handleSelectFolder(folder.id)}
                  className={`folder-item ${isGlobal ? 'folder-item--global' : ''} ${folder.id === activeFolderId ? 'active' : ''}`}
                >
                  <Icon size={isGlobal ? 24 : 16} strokeWidth={isGlobal ? 2.1 : 2} />
                  <span>{folder.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ACCORDION CATEGORIES */}
        <div 
          className="notes-column-header cursor-pointer" 
          onClick={() => setAccCategoriesOpen(!accCategoriesOpen)}
          title="Plegar/Desplegar Categories"
          style={{ borderTop: '1px solid var(--sdp-vora-control)' }}
        >
          <div className="notes-column-title">CATEGORIES</div>
        </div>
        
        {accCategoriesOpen && (
          <div className="folders-list">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleSelectCategory(category)}
                className={`folder-item ${category === activeCategory ? 'active' : ''}`}
              >
                <Bookmark size={16} />
                <span>{getCategoryLabel(category)}</span>
              </button>
            ))}
          </div>
        )}

        {/* ACCORDION ETIQUETES */}
        <div 
          className="notes-column-header cursor-pointer" 
          onClick={() => setAccTagsOpen(!accTagsOpen)}
          title="Plegar/Desplegar Etiquetes"
          style={{ borderTop: '1px solid var(--sdp-vora-control)' }}
        >
          <div className="notes-column-title">ETIQUETES</div>
        </div>

        {accTagsOpen && (
          <div className="folders-list">
            {['Productivitat', 'Tutorial'].map((tag) => (
              <button
                key={tag}
                type="button"
                className="folder-item"
              >
                <Hash size={16} />
                <span>{tag}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
