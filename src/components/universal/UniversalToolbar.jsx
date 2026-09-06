import { ArrowLeft, List, Globe, Heading2, Bold, Italic, Strikethrough } from 'lucide-react';
import { useAppGrid } from '../layout/AppGridShell';

const iconProps = { size: 20, strokeWidth: 2, 'aria-hidden': true, focusable: false };

export default function UniversalToolbar({
  onBack,
  onPublish,
  publishDisabled = false,
  isPublished = false,
  editor = null, // Optional TipTap editor for formatting state and commands
  t = (key, fallback) => fallback
}) {
  const { setPanellObert } = useAppGrid();
  
  // Try to use the passed onBack, or fallback to closing the mobile panel
  const handleBack = onBack || (() => setPanellObert('middle'));

  // If no editor is provided, these will just be inactive UI buttons
  const isHeading = editor?.isActive('heading', { level: 2 });
  const isList = editor?.isActive('bulletList');
  const isBold = editor?.isActive('bold');
  const isItalic = editor?.isActive('italic');
  const isStrike = editor?.isActive('strike');

  return (
    <div className="editor-toolbar" role="group" aria-label="Format i accions de la pàgina">
      <button 
        type="button" 
        aria-label="Tornar a la llista" 
        title="Tornar a la llista"
        onClick={handleBack} 
        className="btn-icon d-mobile-only"
      >
        <ArrowLeft {...iconProps} />
      </button>
      
      <div className="toolbar-actions" role="group" aria-label="Format del text">
        <button 
          aria-label="Alternar encapçalament"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} 
          className={`btn-icon ${isHeading ? 'active-text' : ''}`}
          disabled={!editor}
        >
          <Heading2 {...iconProps} />
        </button>
        <button 
          aria-label={t('section.notes.format.list', 'Llista')}
          onClick={() => editor?.chain().focus().toggleBulletList().run()} 
          className={`btn-icon ${isList ? 'active-text' : ''}`}
          disabled={!editor}
        >
          <List {...iconProps} />
        </button>
        <button 
          aria-label={t('section.notes.format.bold', 'Negreta')}
          onClick={() => editor?.chain().focus().toggleBold().run()} 
          className={`btn-icon ${isBold ? 'active-text' : ''}`}
          disabled={!editor}
        >
          <Bold {...iconProps} />
        </button>
        <button 
          aria-label={t('section.notes.format.italic', 'Cursiva')}
          onClick={() => editor?.chain().focus().toggleItalic().run()} 
          className={`btn-icon ${isItalic ? 'active-text' : ''}`}
          disabled={!editor}
        >
          <Italic {...iconProps} />
        </button>
        <button 
          aria-label={t('section.notes.format.strike', 'Ratllat')}
          onClick={() => editor?.chain().focus().toggleStrike().run()} 
          className={`btn-icon ${isStrike ? 'active-text' : ''}`}
          disabled={!editor}
        >
          <Strikethrough {...iconProps} />
        </button>
      </div>
      
      <button 
        type="button" 
        aria-label="Publicar" 
        onClick={onPublish} 
        disabled={publishDisabled}
        className="btn-publish"
      >
        <Globe {...iconProps} /> PUBLICAR
      </button>
    </div>
  );
}
