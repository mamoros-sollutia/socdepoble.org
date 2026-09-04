import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image as ImageIcon, Lock, Globe, FileText, ArrowLeft } from 'lucide-react';
import { useNotes, etiquetesDeNota } from './NotesContext';
import NotesToolbar from './NotesToolbar';
import { DateTimeControl, Dropdown, DropdownItem, UniversalPage } from '../../components/universal/UniversalComponents';
import { sanitizeHtml } from '../../utils/sanitize.js';

export default function NotesEditor() {
  const { activeNote, saveNoteField, setLocalNoteField, noteFolders, t, isCompact, mobilePanel, setMobilePanel, handleSelectCategory, handleSelectFolder, handleSelectTag } = useNotes();
  const [isEditingImage, setIsEditingImage] = useState(false);
  const timeoutRef = useRef(null);
  const pendingSaveRef = useRef({ id: null, content: null });
  const currentNoteRef = useRef({ id: null, title: '', subtitle: '', lead: '' });
  const fileInputRef = useRef(null);

  const LIMIT_HERO = 512 * 1024;

  const triaImatge = (e) => {
    const fitxer = e.target.files?.[0];
    e.target.value = '';
    if (!fitxer) return;
    if (!fitxer.type.startsWith('image/')) return alert('Només imatges, de moment.');
    if (fitxer.size > LIMIT_HERO) return alert('La imatge passa de 512 KB. Redueix-la abans.');
    const lector = new FileReader();
    lector.onload = () => { 
      saveNoteField(activeNote.id, 'heroImage', String(lector.result)); 
      setIsEditingImage(false); 
    };
    lector.onerror = () => alert("No s'ha pogut llegir el fitxer.");
    lector.readAsDataURL(fitxer);
  };

  const handleDeleteHero = () => {
    if (!window.confirm('Esborrar definitivament la imatge de capçalera?')) return;
    saveNoteField(activeNote.id, 'heroImage', ''); 
    setIsEditingImage(false);
  };

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
        editor.commands.setContent(activeNote.content || '');
      }
    } catch (err) {
      console.warn('Editor sync skipped (Fast Refresh / not ready)', err);
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

  // Reset image editing state when switching notes
  useEffect(() => {
    setIsEditingImage(false);
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
          titleText={activeNote.title || 'Sense Títol'}
          chrome="context" 
          variant="embed"
          showLogos={!activeNote.heroImage}
          topBarData={{
            heroComponent: (activeNote.heroImage && !isEditingImage) ? (
              <img 
                src={activeNote.heroImage} 
                alt="Capçalera" 
                className="hero-editable" 
                onClick={() => setIsEditingImage(true)}
                title="Clica per canviar la imatge"
              />
            ) : (
              <div className="hero-accions">
                <input type="file" accept="image/*" ref={fileInputRef} onChange={triaImatge} className="sdp-ocult" style={{display: 'none'}} />
                <button type="button" className="pill hero-accions__inserir" onClick={() => fileInputRef.current?.click()}>
                  <ImageIcon size={16} /> Inserir Imatge o Multimèdia
                </button>
                {activeNote.heroImage && (
                  <div className="hero-accions__grup">
                    <button type="button" className="pill hero-accions__cancelar" onClick={() => setIsEditingImage(false)}>
                      Tornar enrere
                    </button>
                    <button type="button" className="pill hero-accions__esborrar" onClick={handleDeleteHero}>
                      Esborrar contingut
                    </button>
                  </div>
                )}
              </div>
            ),
            barActions: (
              <>
                <Dropdown
                  right
                  minWidth="320px"
                  trigger={
                    <button type="button" className="btn-icon-orange sp-card-time">
                      <Lock size={16} />
                    </button>
                  }
                >
                  <div className="dropdown-info-header">
                    <strong>{activeNote.isPublished ? 'Exemple de Publicació' : 'Pàgina en Edició'}</strong>
                    <p>Aquesta targeta és una previsualització de com quedarà al Mur. Utilitza l'editor inferior per modificar el contingut.</p>
                  </div>
                </Dropdown>
                <DateTimeControl time={activeNote.formattedTime} date={activeNote.formattedDate} />
              </>
            )
          }}
          title={
            <span
              key={`title-${activeNote.id}`}
              className="editor-title-input"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setLocalNoteField(activeNote.id, 'title', e.currentTarget.innerHTML)}
              onBlur={(e) => saveNoteField(activeNote.id, 'title', e.currentTarget.innerHTML)}
              data-placeholder="Escriu el títol de l'article (H1)..."
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentNoteRef.current.title) }}
              style={{ display: 'inline-block', minWidth: '10px' }}
            />
          }
          labels={etiquetesDeNota(activeNote, noteFolders, {
             carpeta: handleSelectFolder,
             categoria: handleSelectCategory,
             etiqueta: handleSelectTag
          })}
          copyright="© Sóc de Poble / Fet per la IAIA i Nano Banana"
          subtitle={
            <span
              key={`subtitle-${activeNote.id}`}
              className="editor-subtitle-input"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setLocalNoteField(activeNote.id, 'subtitle', e.currentTarget.innerHTML)}
              onBlur={(e) => saveNoteField(activeNote.id, 'subtitle', e.currentTarget.innerHTML)}
              data-placeholder="Escriu el subtítol (H2)..."
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentNoteRef.current.subtitle) }}
              style={{ display: 'block', minWidth: '10px' }}
            />
          }
          lead={
            <span
              key={`lead-${activeNote.id}`}
              className="editor-lead-input"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setLocalNoteField(activeNote.id, 'lead', e.currentTarget.innerHTML)}
              onBlur={(e) => saveNoteField(activeNote.id, 'lead', e.currentTarget.innerHTML)}
              data-placeholder="Escriu l'entradilla..."
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentNoteRef.current.lead) }}
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
