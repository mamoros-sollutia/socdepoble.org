import { ArrowLeft, List, Globe, Heading2, Bold, Italic, Strikethrough } from 'lucide-react';
import { useEditorState } from '@tiptap/react';
import { useNotes } from './NotesContext';

const iconProps = { size: 20, strokeWidth: 2, 'aria-hidden': true, focusable: false };

export default function NotesToolbar({ editor }) {
  const { publishNote, activeNote, setMobilePanel, t } = useNotes();
  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => current ? {
      heading: current.isActive('heading', { level: 2 }),
      list: current.isActive('bulletList'),
      bold: current.isActive('bold'),
      italic: current.isActive('italic'),
      strike: current.isActive('strike'),
    } : {},
  }) || {};

  return (
    <div className="editor-toolbar" role="group" aria-label="Format i accions de la nota">
      <button type="button" aria-label="Tornar a la llista" title="Tornar a la llista"
        onClick={() => setMobilePanel('notes')} className="btn-icon d-mobile-only">
        <ArrowLeft {...iconProps} />
      </button>
      <div className="toolbar-actions" role="group" aria-label="Format del text">
        <button 
          aria-label="Alternar encapçalament"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} 
          className={`btn-icon ${editor?.isActive('heading', { level: 2 }) ? 'active-text' : ''}`}
        >
          <Heading2 {...iconProps} />
        </button>
        <button 
          aria-label={t('section.notes.format.list', 'Llista')}
          onClick={() => editor?.chain().focus().toggleBulletList().run()} 
          className={`btn-icon ${editor?.isActive('bulletList') ? 'active-text' : ''}`}
        >
          <List {...iconProps} />
        </button>
        <button 
          aria-label={t('section.notes.format.bold', 'Negreta')}
          onClick={() => editor?.chain().focus().toggleBold().run()} 
          className={`btn-icon ${editor?.isActive('bold') ? 'active-text' : ''}`}
        >
          <Bold {...iconProps} />
        </button>
        <button 
          aria-label={t('section.notes.format.italic', 'Cursiva')}
          onClick={() => editor?.chain().focus().toggleItalic().run()} 
          className={`btn-icon ${editor?.isActive('italic') ? 'active-text' : ''}`}
        >
          <Italic {...iconProps} />
        </button>
        <button 
          aria-label={t('section.notes.format.strike', 'Ratllat')}
          onClick={() => editor?.chain().focus().toggleStrike().run()} 
          className={`btn-icon ${editor?.isActive('strike') ? 'active-text' : ''}`}
        >
          <Strikethrough {...iconProps} />
        </button>
      </div>
      <button type="button" aria-label="Publicar nota" onClick={publishNote} disabled={!activeNote}
        className="btn-publish"><Globe {...iconProps} /> PUBLICAR</button>
    </div>
  );
}
