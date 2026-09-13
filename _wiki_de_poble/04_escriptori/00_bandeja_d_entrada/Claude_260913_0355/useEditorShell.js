import { Image as ImageIcon, Lock, Globe } from 'lucide-react';
import { Dropdown, DateTimeControl } from '../UniversalElements';
import useHeroImageHandler from '../../../hooks/useHeroImageHandler.js';

/**
 * useEditorShell — compon les dues barres superiors (logotip, capçalera,
 * estat de publicació, data) que la closca passa a PageFrame.
 *
 * CANVIS RESPECTE DE LA VERSIÓ ANTERIOR
 *  · `isPublished`, `formattedTime` i `formattedDate` ja NO estan cablats
 *    ("12:00", "01/01/2026", publicat=true). Els posa qui té les dades.
 *  · Els avisos entren per `onNotify`. Abans es cridava `showToast`, que
 *    busca `document.querySelector('soc-de-poble')` al document GLOBAL:
 *    dins d'un host que no siga Sóc de Poble, això és una fuita fora de
 *    l'arbre del component (i fora de l'ombra, o siga, sense estils).
 */
export function useEditorShell({
  onSaveField,
  heroImage,
  logoImage,
  isPublished = false,
  formattedTime,
  formattedDate,
  dateTime,
  showStatusToggle = true,
  previewTitle = 'Exemple de publicació',
  previewHelp = 'Així es veurà al Mur. Els canvis es desen sols.',
  onNotify
}) {
  const avisa = (missatge, mena) => onNotify?.(missatge, mena);

  const heroHandler = useHeroImageHandler({
    onSaveField,
    fieldName: 'heroImage',
    onError: (msg) => avisa(msg, 'error'),
    onConfirmDelete: () => {
      avisa('Capçalera esborrada', 'success');
      return true;
    }
  });

  const logoHandler = useHeroImageHandler({
    onSaveField,
    fieldName: 'logoImage',
    onError: (msg) => avisa(msg, 'error'),
    onConfirmDelete: () => {
      avisa('Logotip esborrat', 'success');
      return true;
    }
  });

  const selectorImatge = (handler, valor, etiqueta) => (
    <div className="sdp-alerta__accions sdp-camp">
      <input
        type="file"
        accept="image/*"
        ref={handler.fileInputRef}
        onChange={handler.handleFileChange}
        className="sdp-nomes-lector"
      />
      <button
        type="button"
        className="sdp-boto sdp-boto--secundari"
        onClick={() => handler.fileInputRef.current?.click()}
      >
        <ImageIcon size={16} aria-hidden focusable="false" /> {etiqueta}
      </button>
      {valor && (
        <div className="sdp-alerta__accions">
          <button type="button" className="sdp-boto sdp-boto--fantasma" onClick={handler.cancelEdit}>
            Enrere
          </button>
          <button type="button" className="sdp-boto sdp-boto--perill" onClick={handler.handleDelete}>
            Esborrar
          </button>
        </div>
      )}
    </div>
  );

  return {
    topBarData: {
      logoComponent: (logoImage && !logoHandler.isEditing) ? (
        <img
          src={logoImage}
          alt="Logotip"
          className="page-title-logo hero-image"
          onClick={logoHandler.startEdit}
          title="Clica per a canviar el logotip"
        />
      ) : selectorImatge(logoHandler, logoImage, 'Inserir logotip'),

      heroComponent: (heroImage && !heroHandler.isEditing) ? (
        <img
          src={heroImage}
          alt="Capçalera"
          className="hero-image"
          onClick={heroHandler.startEdit}
          title="Clica per a canviar la imatge"
        />
      ) : selectorImatge(heroHandler, heroImage, 'Inserir capçalera'),

      time: formattedTime,
      date: formattedDate,
      dateTime,

      barActions: (
        <>
          {showStatusToggle && (
            <Dropdown
              right
              minWidth="320px"
              trigger={
                <button
                  type="button"
                  className={`btn-icon-orange ${isPublished ? 'published' : ''}`}
                  aria-label={isPublished ? 'Publicada' : 'En edició'}
                >
                  {isPublished
                    ? <Globe size={16} aria-hidden focusable="false" />
                    : <Lock size={16} aria-hidden focusable="false" />}
                </button>
              }
            >
              <div className="sdp-camp">
                <strong className="sdp-alerta__titol">
                  {isPublished ? previewTitle : 'Pàgina en edició'}
                </strong>
                <p className="sdp-camp__ajuda">{previewHelp}</p>
              </div>
            </Dropdown>
          )}
          <DateTimeControl time={formattedTime} date={formattedDate} dateTime={dateTime} />
        </>
      )
    }
  };
}

export default useEditorShell;
