import { Image as ImageIcon, Lock, Globe } from 'lucide-react';
import { DateTimeControl, Dropdown } from './UniversalElements';
import { sanitizeHtml } from '../../utils/sanitize.js';
import useHeroImageHandler from '../../hooks/useHeroImageHandler.js';
import React, { Component, useRef, useCallback, useEffect } from 'react';
import { PageFrame } from './PageFrame';

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

export function EditableField({ html, placeholder, onChange, onBlur, className }) {
  if (html === null) return null;
  return (
    <span
      className={className}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => onChange?.(sanitizeHtml(e.currentTarget.innerHTML))}
      onBlur={(e) => onBlur?.(sanitizeHtml(e.currentTarget.innerHTML))}
      data-placeholder={placeholder}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html || '') }}
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
  isPublished = false,
  formattedTime,
  formattedDate,
  labels = [],
  copyright,
  showStatusToggle = true,
  previewTitle = "Previsualitzar / Tancar",
  previewHelp = "No oblides desar els canvis.",
  className = ''
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
    heroImage,
    logoImage,
    isPublished,
    formattedTime,
    formattedDate,
    showStatusToggle,
    previewTitle,
    previewHelp
  });

  return (
    <EditorErrorBoundary>
      <section className={`editor-shell--main ${className}`}>
        {topBar}
        <div className="editor-scroll-area">
          <PageFrame
            className="editor-page-frame"
            contentClassName="editor-page-frame__content"
            chrome="context"
            variant="embed"
            title={
              <EditableField 
                key={`${id}-title`} 
                className="title-editor" 
                html={titleHtml} 
                placeholder="Títol..." 
                onChange={(val) => handleFieldChange('title', val)} 
                onBlur={(val) => handleFieldBlur('title', val)} 
              />
            }
            subtitle={
              <EditableField 
                key={`${id}-subtitle`} 
                className="subtitle-editor" 
                html={subtitleHtml} 
                placeholder="Subtítol opcional..." 
                onChange={(val) => handleFieldChange('subtitle', val)} 
                onBlur={(val) => handleFieldBlur('subtitle', val)} 
              />
            }
            lead={
              <EditableField 
                key={`${id}-lead`} 
                className="lead-editor" 
                html={leadHtml} 
                placeholder="Entradilla opcional..." 
                onChange={(val) => handleFieldChange('lead', val)} 
                onBlur={(val) => handleFieldBlur('lead', val)} 
              />
            }
            labels={labels}
            copyright={copyright}
            topBarData={shellData.topBarData}
          >
            {children}
          </PageFrame>
        </div>
      </section>
    </EditorErrorBoundary>
  );
}

import { showToast } from './AvisadorEfimer';

export function useEditorShell({ 
  onSaveField, 
  heroImage, 
  logoImage, 
  isPublished, 
  formattedTime, 
  formattedDate,
  showStatusToggle = true,
  previewTitle = "Exemple de Publicació",
  previewHelp = "Aquesta targeta és una previsualització de com quedarà al Mur. Utilitza l'editor inferior per modificar el contingut."
}) {
  const heroHandler = useHeroImageHandler({ 
    onSaveField, 
    fieldName: 'heroImage',
    onError: (msg) => showToast(msg, 'error'),
    onConfirmDelete: () => {
      showToast("Imatge esborrada", "success");
      return true;
    }
  });
  
  const logoHandler = useHeroImageHandler({ 
    onSaveField, 
    fieldName: 'logoImage',
    onError: (msg) => showToast(msg, 'error'),
    onConfirmDelete: () => {
      showToast("Logotip esborrat", "success");
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
