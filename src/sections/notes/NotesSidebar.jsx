import { useState } from 'react';
import { useNotes } from './NotesContext';
import { useAppGrid } from '../../components/layout/AppGridShell';
import AppGridColumn from '../../components/layout/AppGridColumn';
import { Folder, Bookmark, Hash, Newspaper, ShoppingCart, LandPlot, GalleryVerticalEnd, NotebookPen, Calendar, MapPinned, Inbox, Settings, Clock } from 'lucide-react';

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
    activeTag, handleSelectTag,
    colFoldersCollapsed, setColFoldersCollapsed,
    accCategoriesOpen, setAccCategoriesOpen,
    accTagsOpen, setAccTagsOpen,
    settingsOpen, setSettingsOpen,
    timerActive, setTimerActive,
    timerSeconds, setTimerSeconds,
    isCompact, mobilePanel,
    t
  } = useNotes();
  const { mida, setPanellObert } = useAppGrid();
  const isCompactGrid = mida !== 'ample';

  const onSelectFolder = (id) => {
    handleSelectFolder(id);
    if (isCompactGrid) setPanellObert('middle');
  };

  const onSelectCategory = (cat) => {
    handleSelectCategory(cat);
    if (isCompactGrid) setPanellObert('middle');
  };

  const onSelectTag = (tag) => {
    handleSelectTag(tag);
    if (isCompactGrid) setPanellObert('middle');
  };

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
            <span className="sidebar-meta-item"><Clock size={14}/> Temps:</span>
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
        <AppGridColumn
          variant="collapsed"
          titol="Carpetes"
          icona={Folder}
          onReplega={() => setColFoldersCollapsed(false)}
        />
        <div className="notes-column__body" className="no-padding">
          <div className="sidebar-actions">
            <SettingsDropdown />
          </div>
        </div>
      </aside>
    );
  }

  const totFolder = noteFolders.find(f => f.id === 'f-tot');
  const normalize = (str) => (str || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const otherFolders = noteFolders.filter(f => {
    if (f.id === 'f-tot') return false;
    const nameStr = normalize(f.name);
    return !nameStr.includes('histories') && !nameStr.includes('histories del poble');
  });

  return (
    <aside className="notes-column notes-column--left" hidden={isCompact && mobilePanel !== 'folders'}>
      <AppGridColumn
        titol="CARPETES"
        plegable
        obert={accFoldersOpen}
        onPlega={() => setAccFoldersOpen(!accFoldersOpen)}
        onReplega={() => setColFoldersCollapsed(true)}
      />

      <div className="sidebar-actions">
        {totFolder && (
          <button
            type="button"
            onClick={() => onSelectFolder(totFolder.id)}
            className={`folder-item ${totFolder.id === activeFolderId ? 'active' : ''}`}
          >
            <Inbox size={24} strokeWidth={2.1} />
            <span>{totFolder.name}</span>
          </button>
        )}

        <SettingsDropdown />
      </div>

      <div className="notes-column__body" className="no-padding">
        
        {accFoldersOpen && (
          <div className="folders-list">
            {otherFolders.map((folder) => {
              const isGlobal = !!FOLDER_ICONS[folder.id];
              const Icon = FOLDER_ICONS[folder.id] || Folder;
              
              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => onSelectFolder(folder.id)}
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
        <AppGridColumn
          variant="accordion"
          titol="CATEGORIES"
          plegable
          obert={accCategoriesOpen}
          onPlega={() => setAccCategoriesOpen(!accCategoriesOpen)}
        />
        
        {accCategoriesOpen && (
          <div className="folders-list">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onSelectCategory(category)}
                className={`folder-item ${category === activeCategory ? 'active' : ''}`}
              >
                <Bookmark size={16} />
                <span>{getCategoryLabel(category)}</span>
              </button>
            ))}
          </div>
        )}

        {/* ACCORDION ETIQUETES */}
        <AppGridColumn
          variant="accordion"
          titol="ETIQUETES"
          plegable
          obert={accTagsOpen}
          onPlega={() => setAccTagsOpen(!accTagsOpen)}
        />

        {accTagsOpen && (
          <div className="folders-list">
            {['Productivitat', 'Tutorial'].map((tag) => (
              <button
                key={tag}
                type="button"
                className={`folder-item ${tag === activeTag ? 'active' : ''}`}
                onClick={() => onSelectTag(tag)}
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
