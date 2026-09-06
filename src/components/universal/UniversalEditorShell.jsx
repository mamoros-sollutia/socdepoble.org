import { useRef, useState } from 'react';
import { Image as ImageIcon, Lock, Globe } from 'lucide-react';
import { DateTimeControl, Dropdown, UniversalPage } from './UniversalComponents';
import { sanitizeHtml } from '../../utils/sanitize.js';

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
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const LIMIT_HERO = 512 * 1024;

  const triaImatge = (e) => {
    const fitxer = e.target.files?.[0];
    e.target.value = '';
    if (!fitxer) return;
    if (!fitxer.type.startsWith('image/')) return alert('Només imatges, de moment.');
    if (fitxer.size > LIMIT_HERO) return alert('La imatge passa de 512 KB. Redueix-la abans.');
    const lector = new FileReader();
    lector.onload = () => { 
      onSaveField?.('heroImage', String(lector.result)); 
      setIsEditingImage(false); 
    };
    lector.onerror = () => alert("No s'ha pogut llegir el fitxer.");
    lector.readAsDataURL(fitxer);
  };

  const triaLogo = (e) => {
    const fitxer = e.target.files?.[0];
    e.target.value = '';
    if (!fitxer) return;
    if (!fitxer.type.startsWith('image/')) return alert('Només imatges, de moment.');
    if (fitxer.size > LIMIT_HERO) return alert('La imatge passa de 512 KB. Redueix-la abans.');
    const lector = new FileReader();
    lector.onload = () => { 
      onSaveField?.('logoImage', String(lector.result)); 
      setIsEditingLogo(false); 
    };
    lector.onerror = () => alert("No s'ha pogut llegir el fitxer.");
    lector.readAsDataURL(fitxer);
  };

  const handleDeleteHero = () => {
    if (!window.confirm('Esborrar definitivament la imatge de capçalera?')) return;
    onSaveField?.('heroImage', ''); 
    setIsEditingImage(false);
  };

  const handleDeleteLogo = () => {
    if (!window.confirm('Esborrar definitivament el logotip?')) return;
    onSaveField?.('logoImage', ''); 
    setIsEditingLogo(false);
  };

  return (
    <section className={`notes-column notes-column--editor ${className}`}>
      {topBar}
      <div className="editor-scroll-area">
        <UniversalPage 
          titleText={titleText}
          chrome="context" 
          variant="embed"
          showLogos={!heroImage}
          topBarData={{
            logoComponent: (logoImage && !isEditingLogo) ? (
              <img 
                src={logoImage} 
                alt="Logotip" 
                className="page-title-logo hero-editable" 
                onClick={() => setIsEditingLogo(true)}
                title="Clica per canviar el logotip"
              />
            ) : (
              <div className="hero-accions logo-accions" style={{marginBottom: 20}}>
                <input type="file" accept="image/*" ref={logoInputRef} onChange={triaLogo} className="sdp-ocult" style={{display: 'none'}} />
                <button type="button" className="pill hero-accions__inserir" onClick={() => logoInputRef.current?.click()}>
                  <ImageIcon size={16} /> Inserir Imatge (Logotip) o Multimèdia (600x600)
                </button>
                {logoImage && (
                  <div className="hero-accions__grup">
                    <button type="button" className="pill hero-accions__cancelar" onClick={() => setIsEditingLogo(false)}>
                      Tornar enrere
                    </button>
                    <button type="button" className="pill hero-accions__esborrar" onClick={handleDeleteLogo}>
                      Esborrar contingut
                    </button>
                  </div>
                )}
              </div>
            ),
            heroComponent: (heroImage && !isEditingImage) ? (
              <img 
                src={heroImage} 
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
                {heroImage && (
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
