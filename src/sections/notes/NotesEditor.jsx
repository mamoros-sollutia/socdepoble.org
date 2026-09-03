import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image as ImageIcon, Lock, Globe, FileText, Pencil, ArrowLeft } from 'lucide-react';
import { useNotes } from './NotesContext';
import NotesToolbar from './NotesToolbar';
import { DateTimeControl, Dropdown, DropdownItem } from '../../components/universal/UniversalComponents';
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
        {activeNote.heroImage ? (
          <div className="hero-image">
            <img src={activeNote.heroImage} alt="Cover" className="hero-image-img" />
          </div>
        ) : (
          <div className="sdp-p-6 sdp-mb-4" style={{ display: 'flex', justifyContent: 'center' }}>
            <button type="button" className="pill dashed-pill pointer">
              <ImageIcon size={16} /> Inserir Imatge o Multimèdia
            </button>
          </div>
        )}

        <section className="bar-orange" aria-label="Autoria i data">
          <div className="sp-card-author">
            {activeNote.authorAvatar ? (
              <img className="sp-card-avatar" src={activeNote.authorAvatar} alt={activeNote.author || "Usuari"} width="48" height="48" />
            ) : (
              <div className="sp-card-avatar" style={{ backgroundColor: 'var(--sdp-secondary-500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {activeNote.author ? activeNote.author.substring(0,2).toUpperCase() : 'UP'}
              </div>
            )}
            <div className="sp-card-author-info">
              <div className="sp-card-author-name">{activeNote.author || 'Usuari de prova'}</div>
              <div className="sp-card-author-location">{activeNote.location || "Poble de l'usuari"}</div>
            </div>
          </div>
          <div className="bar-actions">
            <Dropdown
              right
              minWidth="320px"
              trigger={
                <button type="button" className="btn-date-time sp-card-time btn-round-icon text-white">
                  {activeNote.isPublished ? <Lock size={16} /> : <Pencil size={16} />}
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
          </div>
        </section>

          <article className="card universal-page page-article">
            <header className="page-title">
              {!activeNote.headerImage ? (
                <div className="notes-header-media" style={{ display: 'flex', justifyContent: 'center' }}>
                  <button type="button" className="pill dashed-pill pointer">
                    <ImageIcon size={16} /> Inserir Imatge o Multimèdia
                  </button>
                </div>
              ) : (
                <div className="notes-header-media" style={{ display: 'flex', justifyContent: 'center' }}>
                  <img src={activeNote.headerImage} alt="Imatge de capçalera" style={{ maxWidth: '600px', width: '100%', height: 'auto', maxHeight: '600px', objectFit: 'contain' }} />
                </div>
              )}

              <h1 
                className="editor-title-input sdp-text-center"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => saveNoteField(activeNote.id, 'title', e.currentTarget.innerHTML)}
                data-placeholder="Escriu el títol de l'article (H1)..."
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeNote.title || '') }}
              />

              <ul className="sp-card-labels page-title-labels">
                <li className="sp-card-label sdp-badge-system">{noteFolders.find(f => f.id === activeNote.folderId)?.name || 'General'}</li>
                <li className="sp-card-label sdp-badge-category">Mur</li>
                {activeNote.category && (
                  <li className="sp-card-label sdp-badge-category">{activeNote.category}</li>
                )}
                {activeNote.tags?.map(tag => (
                  <li key={tag} className="sp-card-label sdp-badge-neutral outline-badge">{tag}</li>
                ))}
              </ul>

              <p className="sp-card-copyright page-title-copyright">
                © Sóc de Poble / Fet per la IAIA i Nano Banana
              </p>
            </header>

            <div className="page-intro">
              <h2 
                className="editor-subtitle-input"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => saveNoteField(activeNote.id, 'subtitle', e.currentTarget.innerHTML)}
                data-placeholder="Escriu el subtítol (H2)..."
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeNote.subtitle || '') }}
              />

              <p 
                className="lead editor-lead-input"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => saveNoteField(activeNote.id, 'lead', e.currentTarget.innerHTML)}
                data-placeholder="Escriu l'entradilla..."
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeNote.lead || '') }}
              />
            </div>
            
            <div className="editor-tiptap-container">
              <EditorContent editor={editor} />
            </div>
          </article>
      </div>
    </section>
  );
}
