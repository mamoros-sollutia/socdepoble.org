import { useId } from 'react';
import { Languages, MessageCircle, Share2 } from 'lucide-react';

/*
 * Actius locals. Abans l'avatar per defecte i el logo fosc apuntaven a
 * https://socdepoble.org/... : cada targeta renderitzada obria una connexió
 * externa. En un iPad A10 sense cobertura no es pinta res, i a l'estri
 * empaquetat per a Sollutia és una dependència de xarxa que no havíem declarat.
 */
const AVATAR_PER_DEFECTE = '/assets/img/logo-socdepoble-cuadrat-verd.svg';
const LOGO_CLAR = '/assets/img/logo-socdepoble-rect-negre.svg';
const LOGO_FOSC = '/assets/img/logo-socdepoble-rect-blanc.svg';

export function UniversalPage({
  title,
  subtitle,
  lead,
  labels = [],
  copyright,
  showLogos = false,
  children,
  tone,
}) {
  return (
    <>
      <header className={tone ? `page-title is-${tone}` : 'page-title'}>
        {showLogos && (
          <>
            <img className="page-title-logo light-only" src={LOGO_CLAR} alt="Sóc de Poble" />
            <img className="page-title-logo dark-only" src={LOGO_FOSC} alt="Sóc de Poble" />
          </>
        )}

        {title && <h1>{title}</h1>}

        {labels.length > 0 && (
          <div className="sp-card-labels page-title-labels">
            {labels.map((l) => (
              <span key={l.text} className={`sp-card-label ${l.className || 'label-blue'}`}>
                {l.text}
              </span>
            ))}
          </div>
        )}

        {copyright && <p className="sp-card-copyright page-title-copyright">{copyright}</p>}
      </header>

      {subtitle && <h2>{subtitle}</h2>}
      {lead && <p className="lead">{lead}</p>}

      <article className="content-wrapper">{children}</article>
    </>
  );
}

export function IconButton({ label, children, onClick, className }) {
  return (
    <button
      type="button"
      className={className ? `sp-card-action ${className}` : 'sp-card-action'}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function UniversalButton({
  children,
  onClick,
  variant = 'primary',
  size,
  type = 'button',
  className,
  disabled = false,
  icon,
}) {
  // Abans: `btn ${variantClass} ${sizeClass} ${className}` escopia
  // class="btn btn-primary  " amb dos espais buits a cada botó del DOM.
  const classes = ['btn', variant && `btn-${variant}`, size && `btn-${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} type={type} onClick={onClick} disabled={disabled}>
      {icon && <span className="icon-btn" aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
}

/*
 * TARGETA MESTRA
 *
 * FANTASMES ELIMINATS
 *  · `import React` i `Pin`: cap dels dos s'usava.
 *  · Nou blocs style={{...}} inline que repetien el que ja diu el CSS
 *    (position:relative, isolation, display:flex, align-items, gap, z-index).
 *    L'únic estil inline que queda al sistema és el width de les barres de
 *    progrés a Cards.jsx, que sí que és una dada dinàmica.
 *  · `className="sp-card-meta sdp-gap-8"` + inline flex: tres capes dient
 *    exactament la mateixa cosa. .sp-card-meta ja porta display/align/gap.
 *  · El <span> estirat que simulava l'enllaç de tota la targeta. El comentari
 *    del codi deia "pseudo-element ::after" però era un <span> real al DOM.
 *    Ara és un ::after de veritat, definit al pegat CSS.
 *  · `sdp-p-0` damunt de l'avatar: .sp-card-avatar no té cap padding.
 *
 * ACCESSIBILITAT
 *  · Tres <button> sense type: dins d'un <form> feien submit. Ara tots type="button".
 *  · El botó d'ancorar només tenia title. Ara aria-label + title, i l'SVG
 *    marcat aria-hidden perquè no s'anuncie com a grafisme buit.
 *  · L'hora era un <button> que no feia res: focus mort al recorregut de teclat.
 *    Ara és un <span>. El pegat li lleva el cursor i l'efecte de premuda.
 *  · El subtítol era un <h2> davall d'un <h3>: inversió de jerarquia.
 *    Ara és un <p> amb la mateixa classe; el CSS no canvia gens.
 *  · alt="Avatar" no descrivia res i duplicava el nom que hi ha al costat.
 *    Ara alt="" (decoratiu). La imatge principal rep imageAlt de veritat,
 *    no una còpia del títol que el lector de pantalla llegia dos voltes.
 *  · <article aria-labelledby> perquè la targeta siga una regió navegable
 *    amb nom, no un contenidor anònim.
 *  · key={index} → key={l.text}. Reordenar etiquetes ja no confon el reconciliador.
 *
 * DADES INVENTADES ELIMINADES
 *  · time queia a '23:33' i '22/3/26' hardcodejats. Una targeta sense hora
 *    mostrava una hora falsa. Ara, sense `time`, no es pinta res.
 *  · mainHref='#' i authorHref='#targeta-perfil' feien que clicar una targeta
 *    de demostració saltara a un àncora inexistent. Ara, sense href ni onClick,
 *    el títol i l'autor són text mut: cap enllaç trencat al DOM.
 */
export function UniversalCard({
  title,
  headingLevel: HeadingTag = 'h3',
  subtitle,
  body,
  location = 'La Torre de les Maçanes',
  time,
  author = 'Sóc de Poble',
  authorHref,
  avatarUrl = AVATAR_PER_DEFECTE,
  imageUrl,
  imageAlt = '',
  price,
  labels = [],
  onClick,
  onPin,
  onTranslate,
  onComment,
  onShare,
  mainHref,
  copyright,
  calendarBadge = null,
  isAvis = false,
}) {
  const idTitol = useId();
  const [hora, data] = String(time || '').split(' ');
  const AutorTag = authorHref ? 'a' : 'div';
  const enllacable = Boolean(mainHref || onClick);

  const obri = (e) => {
    if (!onClick) return;
    e.preventDefault();
    onClick(e);
  };

  return (
    <article
      className={isAvis ? 'sp-card sp-card--avis' : 'sp-card'}
      aria-labelledby={title ? idTitol : undefined}
    >
      <header className="sp-card-header">
        <AutorTag className="sp-card-author-link" {...(authorHref ? { href: authorHref } : {})}>
          <div className="sp-card-author">
            <img className="sp-card-avatar" src={avatarUrl} alt="" />
            <div className="sp-card-author-info">
              <div className="sp-card-author-name">{author}</div>
              <div className="sp-card-author-location">{location}</div>
            </div>
          </div>
        </AutorTag>

        <div className="sp-card-meta">
          <button type="button" className="btn-icon-orange" aria-label="Ancorar" title="Ancorar" onClick={onPin}>
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M16 11V7a4 4 0 0 0-8 0v4l-2 4h12l-2-4z" />
              <path d="M12 15v7" />
            </svg>
          </button>

          {(hora || data) && (
            <span className="btn-date-time">
              {hora && <span>{hora}</span>}
              {data && <span>{data}</span>}
            </span>
          )}
        </div>
      </header>

      {imageUrl && (
        <div className="sp-card-media">
          <img src={imageUrl} alt={imageAlt} loading="lazy" decoding="async" />
        </div>
      )}

      <div className="sp-card-body">
        {calendarBadge && (
          <div className="sp-card-calendar-badge">
            <div className="sp-card-calendar-badge__dia">{calendarBadge.dia}</div>
            <div className="sp-card-calendar-badge__mes">{calendarBadge.mes}</div>
          </div>
        )}

        {price && <div className="sp-card-price">{price}</div>}

        {title && (
          <HeadingTag className="sp-card-title" id={idTitol}>
            {enllacable ? (
              <a className="sp-card-main-link" href={mainHref || '#'} onClick={obri}>
                {title}
              </a>
            ) : (
              title
            )}
          </HeadingTag>
        )}

        {subtitle && <p className="sp-card-subtitle">{subtitle}</p>}
        {body && <div className="sp-card-text">{body}</div>}

        {labels.length > 0 && (
          <div className="sp-card-labels">
            {labels.map((l) => (
              <span key={l.text} className={`sp-card-label ${l.className || 'label-blue'}`}>
                {l.text}
              </span>
            ))}
          </div>
        )}

        {copyright && <p className="sp-card-copyright sdp-mt-4">{copyright}</p>}
      </div>

      <footer className="sp-card-footer">
        <div className="sp-card-actions">
          {/* Fora size={24} i strokeWidth={2}: .sp-card-action .icon imposa
              30px i 2.5 des del CSS. Els props eren una mentida documental. */}
          <IconButton label="Traduir" onClick={onTranslate}>
            <Languages className="icon" aria-hidden="true" />
          </IconButton>
          <IconButton label="Comentar" onClick={onComment}>
            <MessageCircle className="icon" aria-hidden="true" />
          </IconButton>
          <IconButton label="Compartir" onClick={onShare}>
            <Share2 className="icon" aria-hidden="true" />
          </IconButton>
        </div>

        <button type="button" className="sp-card-connect" onClick={onClick}>
          Connectar
        </button>
      </footer>
    </article>
  );
}
