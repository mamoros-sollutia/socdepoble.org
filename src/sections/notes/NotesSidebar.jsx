import { useState } from 'react';
import { useNotes } from './NotesContext';
import { Folder, Bookmark, Hash, PanelLeftClose, MessageSquare, Newspaper, ShoppingCart, LandPlot, GalleryVerticalEnd, NotebookPen, CalendarDays, Calendar, MapPinned, Inbox, Settings, Clock, ChevronDown, ChevronRight } from 'lucide-react';

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
    settingsOpen, setSettingsOpen,
    timerActive, setTimerActive,
    timerSeconds, setTimerSeconds,
    isCompact, mobilePanel,
    t
  } = useNotes();

  const getCategoryLabel = (category) => t(`section.notes.category.${category}`, category);

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs.toString().padStart(2, '0') + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const SettingsDropdown = () => (
    <div className="dropdown-container">
      <button 
        type="button"
        onClick={() => setSettingsOpen(!settingsOpen)}
        className="btn-icon btn-icon--settings"
        title="Ajustaments i Timer"
      >
        <Settings size={20} />
        {timerActive && (
          <span className="timer-indicator" />
        )}
      </button>
      {settingsOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <span className="flex-center gap-6"><Clock size={14}/> Temps:</span>
            <span>{formatTime(timerSeconds)}</span>
          </div>
          <button 
            type="button"
            onClick={() => setTimerActive(!timerActive)}
            className="dropdown-item"
          >
            {timerActive ? 'Aturar Temporitzador' : 'Iniciar Temporitzador'}
          </button>
          {timerSeconds > 0 && !timerActive && (
            <button 
              type="button"
              onClick={() => setTimerSeconds(0)}
              className="dropdown-item"
            >
              Reiniciar Temps
            </button>
          )}
        </div>
      )}
    </div>
  );

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
        <div className="notes-column__body" style={{ padding: 0 }}>
          <div className="sidebar-actions" style={{ justifyContent: 'center' }}>
            <SettingsDropdown />
          </div>
        </div>
      </aside>
    );
  }

  const totFolder = noteFolders.find(f => f.id === 'f-tot');
  const otherFolders = noteFolders.filter(f => f.id !== 'f-tot');

  return (
    <aside className="notes-column notes-column--left" hidden={isCompact && mobilePanel !== 'folders'}>
      <div className="notes-column-header cursor-pointer" onClick={() => setAccFoldersOpen(!accFoldersOpen)} title="Plegar/Desplegar Carpetes">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {accFoldersOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          <div className="notes-column-title">CARPETES</div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); setColFoldersCollapsed(true); }} 
          className="btn-icon btn-icon--transparent d-desktop-only" 
          title="Replegar Columna"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      <div className="sidebar-actions">
        {totFolder && (
          <button
            type="button"
            onClick={() => handleSelectFolder(totFolder.id)}
            className={`folder-item ${totFolder.id === activeFolderId ? 'active' : ''}`}
          >
            <Inbox size={24} strokeWidth={2.1} />
            <span>{totFolder.name}</span>
          </button>
        )}

        <SettingsDropdown />
      </div>

      <div className="notes-column__body" style={{ padding: 0 }}>
        
        {accFoldersOpen && (
          <div className="folders-list">
            {otherFolders.map((folder) => {
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
          className="notes-column-header notes-column-header--accordion cursor-pointer" 
          onClick={() => setAccCategoriesOpen(!accCategoriesOpen)}
          title="Plegar/Desplegar Categories"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {accCategoriesOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            <div className="notes-column-title">CATEGORIES</div>
          </div>
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
          className="notes-column-header notes-column-header--accordion cursor-pointer" 
          onClick={() => setAccTagsOpen(!accTagsOpen)}
          title="Plegar/Desplegar Etiquetes"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {accTagsOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            <div className="notes-column-title">ETIQUETES</div>
          </div>
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
