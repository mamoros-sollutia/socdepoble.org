import { resolveAsset } from '../../config/assetResolver';

import { useNavigate, Link } from '../../app/contexts/RouterContext';

import { useEffect, useState, useRef } from 'react';

import { showToast } from './AvisadorEfimer';

import { useContent } from './ContentProvider';

import {

  BackIcon, ForwardIcon, IndexIcon,
  CommentIcon, ShareIcon, PinIcon,
  IconButton, ActionControl, DateTimeControl
} from './UniversalElements';

import { isSafeUrl, isValidDate, DEFAULT_AUTHOR, PAGE_CHROME_MODES } from './UniversalUtils';





export function TableOfContentsDrawer({ isOpen, onClose }) {
  const [headings, setHeadings] = useState([]);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const rootNode = rootRef.current ? rootRef.current.getRootNode() : document;
    const domHeadings = rootNode.querySelectorAll('.page-title h1, .page-title h2, .content-wrapper h1, .content-wrapper h2, .content-wrapper h3, .content-wrapper h4, .sp-card-body h1, .sp-card-body h2, .sp-card-body h3, .sp-card-body h4');
    
    const parsedHeadings = Array.from(domHeadings).map((el, idx) => {
      // Ignoremos els visualment amagats
      if (el.classList.contains('sr-only') || el.textContent.trim() === '') return null;
      
      // Sense filtre de números per suportar targetes i pantalles sense numeració
      
      if (!el.id) {
        el.id = `toc-heading-${idx}`;
      }
      return {
        id: el.id,
        text: el.innerText || el.textContent,
        level: parseInt(el.tagName.substring(1), 10),
        element: el
      };
    }).filter(Boolean);

    setHeadings(parsedHeadings);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="toc-overlay" onClick={onClose} ref={rootRef}>
      <aside className="toc-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="toc-header">
          <h2>Taula de continguts</h2>
          <button className="toc-close-btn" onClick={onClose} aria-label="Tancar taula">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <nav className="toc-nav">
          {headings.length === 0 ? (
            <p className="toc-empty">No s'han trobat seccions.</p>
          ) : (
            <ul>
              {headings.map((h, idx) => (
                <li key={idx} className={`toc-item toc-level-${h.level}`}>
                  <button 
                    onClick={() => {
                      h.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      onClose();
                    }}
                  >
                    {h.text}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </aside>
    </div>
  );
}


export function UniversalPage(props) {
  const contentContext = useContent();
  const config = contentContext?.config || {};

  const title = props.title ?? config.title;
  const subtitle = props.subtitle ?? config.subtitle;
  const lead = props.lead ?? config.lead;
  const labels = props.labels ?? config.labels ?? [];
  const copyright = props.copyright ?? config.copyright;
  const showLogos = props.showLogos ?? config.showLogos ?? false;
  const tone = props.tone ?? config.tone;
  const variant = props.variant ?? config.variant;
  const chrome = props.chrome ?? config.chrome ?? 'page';
  const hideHeader = props.hideHeader ?? config.hideHeader ?? false;
  const showTopBars = props.showTopBars ?? config.showTopBars;
  const topBarData = props.topBarData ?? config.topBarData ?? {};
  const heroImage = props.heroImage ?? config.heroImage;
  const heroAlt = props.heroAlt ?? config.heroAlt ?? '';
  const authorName = props.authorName ?? config.authorName ?? DEFAULT_AUTHOR.name;
  const authorLocation = props.authorLocation ?? config.authorLocation ?? DEFAULT_AUTHOR.location;
  const authorAvatar = props.authorAvatar ?? config.authorAvatar ?? DEFAULT_AUTHOR.avatarUrl;
  const authorAvatarAlt = props.authorAvatarAlt ?? config.authorAvatarAlt ?? '';
  const time = props.time ?? config.time;
  const date = props.date ?? config.date;
  const dateTime = props.dateTime ?? config.dateTime;
  const onBack = props.onBack ?? config.onBack;
  const onForward = props.onForward ?? config.onForward;
  const onIndex = props.onIndex ?? config.onIndex;
  const onComment = props.onComment ?? config.onComment;
  const onShare = props.onShare ?? config.onShare;
  const onConnect = props.onConnect ?? config.onConnect;
  const onPin = props.onPin ?? config.onPin;
  const onDateTime = props.onDateTime ?? config.onDateTime;
  const connectLabel = props.connectLabel ?? config.connectLabel ?? 'Connectar';
  const price = props.price ?? config.price;
  const noPadding = props.noPadding ?? config.noPadding ?? false;
  const layout = props.layout ?? config.layout ?? 'page';
  const children = props.children;

  const [isTocOpen, setIsTocOpen] = useState(false);
  const navigate = useNavigate();
  
  const actualTitleText = props.titleText || config.titleText || (typeof title === 'string' ? title : '');
  const handleConnect = onConnect || (() => navigate('/connectar?item_id=' + encodeURIComponent(actualTitleText || 'page')));
  
  const handleBack = onBack || (() => navigate(-1));
  const handleForward = onForward || (() => navigate(1));
  const handleIndex = onIndex || (() => setIsTocOpen(true));

  const handleComment = onComment || (() => navigate('/xat'));
  const handleShare = onShare || (() => {
    const safeHref = isSafeUrl(window.location.href) ? window.location.href : window.location.origin;
    if (navigator.share) {
      navigator.share({ title: title || document.title, url: safeHref }).catch(console.error);
    } else {
      navigator.clipboard.writeText(safeHref);
      showToast('Enllaç copiat al porta-retalls');
    }
  });
  
  const barAuthorName = topBarData.authorName ?? authorName;
  const barAuthorLocation = topBarData.authorLocation ?? authorLocation;
  const barAuthorAvatar = topBarData.authorAvatar ?? authorAvatar;
  const barTime = topBarData.time ?? time;
  const barDate = topBarData.date ?? date;
  const barDateTime = topBarData.dateTime ?? dateTime;
  const barHeroImage = topBarData.heroImage ?? heroImage;
  const barHeroAlt = topBarData.heroAlt ?? heroAlt;

  const handleDateTime = onDateTime || ((e) => {
    e.preventDefault();
    e.stopPropagation();
    let yyyymmdd;
    if (barDateTime) {
      yyyymmdd = barDateTime.split('T')[0];
    } else if (barDate) {
      const parts = barDate.split('/');
      if (parts.length === 3) {
        let [dd, mm, yy] = parts;
        if (yy.length === 2) yy = '20' + yy;
        if (isValidDate(dd, mm, yy)) {
          yyyymmdd = `${yy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
        }
      } else {
        const d = new Date(barDate);
        if (!isNaN(d.getTime())) yyyymmdd = d.toISOString().split('T')[0];
      }
    }
    if (yyyymmdd) {
      navigate(`/mur?date=${encodeURIComponent(yyyymmdd)}`);
    } else {
      navigate('/mur');
    }
  });

  const requestedChrome = showTopBars ? 'full' : chrome;
  const resolvedChrome = PAGE_CHROME_MODES.has(requestedChrome) ? requestedChrome : 'page';
  const showBlueBar = resolvedChrome === 'full' || resolvedChrome === 'context' || resolvedChrome === 'system';
  const showOrangeBar = resolvedChrome === 'full' || resolvedChrome === 'context';
  const showPageHeader = resolvedChrome !== 'none' && !hideHeader;
  const hasHeader = Boolean(showPageHeader && (showLogos || title || labels.length || copyright));



  return (
    <>
      <div className={`sdp-universal-page-container sdp-universal-page-container--${layout}`}>
      {showBlueBar && (
          <header className={`bar-blue ${variant === 'embed' ? 'bar-blue--embed' : ''} ${resolvedChrome === 'context' ? 'bar-blue--top' : ''}`.trim()}>
            <div className="bar-blue-left">
              <IconButton label="Tornar arrere" onClick={handleBack} presentation>
                <BackIcon className="icon" />
              </IconButton>
              <IconButton label="Tornar endavant" onClick={handleForward} presentation>
                <ForwardIcon className="icon" />
              </IconButton>
              <IconButton label="Índex de secció" onClick={handleIndex} presentation>
                <IndexIcon className="icon" />
              </IconButton>
            </div>
            <div className="sp-card-actions">

              <IconButton
                label="Comentar (Xat Privat)"
                onClick={handleComment}
                presentation
              >
                <CommentIcon className="icon" />
              </IconButton>
              <IconButton label="Compartir" onClick={handleShare} presentation>
                <ShareIcon className="icon" />
              </IconButton>
            </div>
            <ActionControl
              className="btn-connectar sp-card-connect"
              label={connectLabel}
              onClick={handleConnect}
            >
              {connectLabel}
            </ActionControl>
          </header>
      )}

      {topBarData?.heroComponent ? (
        <div className="hero-image">
          {topBarData.heroComponent}
        </div>
      ) : barHeroImage ? (
        <div className="hero-image">
          <img alt={barHeroAlt} src={resolveAsset(barHeroImage)} />
        </div>
      ) : null}

      {showOrangeBar && (
        <section className={`bar-orange ${variant === 'embed' ? 'bar-orange--embed' : ''} ${resolvedChrome === 'context' ? 'bar-orange--top' : ''}`.trim()} aria-label="Autoria i data">
              <div className="sp-card-author">
                <img
                  className="sp-card-avatar"
                  src={resolveAsset(barAuthorAvatar)}
                  alt={authorAvatarAlt}
                  decoding="async"
                  width="48"
                  height="48"
                />
                <div className="sp-card-author-info">
                  <div className="sp-card-author-name">{barAuthorName}</div>
                  <div className="sp-card-author-location">{barAuthorLocation}</div>
                </div>
              </div>
              <div className="bar-actions">
                {topBarData?.barActions ? topBarData.barActions : (
                  <>
                    {topBarData?.showPin !== false && (
                      <ActionControl
                        className="btn-icon-orange"
                        label="Ancorar"
                        onClick={onPin}
                      >
                        <PinIcon className="icon" />
                      </ActionControl>
                    )}
                    <DateTimeControl
                      time={barTime}
                      date={barDate}
                      dateTime={barDateTime}
                      onClick={handleDateTime}
                    />
                  </>
                )}
              </div>
            </section>
          )}

      {hasHeader && (
        <header
          className={['page-title', tone && `is-${tone}`].filter(Boolean).join(' ')}
        >
          {topBarData?.logoComponent ? (
            <div className="page-title">
              {topBarData.logoComponent}
            </div>
          ) : (showLogos || chrome === 'system') ? (
            <>
              <img
                alt="Logotip Sóc de Poble"
                className="page-title-logo light-only"
                src={resolveAsset("/assets/system/ui/logo-socdepoble-rect-negre.svg")}
              />
              <img
                alt="Logotip Sóc de Poble"
                className="page-title-logo dark-only"
                src={resolveAsset("/assets/system/ui/logo-socdepoble-rect-blanc.svg")}
              />
            </>
          ) : null}
          {title && (
            <h1>
              {title}
              {price && <span className="sp-card-price sp-card-price--en-linia">{price}</span>}
            </h1>
          )}
          {labels.length > 0 && (
            <ul className="sp-card-labels page-title-labels" aria-label="Categories">
              {labels.map((label, index) => {
                const text = typeof label === 'string' ? label : label.text;
                const className = typeof label === 'string' ? 'sdp-badge-tag' : label.className || 'sdp-badge-tag';
                const href = typeof label === 'string' ? null : label.href;
                const safeHref = href && isSafeUrl(href) ? href : null;
                return (
                  <li
                    key={`${text}-${index}`}
                    className={['sp-card-label', className].filter(Boolean).join(' ')}
                  >
                    {label.onClick ? (
                      <button type="button" className="sp-card-label__action" onClick={label.onClick}>
                        {text}
                      </button>
                    ) : safeHref ? (
                      safeHref.startsWith('http') ? (
                        <a href={safeHref} target="_blank" rel="noopener noreferrer" className="sp-card-label">{text}</a>
                      ) : (
                        <Link to={safeHref} className="sp-card-label">{text}</Link>
                      )
                    ) : (
                      text
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {copyright && (
            <p className="sp-card-copyright page-title-copyright">{copyright}</p>
          )}
        </header>
      )}

      <article className={`content-wrapper${noPadding ? ' content-wrapper--sense-marge' : ''}`}>
        {(subtitle || lead) && (
          <div className="page-intro">
            {subtitle && <h2>{subtitle}</h2>}
            {lead && <p className="lead">{lead}</p>}
          </div>
        )}
        {children}
      </article>
      </div>

      <TableOfContentsDrawer isOpen={isTocOpen} onClose={() => setIsTocOpen(false)} />
    </>
  );}
