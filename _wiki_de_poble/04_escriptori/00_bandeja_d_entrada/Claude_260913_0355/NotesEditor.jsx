import { FileText } from 'lucide-react';
import { useNotes } from './NotesContext';
import { useManager } from '../../components/universal/manager/ManagerContext';
import { showToast } from '../../components/universal/AvisadorEfimer.jsx';
import { UniversalEditorShell } from '../../components/universal/UniversalEditorShell';
import {
  useUniversalRichText,
  UniversalRichTextToolbar,
  UniversalRichTextContent
} from '../../components/universal/richText';

export default function NotesEditor() {
  const { saveNoteField, setLocalNoteField, publishNote, t } = useNotes();
  const { activeItem: activeNote } = useManager();
  const noteId = activeNote?.id;

  /* El motor rep l'`id` a cada desat: si el buidatge de seguretat arriba
     després d'haver canviat de nota, escriu a la nota que toca i no a la
     que hi ha oberta ara. */
  const editor = useUniversalRichText({
    content: activeNote?.content || '',
    id: noteId,
    onChange: (html) => { if (noteId) setLocalNoteField(noteId, 'content', html); },
    onSave: (html, idDesat) => {
      const desti = idDesat || noteId;
      if (desti) saveNoteField(desti, 'content', html);
    },
    debounceMs: 800
  });

  if (!activeNote) {
    return (
      <section className="editor-shell--main">
        <div className="chat-empty">
          <FileText size={64} aria-hidden focusable="false" />
          <h2 className="section-title">{t('section.notes.open', 'Obri un solc')}</h2>
        </div>
      </section>
    );
  }

  return (
    <UniversalEditorShell
      id={noteId}
      topBar={
        <UniversalRichTextToolbar
          editor={editor}
          onPublish={() => publishNote(activeNote)}
          publishDisabled={!noteId}
          isPublished={activeNote.isPublished}
          t={t}
        />
      }
      titleHtml={activeNote.title}
      subtitleHtml={activeNote.subtitle}
      leadHtml={activeNote.lead}
      heroImage={activeNote.heroImage}
      logoImage={activeNote.logoImage}
      isPublished={Boolean(activeNote.isPublished)}
      formattedTime={activeNote.formattedTime}
      formattedDate={activeNote.formattedDate}
      onLocalChange={(camp, val) => setLocalNoteField(noteId, camp, val)}
      onSaveField={(camp, val) => saveNoteField(noteId, camp, val)}
      onNotify={showToast}
    >
      <UniversalRichTextContent editor={editor} />
    </UniversalEditorShell>
  );
}
