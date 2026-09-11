import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { FileText } from 'lucide-react';
import { useNotes, etiquetesDeNota } from './NotesContext';
import { useManager } from '../../components/universal/manager/ManagerContext';
import NotesToolbar from './NotesToolbar';
import UniversalEditorShell from '../../components/universal/UniversalEditorShell';

export default function NotesEditor() {
  const { saveNoteField, setLocalNoteField, noteFolders, t } = useNotes();
  const { activeItem: activeNote } = useManager();
  const timeoutRef = useRef(null);
  const pendingSaveRef = useRef({ id: null, content: null });
  const currentNoteRef = useRef({ id: null, title: '', subtitle: '', lead: '' });

  if (currentNoteRef.current.id !== activeNote?.id) {
    currentNoteRef.current = {
      id: activeNote?.id,
      title: activeNote?.title || '',
      subtitle: activeNote?.subtitle || '',
      lead: activeNote?.lead || ''
    };
  }

  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3, 4] } })],
    content: activeNote?.content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      pendingSaveRef.current = { id: activeNote?.id, content: html };
      setLocalNoteField(activeNote?.id, 'content', html);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        saveNoteField(activeNote?.id, 'content', html);
        pendingSaveRef.current = { id: null, content: null };
      }, 800);
    },
    editorProps: {
      attributes: {
        class: 'editor-content page-content sdp-text-cos sdp-prose'
      },
    },
  });

  useEffect(() => {
    if (!editor || editor.isDestroyed || !activeNote) return;
    try {
      if (editor.getHTML() !== activeNote.content) {
        editor.commands.setContent(activeNote.content || '', false);
      }
    } catch (err) {
      console.warn('Editor sync skipped (Fast Refresh / not ready)', err);
    }
  }, [activeNote?.id, editor]);

  // Guardat segur al canviar de nota, desmuntar o en tancar la pestanya (pagehide)
  useEffect(() => {
    const currentId = activeNote?.id;

    const flushSave = () => {
      if (timeoutRef.current && pendingSaveRef.current.id === currentId) {
        clearTimeout(timeoutRef.current);
        saveNoteField(currentId, 'content', pendingSaveRef.current.content);
        pendingSaveRef.current = { id: null, content: null };
      }
    };

    window.addEventListener('pagehide', flushSave);
    return () => {
      window.removeEventListener('pagehide', flushSave);
      flushSave();
    };
  }, [activeNote?.id, saveNoteField]);

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

  return (
    <UniversalEditorShell
      topBar={<NotesToolbar editor={editor} />}
      titleText={activeNote.title || 'Sense Títol'}
      heroImage={activeNote.heroImage}
      logoImage={activeNote.logoImage}
      isPublished={activeNote.isPublished}
      formattedTime={activeNote.formattedTime}
      formattedDate={activeNote.formattedDate}
      titleHtml={currentNoteRef.current.title}
      subtitleHtml={currentNoteRef.current.subtitle}
      leadHtml={currentNoteRef.current.lead}
      onSaveField={(field, value) => saveNoteField(activeNote.id, field, value)}
      onLocalChange={(field, value) => setLocalNoteField(activeNote.id, field, value)}
      labels={etiquetesDeNota(activeNote, noteFolders, {})}
    >
      <div className="editor-tiptap-container">
        <EditorContent editor={editor} />
      </div>
    </UniversalEditorShell>
  );
}
