import { useNotes } from './NotesContext';
import { Folder, Bookmark, Hash, PanelLeftClose } from 'lucide-react';

const CATEGORIES = ['Trellat', 'Patrimoni', 'Dades', 'Social'];

export default function NotesSidebar() {
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
      <div className="notes-column-header">
        <div className="notes-column-title">CARPETES</div>
        <button onClick={() => setColFoldersCollapsed(true)} className="btn-icon btn-icon--transparent d-desktop-only" title="Replegar Columna">
          <PanelLeftClose size={18} />
        </button>
      </div>
      
      <div className="notes-column__body">
        
        {/* LLISTA CARPETES */}
        <div className="folders-list">
          {noteFolders.map((folder) => (
            <button
              key={folder.id}
              type="button"
              onClick={() => handleSelectFolder(folder.id)}
              className={`folder-item ${folder.id === activeFolderId ? 'active' : ''}`}
            >
              <Folder size={16} />
              <span>{folder.name}</span>
            </button>
          ))}
        </div>

        {/* ACCORDION CATEGORIES */}
        <div className="accordion">
          <button 
            type="button"
            onClick={() => setAccCategoriesOpen(!accCategoriesOpen)}
            className="accordion-toggle"
            title="Plegar/Desplegar Categories"
          >
            <span>CATEGORIES</span>
          </button>
          {accCategoriesOpen && (
            <div className="folders-list accordion-content">
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
        </div>

        {/* ACCORDION ETIQUETES */}
        <div className="accordion">
          <button 
            type="button"
            onClick={() => setAccTagsOpen(!accTagsOpen)}
            className="accordion-toggle"
            title="Plegar/Desplegar Etiquetes"
          >
            <span>ETIQUETES</span>
          </button>
          {accTagsOpen && (
            <div className="folders-list accordion-content">
              {['#important', '#idea', '#esborrany'].map((tag) => (
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

      </div>
    </aside>
  );
}
