import { Image as ImageIcon, Lock, Globe } from 'lucide-react';
import { DateTimeControl, Dropdown, UniversalPage } from './UniversalComponents';
import { sanitizeHtml } from '../../utils/sanitize.js';
import useHeroImageHandler from '../../hooks/useHeroImageHandler.js';

export default function UniversalEditorShell({
  children,
  className = '',
  topBar,
  titleText = 'Sense Títol',
  heroImage,
  logoImage,
  isPublished,
  formattedTime,
  formattedDate,
  titleHtml = '',
  subtitleHtml = '',
  leadHtml = '',
  onSaveField,    // (field, value) => void
  onLocalChange,  // (field, value) => void
  labels = [],
  copyright = '© Sóc de Poble / Fet per la IAIA i Nano Banana',
}) {
  const heroHandler = useHeroImageHandler({ onSaveField, fieldName: 'heroImage' });
  const logoHandler = useHeroImageHandler({ onSaveField, fieldName: 'logoImage' });

  return (
    <section className={`editor-shell--main ${className}`}>
      {topBar}
      <div className="editor-scroll-area">
        <UniversalPage 
          titleText={titleText}
          chrome="context" 
          variant="embed"
          showLogos={!heroImage}
          topBarData={{
            logoComponent: (logoImage && !logoHandler.isEditing) ? (
              <img 
                src={logoImage} 
                alt="Logotip" 
                className="page-title-logo hero-editable" 
                onClick={logoHandler.startEdit}
                title="Clica per canviar el logotip"
              />
            ) : (
              <div className="hero-accions logo-accions" style={{marginBottom: 20}}>
                <input type="file" accept="image/*" ref={logoHandler.fileInputRef} onChange={logoHandler.handleFileChange} className="sdp-ocult" style={{display: 'none'}} />
                <button type="button" className="pill hero-accions__inserir" onClick={() => logoHandler.fileInputRef.current?.click()}>
                  <ImageIcon size={16} /> Inserir Imatge (Logotip) o Multimèdia (600x600)
                </button>
                {logoImage && (
                  <div className="hero-accions__grup">
                    <button type="button" className="pill hero-accions__cancelar" onClick={logoHandler.cancelEdit}>
                      Tornar enrere
                    </button>
                    <button type="button" className="pill hero-accions__esborrar" onClick={logoHandler.handleDelete}>
                      Esborrar contingut
                    </button>
                  </div>
                )}
              </div>
            ),
            heroComponent: (heroImage && !heroHandler.isEditing) ? (
              <img 
                src={heroImage} 
                alt="Capçalera" 
                className="hero-editable" 
                onClick={heroHandler.startEdit}
                title="Clica per canviar la imatge"
              />
            ) : (
              <div className="hero-accions">
                <input type="file" accept="image/*" ref={heroHandler.fileInputRef} onChange={heroHandler.handleFileChange} className="sdp-ocult" style={{display: 'none'}} />
                <button type="button" className="pill hero-accions__inserir" onClick={() => heroHandler.fileInputRef.current?.click()}>
                  <ImageIcon size={16} /> Inserir Imatge o Multimèdia
                </button>
                {heroImage && (
                  <div className="hero-accions__grup">
                    <button type="button" className="pill hero-accions__cancelar" onClick={heroHandler.cancelEdit}>
                      Tornar enrere
                    </button>
                    <button type="button" className="pill hero-accions__esborrar" onClick={heroHandler.handleDelete}>
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
                    <button type="button" className={`btn-icon-orange sp-card-time ${isPublished ? 'published' : ''}`}>
                      {isPublished ? <Globe size={16} /> : <Lock size={16} />}
                    </button>
                  }
                >
                  <div className="dropdown-info-header">
                    <strong>{isPublished ? 'Exemple de Publicació' : 'Pàgina en Edició'}</strong>
                    <p>Aquesta targeta és una previsualització de com quedarà al Mur. Utilitza l'editor inferior per modificar el contingut.</p>
                  </div>
                </Dropdown>
                <DateTimeControl time={formattedTime} date={formattedDate} />
              </>
            )
          }}
          title={
            <span
              className="editor-title-input"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => onLocalChange?.('title', e.currentTarget.innerHTML)}
              onBlur={(e) => onSaveField?.('title', e.currentTarget.innerHTML)}
              data-placeholder="Escriu el títol de l'article (H1)..."
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(titleHtml) }}
              style={{ display: 'inline-block', minWidth: '10px' }}
            />
          }
          labels={labels}
          copyright={copyright}
          subtitle={
            <span
              className="editor-subtitle-input"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => onLocalChange?.('subtitle', e.currentTarget.innerHTML)}
              onBlur={(e) => onSaveField?.('subtitle', e.currentTarget.innerHTML)}
              data-placeholder="Escriu el subtítol (H2)..."
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(subtitleHtml) }}
              style={{ display: 'block', minWidth: '10px' }}
            />
          }
          lead={
            <span
              className="editor-lead-input"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => onLocalChange?.('lead', e.currentTarget.innerHTML)}
              onBlur={(e) => onSaveField?.('lead', e.currentTarget.innerHTML)}
              data-placeholder="Escriu l'entradilla..."
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(leadHtml) }}
              style={{ display: 'block', minWidth: '10px' }}
            />
          }
        >
          {children}
        </UniversalPage>
      </div>
    </section>
  );
}
