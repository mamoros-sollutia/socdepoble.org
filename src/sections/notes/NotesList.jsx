import { useNotes } from './NotesContext';
import { Search, PanelLeftClose, ArrowLeft, NotebookPen } from 'lucide-react';

export default function NotesList() {
  const { 
    filteredNotes, activeNote, setActiveNoteId,
    colNotesCollapsed, setColNotesCollapsed,
    setMobilePanel,
    isCompact, mobilePanel
  } = useNotes();

  if (colNotesCollapsed && !isCompact) {
    return (
      <section className="notes-column notes-column--middle collapsed">
        <div className="notes-column-header notes-column-header--collapsed">
          <button 
            onClick={() => setColNotesCollapsed(false)}
            className="btn-icon hover-bg"
            title="Expandir Notes"
          >
            <NotebookPen size={20} />
          </button>
        </div>
        <div className="notes-column__body notes-list-container sdp-p-0">
          <div className="notes-list-actions sdp-justify-center">
            <button type="button" className="btn-icon" title="Cercar">
              <Search size={20} />
            </button>
          </div>
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
        <div className="sdp-flex sdp-items-center">
          <div className="btn-icon sdp-pointer-events-none sdp-bg-transparent">
            <NotebookPen size={20} />
          </div>
          <div className="notes-column-title">NOTES</div>
        </div>
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
            <button type="button" className="btn-icon" title="Cercar">
              <Search size={20} />
            </button>
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
                  className={`note-card ${isActive ? 'active' : ''} ${note.coverImage ? 'has-thumbnail' : ''}`}
                >
                  {note.coverImage && (
                    <div className="note-card-thumbnail">
                      <img src={note.coverImage} alt={note.title || ''} />
                    </div>
                  )}
                  <div className="conversation-meta">
                    <div className="note-card-header">
                      <span className="note-card-date">{note.formattedDate}</span>
                      <strong>{note.title || 'Sense títol'}</strong>
                    </div>
                    {note.subtitle && (
                      <div className="note-card-subtitle">{note.subtitle}</div>
                    )}
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
