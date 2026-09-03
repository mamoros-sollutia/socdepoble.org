import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image as ImageIcon, Lock, Globe, FileText, Pencil, ArrowLeft } from 'lucide-react';
import { useNotes } from './NotesContext';
import NotesToolbar from './NotesToolbar';
import { DateTimeControl, Dropdown, DropdownItem, UniversalPage } from '../../components/universal/UniversalComponents';
import { sanitizeHtml } from '../../utils/sanitize.js';

export default function NotesEditor() {
  const { activeNote, saveNoteField, noteFolders, t, isCompact, mobilePanel, setMobilePanel } = useNotes();
  const timeoutRef = useRef(null);
  const pendingSaveRef = useRef({ id: null, content: null });

  const editor = useEditor({
    extensions: [StarterKit],
    content: activeNote?.content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      pendingSaveRef.current = { id: activeNote?.id, content: html };
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
    if (editor && activeNote) {
      if (editor.getHTML() !== activeNote.content) {
        editor.commands.setContent(activeNote.content || '');
      }
    }
  }, [activeNote?.id, editor]);

  // Guardat segur al canviar de nota o desmuntar
  useEffect(() => {
    const currentId = activeNote?.id;
    return () => {
      if (timeoutRef.current && pendingSaveRef.current.id === currentId) {
        clearTimeout(timeoutRef.current);
        saveNoteField(currentId, 'content', pendingSaveRef.current.content);
        pendingSaveRef.current = { id: null, content: null };
      }
    };
  }, [activeNote?.id]);

  if (!activeNote) {
    return (
      <section className="notes-column notes-column--editor" hidden={isCompact && mobilePanel !== 'editor'}>
        <div className="chat-empty">
          {isCompact && <button type="button" className="btn-create" onClick={() => setMobilePanel('notes')}><ArrowLeft size={20} /> Tornar a la llista</button>}
          <FileText size={64} />
          <h2 className="section-title">{t('section.notes.open', 'Obre un solc')}</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="notes-column notes-column--editor" hidden={isCompact && mobilePanel !== 'editor'}>
      <NotesToolbar editor={editor} />

      <div className="editor-scroll-area">
        <UniversalPage 
          chrome="context" 
          variant="embed"
          showLogos={true}
          topBarData={{
            heroComponent: activeNote.heroImage ? (
              <img src={activeNote.heroImage} alt="Cover" className="hero-image-img" />
            ) : (
              <div className="sdp-p-6 sdp-mb-4" style={{ display: 'flex', justifyContent: 'center', background: 'var(--sdp-fons-app)' }}>
                <button type="button" className="pill dashed-pill pointer">
                  <ImageIcon size={16} /> Inserir Imatge o Multimèdia
                </button>
              </div>
            ),
            barActions: (
              <>
                <Dropdown
                  right
                  minWidth="320px"
                  trigger={
                    <button type="button" className="btn-date-time sp-card-time btn-round-icon text-white">
                      <Lock size={16} />
                    </button>
                  }
                >
                  <div className="dropdown-info-header">
                    <strong>{activeNote.isPublished ? 'Exemple de Publicació' : 'Pàgina en Edició'}</strong>
                    <p>Aquesta targeta és una previsualització de com quedarà al Mur. Utilitza l'editor inferior per modificar el contingut.</p>
                  </div>
                  <DropdownItem icon={<Lock size={16} />} onClick={() => {}}>Privada (Oculta)</DropdownItem>
                  <DropdownItem icon={<Globe size={16} />} onClick={() => {}}>Pública al Mur</DropdownItem>
                </Dropdown>
                <DateTimeControl time={activeNote.formattedTime} date={activeNote.formattedDate} />
              </>
            )
          }}
          title={
            <span
              className="editor-title-input"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => saveNoteField(activeNote.id, 'title', e.currentTarget.innerHTML)}
              data-placeholder="Escriu el títol de l'article (H1)..."
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeNote.title || '') }}
              style={{ display: 'inline-block', minWidth: '10px' }}
            />
          }
          labels={[
             { text: noteFolders.find(f => f.id === activeNote.folderId)?.name || 'General', className: 'sdp-badge-system' },
             { text: 'Mur', className: 'sdp-badge-category' },
             ...(activeNote.category ? [{ text: activeNote.category, className: 'sdp-badge-category' }] : []),
             ...(activeNote.tags || []).map(t => ({ text: t, className: 'sdp-badge-neutral outline-badge' }))
          ]}
          copyright="© Sóc de Poble / Fet per la IAIA i Nano Banana"
          subtitle={
            <span
              className="editor-subtitle-input"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => saveNoteField(activeNote.id, 'subtitle', e.currentTarget.innerHTML)}
              data-placeholder="Escriu el subtítol (H2)..."
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeNote.subtitle || '') }}
              style={{ display: 'block', minWidth: '10px' }}
            />
          }
          lead={
            <span
              className="editor-lead-input"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => saveNoteField(activeNote.id, 'lead', e.currentTarget.innerHTML)}
              data-placeholder="Escriu l'entradilla..."
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeNote.lead || '') }}
              style={{ display: 'block', minWidth: '10px' }}
            />
          }
        >
          <div className="editor-tiptap-container">
            <EditorContent editor={editor} />
          </div>
        </UniversalPage>
      </div>
    </section>
  );
}
