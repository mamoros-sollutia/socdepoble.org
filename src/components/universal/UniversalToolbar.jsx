import { ArrowLeft, List, Globe, Heading2, Bold, Italic, Strikethrough } from 'lucide-react';
import { useContext, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AppGridContext } from '../layout/AppGridShell';

const iconProps = { size: 20, strokeWidth: 2, 'aria-hidden': true, focusable: false };

export default function UniversalToolbar({
  onBack,
  onPublish,
  publishDisabled = false,
  formatState = {},
  formatActions = {},
  t = (key, fallback) => fallback
}) {
  const gridCtx = useContext(AppGridContext);
  
  // Try to use the passed onBack, or fallback to closing the mobile panel (if inside a grid)
  const handleBack = onBack || (() => gridCtx?.setPanellObert('middle'));

  const { isHeading, isList, isBold, isItalic, isStrike } = formatState;
  const { toggleHeading, toggleList, toggleBold, toggleItalic, toggleStrike } = formatActions;

  const [portalTarget, setPortalTarget] = useState(null);

  useEffect(() => {
    // Busquem l'slot a la barra negra només un cop muntat el component
    const el = document.getElementById('global-toolbar-slot');
    if (el) setPortalTarget(el);
  }, []);

  const toolbarContent = (
    <div className="sdp-toolbar sdp-toolbar--inline" role="group" aria-label="Format i accions de la pàgina" style={{ display: 'flex', alignItems: 'center' }}>
      <div className="format-tools sdp-toolbar-group" role="group" aria-label="Format del text" style={{ display: 'flex', gap: '4px', background: 'transparent' }}>
        <button 
          aria-label="Títol de nivell 2"
          onClick={toggleHeading} 
          className={`format-button ${isHeading ? 'active-text' : ''}`}
          disabled={!toggleHeading}
        >
          H₂
        </button>
        <button 
          aria-label={t('section.notes.format.bold', 'Negreta')}
          onClick={toggleBold} 
          className={`format-button ${isBold ? 'active-text' : ''}`}
          disabled={!toggleBold}
        >
          <strong>B</strong>
        </button>
        <button 
          aria-label={t('section.notes.format.italic', 'Cursiva')}
          onClick={toggleItalic} 
          className={`format-button ${isItalic ? 'active-text' : ''}`}
          disabled={!toggleItalic}
        >
          <em>I</em>
        </button>
        <button 
          aria-label={t('section.notes.format.strike', 'Ratllat')}
          onClick={toggleStrike} 
          className={`format-button ${isStrike ? 'active-text' : ''}`}
          disabled={!toggleStrike}
        >
          <s>S</s>
        </button>
        <button 
          aria-label={t('section.notes.format.list', 'Llista desordenada')}
          onClick={toggleList} 
          className={`sdp-toolbar-btn ${isList ? 'is-active' : ''}`}
          disabled={!toggleList}
        >
          <List {...iconProps} />
        </button>
      </div>

      {onPublish && (
        <button 
          type="button"
          className="sdp-boto sdp-boto--primari sdp-boto--sm" 
          disabled={publishDisabled} 
          onClick={onPublish}
          aria-label={t('section.notes.publish', 'Publicar')}
          style={{ marginLeft: '12px' }}
        >
          ◎ {t('section.notes.publish', 'Publicar')}
        </button>
      )}
    </div>
  );

  if (portalTarget) {
    return createPortal(toolbarContent, portalTarget);
  }

  // Fallback si per alguna raó la barra negra no existeix (p. ex., dins de l'editor mòbil flotant)
  return toolbarContent;
}
