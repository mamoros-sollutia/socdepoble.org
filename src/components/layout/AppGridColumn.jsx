import { ChevronDown, ChevronRight, PanelLeftClose, PanelRightOpen } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   AppGridColumn — capçalera única de columna per a tot Sóc de Poble

   Substituïx les QUATRE implementacions que hi havia escampades:
     notes-column-header, --collapsed, --accordion, perfil-columna-capcalera

   Contracte: esta capçalera NO sap què és una carpeta, una nota, una
   etiqueta ni una organització. Rep `accions` i les pinta. Qui sap del
   domini és la columna que la crida. Si un dia el botó "+" ha de crear
   una empresa en compte d'una carpeta, ací no es toca res.

   Ordre visual imposat pel Mestre:
     [ plec ] TÍTOL … [ + ] [ replegar columna ]
   ═══════════════════════════════════════════════════════════════════ */

export default function AppGridColumn({
  titol,
  icona: Icona = null,
  accions = [],          // [{ id, icona, etiqueta, onAcciona, desactivat }]
  plegable = false,      // mostra el chevron d'acordió
  obert = true,
  onPlega = null,        // () => void — acordió
  onReplega = null,      // () => void — replegar tota la columna (escriptori)
  variant = null,        // null | 'accordion' | 'collapsed'
  children
}) {
  const esAcordio = variant === 'accordion';
  const Chevron = obert ? ChevronDown : ChevronRight;

  const actionButtons = accions.map((a) => (
    <button
      key={a.id}
      type="button"
      className="app-grid-col-header__accio"
      onClick={() => a.onAcciona?.()}
      disabled={a.desactivat || typeof a.onAcciona !== 'function'}
      aria-label={a.etiqueta}
      title={a.etiqueta}
    >
      <a.icona size={18} aria-hidden focusable="false" />
    </button>
  ));

  if (variant === 'collapsed') {
    const CollapsedIcon = Icona || PanelRightOpen;
    return (
      <div className="app-grid-col-header app-grid-col-header--collapsed">
        <button
          type="button"
          className="btn-icon hover-bg"
          onClick={onReplega}
          aria-label={`Expandir ${titol}`}
          title={`Expandir ${titol}`}
        >
          <CollapsedIcon size={20} aria-hidden focusable="false" />
        </button>
        {actionButtons}
      </div>
    );
  }

  return (
    <div className={`app-grid-col-header${esAcordio ? ' app-grid-col-header--accordion' : ''}`}>
      {/* Era un <div onClick> sense role ni tabIndex: inaccessible per teclat.
          Ara és un botó de veres, amb estat exposat. */}
      {plegable ? (
        <button
          type="button"
          className="app-grid-col-header__plec"
          onClick={onPlega}
          aria-expanded={obert}
          title={`Plegar o desplegar ${titol}`}
        >
          <Chevron size={20} aria-hidden focusable="false" />
          {Icona ? <Icona size={20} aria-hidden focusable="false" /> : null}
          <span className="app-grid-col-header__titol">{titol}</span>
        </button>
      ) : (
        <div className="app-grid-col-header__plec app-grid-col-header__plec--fix">
          {Icona ? <Icona size={20} aria-hidden focusable="false" /> : null}
          <span className="app-grid-col-header__titol">{titol}</span>
        </div>
      )}

      <div className="app-grid-col-header__accions">
        {/* Sense arguments a posta: l'event del DOM no és càrrega del domini. */}
        {actionButtons}

        {onReplega ? (
          <button
            type="button"
            className="btn-icon btn-icon--transparent d-desktop-only"
            onClick={onReplega}
            aria-label={`Replegar ${titol}`}
            title={`Replegar ${titol}`}
          >
            <PanelLeftClose size={18} aria-hidden focusable="false" />
          </button>
        ) : null}

        {children}
      </div>
    </div>
  );
}
