import { FileText } from 'lucide-react';
import { useNotes, etiquetesDeNota } from './NotesContext';
import { useManager } from '../../components/universal/manager/ManagerContext';
import { UniversalEditorShell } from '../../components/universal/UniversalEditorShell';
import { useUniversalRichText, UniversalRichTextToolbar, UniversalRichTextContent } from '../../components/universal/richText';
import { PageFrame } from '../../components/universal/PageFrame';

export default function NotesEditor() {
  const { saveNoteField, setLocalNoteField, publishNote, noteFolders, t } = useNotes();
  const { activeItem: activeNote } = useManager();

  const editor = useUniversalRichText({
    content: activeNote?.content || '',
    id: activeNote?.id,
    onChange: (html, noteId) => {
      if (noteId) setLocalNoteField(noteId, 'content', html);
    },
    onSave: (html, noteId) => {
      if (noteId) saveNoteField(noteId, 'content', html);
    },
    debounceMs: 800
  });

  if (!activeNote) {
    return (
      <section className="editor-shell--main">
        <div className="chat-empty">
          <FileText size={64} />
          <h2 className="section-title">{t('section.notes.open', 'Obre un solc')}</h2>
        </div>
      </section>
    );
  }

  const topBar = (
    <UniversalRichTextToolbar 
      editor={editor}
      onPublish={() => publishNote(activeNote)}
      publishDisabled={!activeNote}
      isPublished={activeNote?.isPublished}
      t={t}
    />
  );

  return (
    <PageFrame
      chrome="none"
      variant="embed"
      layout="editor"
    >
      <UniversalEditorShell
        key={activeNote.id}
        id={activeNote.id}
        topBar={topBar}
        titleHtml={activeNote.title}
        subtitleHtml={activeNote.subtitle}
        leadHtml={activeNote.lead}
        heroImage={activeNote.heroImage}
        logoImage={activeNote.logoImage}
        isPublished={activeNote.isPublished}
        formattedTime={activeNote.formattedTime}
        formattedDate={activeNote.formattedDate}
        labels={etiquetesDeNota(activeNote, noteFolders, {})}
        onLocalChange={(field, val, noteId) => setLocalNoteField(noteId, field, val)}
        onSaveField={(field, val, noteId) => saveNoteField(noteId, field, val)}
        onToast={(msg, type) => console.log('Toast:', msg, type)}
      >
        <UniversalRichTextContent editor={editor} />
      </UniversalEditorShell>
    </PageFrame>
  );
}
