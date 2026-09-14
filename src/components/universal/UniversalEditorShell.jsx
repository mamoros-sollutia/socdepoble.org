import { Image as ImageIcon, Lock, Globe } from 'lucide-react';
import { Dropdown } from '../ui/Dropdown';
import { DateTimeControl } from '../ui/controls';
import { sanitizeHtml } from '../../utils/sanitize.js';
import useHeroImageHandler from '../../hooks/useHeroImageHandler.js';
import React, { Component, useRef, useCallback, useEffect } from 'react';
import { useContent } from './ContentProvider.jsx';

// Error Boundary per protegir l'editor i evitar tombar la pàgina hoste
class EditorErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("EditorErrorBoundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="sdp-estat sdp-estat--error">
          <div className="sdp-estat__contenidor">
            <h3 className="sdp-estat__titol">L'editor ha fallat</h3>
            <p className="sdp-estat__descripcio">S'ha produït un error inesperat dins del motor d'edició. Torna a carregar la pàgina per a continuar.</p>
          </div>
        </div>
      );
    }
    return this.props.children; 
  }
}

export function EditableField({ as: Component = 'span', html, placeholder, onChange, onBlur, className, ...props }) {
  if (html === null) return null;
  return (
    <Component
      className={className}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => onChange?.(sanitizeHtml(e.currentTarget.innerHTML))}
      onBlur={(e) => onBlur?.(sanitizeHtml(e.currentTarget.innerHTML))}
      data-placeholder={placeholder}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html || '') }}
      {...props}
    />
  );
}

export function UniversalEditorShell({
  id,
  titleHtml,
  subtitleHtml,
  leadHtml,
  onSaveField,
  onLocalChange,
  heroImage,
  logoImage,
  topBar,
  children,
  labels,
  isPublished = false,
  onImageUpload = null,
  formattedTime,
  formattedDate,
  showStatusToggle = true,
  previewTitle = "Previsualitzar / Tancar",
  previewHelp = "No oblides desar els canvis.",
  onToast = (msg, type) => console.log(`[Toast ${type}] ${msg}`)
}) {
  const debounceTimeouts = useRef({});
  const onSaveFieldRef = useRef(onSaveField);
  const onLocalChangeRef = useRef(onLocalChange);

  onSaveFieldRef.current = onSaveField;
  onLocalChangeRef.current = onLocalChange;

  const flushField = useCallback((field) => {
    const pending = debounceTimeouts.current[field];
    if (!pending) return;

    clearTimeout(pending.timeoutId);
    delete debounceTimeouts.current[field];
    onSaveFieldRef.current?.(field, pending.value, pending.id);
  }, []);

  const handleFieldChange = useCallback((field, value) => {
    onLocalChangeRef.current?.(field, value, id);

    const previous = debounceTimeouts.current[field];
    if (previous) {
      clearTimeout(previous.timeoutId);
    }
    const timeoutId = setTimeout(() => flushField(field), 800);
    debounceTimeouts.current[field] = { timeoutId, value, id };
  }, [flushField, id]);

  const handleFieldBlur = useCallback((field, value) => {
    const pending = debounceTimeouts.current[field];
    if (pending) {
      pending.value = value;
      flushField(field);
      return;
    }
    onSaveFieldRef.current?.(field, value, id);
  }, [flushField, id]);

  useEffect(() => () => {
    Object.keys(debounceTimeouts.current).forEach(flushField);
  }, [id, flushField]);

  useEffect(() => {
    const flushAllFields = () => {
      Object.keys(debounceTimeouts.current).forEach(flushField);
    };
    const flushWhenHidden = () => {
      if (document.visibilityState === 'hidden') flushAllFields();
    };

    window.addEventListener('pagehide', flushAllFields);
    document.addEventListener('visibilitychange', flushWhenHidden);
    return () => {
      window.removeEventListener('pagehide', flushAllFields);
      document.removeEventListener('visibilitychange', flushWhenHidden);
    };
  }, [flushField]);

  const shellData = useEditorShell({
    onSaveField: (field, value) => onSaveFieldRef.current?.(field, value, id),
    onImageUpload,
    heroImage,
    logoImage,
    isPublished,
    formattedTime,
    formattedDate,
    showStatusToggle,
    previewTitle,
    previewHelp,
    onToast
  });

  const contentContext = useContent();
  const config = contentContext?.config || {};
  const barAuthorAvatar = config.barAuthorAvatar || '/assets/system/ui/default-avatar.jpg';
  const barAuthorName = config.barAuthorName || 'Foraster';
  const barAuthorLocation = config.barAuthorLocation || 'Identitat Lliure';

  return (
    <EditorErrorBoundary>
      {topBar}
      
      {/* Imatge Capçalera (Hero Image) */}
      {shellData.topBarData.heroComponent && (
        <div className="hero-image" style={{ margin: 0, width: '100%', flexShrink: 0 }}>
          {shellData.topBarData.heroComponent}
        </div>
      )}

      {/* Barra Taronja */}
      <section className="bar-orange" aria-label="Autoria i data" style={{ margin: 0, borderRadius: 0, background: 'var(--sdp-marca)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
        <div className="sp-card-author" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img className="sp-card-avatar" src={barAuthorAvatar} alt={barAuthorName} width="48" height="48" style={{ borderRadius: '4px' }} />
          <div className="sp-card-author-info">
            <div className="sp-card-author-name" style={{ fontWeight: 'bold' }}>{barAuthorName}</div>
            <div className="sp-card-author-location" style={{ fontSize: '0.9rem', opacity: 0.9 }}>{barAuthorLocation}</div>
          </div>
        </div>
        <div className="bar-actions" style={{ opacity: 0.9, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {shellData.topBarData.barActions}
        </div>
      </section>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <article className="card universal-page" style={{ margin: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          <header className="page-title" style={{ margin: '0 0 24px 0', borderBottom: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
              {shellData.topBarData.logoComponent}
            </div>

            <EditableField 
              as="h1"
              key={`${id}-title`} 
              className="editor-title-input" 
              html={titleHtml} 
              placeholder="Escriu el títol de l'article (H1)..." 
              onChange={(val) => handleFieldChange('title', val)} 
              onBlur={(val) => handleFieldBlur('title', val)} 
              style={{ outline: 'none', cursor: 'text', color: 'var(--sdp-accio-text)', fontSize: '3rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px', lineHeight: '1.2' }}
            />

            {labels && labels.length > 0 && (
              <ul className="sp-card-labels page-title-labels" style={{ marginTop: '24px', marginBottom: '16px', justifyContent: 'center', display: 'flex', gap: '8px', listStyle: 'none', padding: 0, flexWrap: 'wrap' }}>
                {labels.map((label, idx) => {
                  const text = typeof label === 'string' ? label : label.text;
                  const customClass = typeof label === 'string' ? '' : (label.className || '');
                  const onClick = typeof label === 'string' ? undefined : label.onClick;
                  return (
                    <li key={idx} className={`sp-card-label ${customClass}`.trim()} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', border: '1px solid var(--sdp-vora)', padding: '4px 16px', borderRadius: '20px', fontSize: '0.85rem' }}>
                      {text}
                    </li>
                  );
                })}
              </ul>
            )}

            <p className="sp-card-copyright page-title-copyright" style={{ textAlign: 'center', color: 'var(--sdp-text-secundari)', fontSize: '0.85rem', margin: '16px 0 32px 0' }}>
              © Sóc de Poble / Fet per la IAIA i Nano Banana
            </p>
          </header>

          <div className="page-intro" style={{ marginBottom: '32px' }}>
            <EditableField 
              as="h2"
              key={`${id}-subtitle`} 
              className="editor-subtitle-input" 
              html={subtitleHtml} 
              placeholder="Escriu el subtítol (H2)..." 
              onChange={(val) => handleFieldChange('subtitle', val)} 
              onBlur={(val) => handleFieldBlur('subtitle', val)} 
              style={{ outline: 'none', cursor: 'text', fontSize: '1.8rem', fontWeight: '600', color: 'var(--sdp-marca)', textAlign: 'center', marginBottom: '24px', lineHeight: '1.3' }}
            />

            <EditableField 
              as="p"
              key={`${id}-lead`} 
              className="editor-lead-input" 
              html={leadHtml} 
              placeholder="Escriu l'entradilla..." 
              onChange={(val) => handleFieldChange('lead', val)} 
              onBlur={(val) => handleFieldBlur('lead', val)} 
              style={{ outline: 'none', cursor: 'text', fontSize: '1.15rem', lineHeight: '1.6', color: 'var(--sdp-text-base)', marginBottom: '24px', textAlign: 'center' }}
            />
          </div>
          
          <div className="editor-content page-content ues-canvas" style={{ outline: 'none', flex: 1, fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--sdp-text-base)', padding: 0 }}>
            {children}
          </div>
        </article>
      </div>
    </EditorErrorBoundary>
  );
}

export function useEditorShell({ 
  onSaveField, 
  onImageUpload = null,
  heroImage, 
  logoImage, 
  isPublished, 
  formattedTime, 
  formattedDate,
  showStatusToggle = true,
  previewTitle = "Exemple de Publicació",
  previewHelp = "Aquesta targeta és una previsualització de com quedarà al Mur. Utilitza l'editor inferior per modificar el contingut.",
  onToast = console.log
}) {
  const heroHandler = useHeroImageHandler({ 
    onSaveField, 
    fieldName: 'heroImage',
    onImageUpload,
    onError: (msg) => onToast(msg, 'error'),
    onConfirmDelete: () => {
      onToast("Imatge esborrada", "success");
      return true;
    }
  });
  
  const logoHandler = useHeroImageHandler({ 
    onSaveField, 
    fieldName: 'logoImage',
    onImageUpload,
    onError: (msg) => onToast(msg, 'error'),
    onConfirmDelete: () => {
      onToast("Logotip esborrat", "success");
      return true;
    }
  });

  return {
    heroImage,
    logoImage,
    isPublished,
    formattedTime,
    formattedDate,
    topBarData: {
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
            <ImageIcon size={16} /> Inserir Logotip
          </button>
          {logoImage && (
            <div className="sdp-alerta__accions">
              <button type="button" className="sdp-boto sdp-boto--fantasma" onClick={logoHandler.cancelEdit}>Enrere</button>
              <button type="button" className="sdp-boto sdp-boto--perill" onClick={logoHandler.handleDelete}>Esborrar</button>
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
            <ImageIcon size={16} /> Inserir Capçalera
          </button>
          {heroImage && (
            <div className="sdp-alerta__accions">
              <button type="button" className="sdp-boto sdp-boto--fantasma" onClick={heroHandler.cancelEdit}>Enrere</button>
              <button type="button" className="sdp-boto sdp-boto--perill" onClick={heroHandler.handleDelete}>Esborrar</button>
            </div>
          )}
        </div>
      ),
      barActions: (
        <>
          {showStatusToggle && (
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
                <strong className="sdp-alerta__titol">{isPublished ? previewTitle : 'Pàgina en Edició'}</strong>
                <p className="sdp-camp__ajuda">{previewHelp}</p>
              </div>
            </Dropdown>
          )}
          <DateTimeControl time={formattedTime} date={formattedDate} />
        </>
      )
    }
  };
}

export default UniversalEditorShell;
