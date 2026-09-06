import { useNotes } from './NotesContext';
import { useAppGrid } from '../../components/layout/AppGridShell';
import { Search, NotebookPen } from 'lucide-react';
import AppGridColumn from '../../components/layout/AppGridColumn';

export default function NotesList() {
  const { 
    filteredNotes, activeNote, setActiveNoteId,
    colNotesCollapsed, setColNotesCollapsed
  } = useNotes();
  const { mida, tancaPanells } = useAppGrid();

  if (colNotesCollapsed && mida === 'ample') {
    return (
      <section className="notes-column notes-column--middle collapsed">
        <AppGridColumn
          variant="collapsed"
          titol="Notes"
          icona={NotebookPen}
          onReplega={() => setColNotesCollapsed(false)}
        />
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
    <section className="notes-column notes-column--middle">
      <AppGridColumn
        titol="NOTES"
        icona={NotebookPen}
        onReplega={() => setColNotesCollapsed(true)}
      />
      
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
                  onClick={() => {
                    setActiveNoteId(note.id);
                    tancaPanells();
                  }}
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
