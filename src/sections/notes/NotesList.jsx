import { useNotes } from './NotesContext';
import { List, Search, Settings, PanelLeftClose, Clock, ArrowLeft } from 'lucide-react';

export default function NotesList() {
  const { 
    filteredNotes, activeNote, setActiveNoteId,
    colNotesCollapsed, setColNotesCollapsed,
    settingsOpen, setSettingsOpen,
    timerActive, setTimerActive,
    timerSeconds, setTimerSeconds,
    setMobilePanel,
    isCompact, mobilePanel,
    t
  } = useNotes();

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs.toString().padStart(2, '0') + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (colNotesCollapsed && !isCompact) {
    return (
      <section className="notes-column notes-column--middle collapsed">
        <div className="notes-column-header notes-column-header--collapsed">
          <button 
            onClick={() => setColNotesCollapsed(false)}
            className="btn-icon hover-bg"
            title="Expandir Notes"
          >
            <List size={20} />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="notes-column notes-column--middle" hidden={isCompact && mobilePanel !== 'notes'}>
      <div className="notes-column-header">
        <button 
          onClick={() => setMobilePanel('folders')} 
          className="btn-icon btn-icon--transparent d-mobile-only"
          title="Tornar a Carpetes"
          aria-label="Tornar a Carpetes"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="notes-column-title">NOTES</div>
        <button 
          onClick={() => setColNotesCollapsed(true)} 
          className="btn-icon btn-icon--transparent d-desktop-only"
          title="Replegar Columna"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>
      
      <div className="notes-column__body notes-list-container">
        <div className="notes-list-actions">
          <div className="notes-actions-left">
            <button type="button" className="btn-icon text-muted" title="Cercar">
              <Search size={18} />
            </button>
            <div className="dropdown-container">
              <button 
                type="button"
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="btn-icon btn-icon--settings text-muted"
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
          </div>
          <button type="button" className="btn-create">
            CREAR NOTA
          </button>
        </div>

        <div className="notes-column__scroll">
          <div className="note-list">
            {filteredNotes.map((note) => {
              const isActive = note.id === activeNote?.id;
              return (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => setActiveNoteId(note.id)}
                  className={`note-card ${isActive ? 'active' : ''}`}
                >
                  <div className="conversation-meta">
                    <div className="note-card-header">
                      <strong>{note.title || 'Sense títol'}</strong>
                      <span className="note-card-date">{note.formattedDate}</span>
                    </div>
                    <span className="conversation-preview line-clamp">
                      {note.subtitle || t('section.notes.emptyPreview', 'Sense contingut...')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
