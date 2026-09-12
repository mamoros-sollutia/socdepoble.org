import { Image as ImageIcon, Lock, Globe } from 'lucide-react';
import { UniversalPage } from './UniversalPage';
import { DateTimeControl, Dropdown } from './UniversalElements';
import { sanitizeHtml } from '../../utils/sanitize.js';
import useHeroImageHandler from '../../hooks/useHeroImageHandler.js';

export default function UniversalEditorShell({
  children,
  className = '',
  topBar,
  titleText = 'Sense Títol',
  heroImage,
  logoImage,
  authorName,
  authorLocation,
  authorAvatar,
  isPublished,
  formattedTime,
  formattedDate,
  titleHtml = '',
  subtitleHtml = '',
  leadHtml = '',
  onSaveField,
  onLocalChange,
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
          authorName={authorName}
          authorLocation={authorLocation}
          authorAvatar={authorAvatar}
          topBarData={{
            logoComponent: (logoImage && !logoHandler.isEditing) ? (
              <img 
                src={logoImage} 
                alt="Logotip" 
                className="page-title-logo hero-image" 
                onClick={logoHandler.startEdit}
                title="Clica per canviar el logotip"
              />
            ) : (
              <div className="sdp-alerta__accions sdp-camp">
                <input type="file" accept="image/*" ref={logoHandler.fileInputRef} onChange={logoHandler.handleFileChange} className="sdp-nomes-lector" />
                <button type="button" className="sdp-boto sdp-boto--secundari" onClick={() => logoHandler.fileInputRef.current?.click()}>
                  <ImageIcon size={16} /> Inserir Imatge (Logotip) o Multimèdia (600x600)
                </button>
                {logoImage && (
                  <div className="sdp-alerta__accions">
                    <button type="button" className="sdp-boto sdp-boto--fantasma" onClick={logoHandler.cancelEdit}>
                      Tornar enrere
                    </button>
                    <button type="button" className="sdp-boto sdp-boto--perill" onClick={logoHandler.handleDelete}>
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
                className="hero-image" 
                onClick={heroHandler.startEdit}
                title="Clica per canviar la imatge"
              />
            ) : (
              <div className="sdp-alerta__accions sdp-camp">
                <input type="file" accept="image/*" ref={heroHandler.fileInputRef} onChange={heroHandler.handleFileChange} className="sdp-nomes-lector" />
                <button type="button" className="sdp-boto sdp-boto--secundari" onClick={() => heroHandler.fileInputRef.current?.click()}>
                  <ImageIcon size={16} /> Inserir Imatge o Multimèdia
                </button>
                {heroImage && (
                  <div className="sdp-alerta__accions">
                    <button type="button" className="sdp-boto sdp-boto--fantasma" onClick={heroHandler.cancelEdit}>
                      Tornar enrere
                    </button>
                    <button type="button" className="sdp-boto sdp-boto--perill" onClick={heroHandler.handleDelete}>
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
                    <button type="button" className={`btn-icon-orange ${isPublished ? 'published' : ''}`}>
                      {isPublished ? <Globe size={16} /> : <Lock size={16} />}
                    </button>
                  }
                >
                  <div className="sdp-camp">
                    <strong className="sdp-alerta__titol">{isPublished ? 'Exemple de Publicació' : 'Pàgina en Edició'}</strong>
                    <p className="sdp-camp__ajuda">Aquesta targeta és una previsualització de com quedarà al Mur. Utilitza l'editor inferior per modificar el contingut.</p>
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
            />
          }
        >
          {children}
        </UniversalPage>
      </div>
    </section>
  );
}
