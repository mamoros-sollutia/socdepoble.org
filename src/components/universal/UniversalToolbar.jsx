import { ArrowLeft, List, Globe, Heading2, Bold, Italic, Strikethrough } from 'lucide-react';
import { useContext } from 'react';
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

  return (
    <header className="format-fascia" role="group" aria-label="Format i accions de la pàgina">
      <button 
        type="button" 
        aria-label="Tornar a la llista" 
        title="Tornar a la llista"
        onClick={handleBack} 
        className="format-button d-mobile-only"
      >
        <ArrowLeft {...iconProps} />
      </button>
      
      <div className="format-tools" role="group" aria-label="Format del text">
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
          className={`format-button ${isList ? 'active-text' : ''}`}
          disabled={!toggleList}
        >
          <List {...iconProps} />
        </button>
      </div>

      {onPublish && (
        <button 
          type="button"
          className="publish" 
          disabled={publishDisabled} 
          onClick={onPublish}
          aria-label={t('section.notes.publish', 'Publicar')}
        >
          ◎ {t('section.notes.publish', 'Publicar')}
        </button>
      )}
    </header>
  );
}
