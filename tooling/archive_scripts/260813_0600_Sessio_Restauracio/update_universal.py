import os

base_dir = "/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org"
universal_path = os.path.join(base_dir, "src/components/universal/UniversalComponents.jsx")

content = """import React from 'react';
import { Languages, MessageCircle, Share2, Pin } from 'lucide-react';

export function UniversalPage({ title, subtitle, lead, labels, copyright, showLogos, children, tone }) {
  return (
    <>
      <header className={`page-title${tone ? ` is-${tone}` : ''}`}>
        {showLogos && (
          <>
            <img alt="Logotip Sóc de Poble" className="page-title-logo light-only" src="/assets/img/logo-socdepoble-rect-negre.svg" />
            <img alt="Logotip Sóc de Poble" className="page-title-logo dark-only" src="/assets/system/ui/logo-socdepoble-rect-blanc.svg" />
          </>
        )}
        {title && <h1>{title}</h1>}
        
        {labels && labels.length > 0 && (
          <div className="sp-card-labels page-title-labels">
            {labels.map((label, idx) => (
              <span key={idx} className={`sp-card-label ${label.className || 'label-blue'}`}>
                {label.text}
              </span>
            ))}
          </div>
        )}
        {copyright && <div className="sp-card-copyright page-title-copyright">{copyright}</div>}
      </header>
      
      {subtitle && <h2>{subtitle}</h2>}
      {lead && <p className="lead">{lead}</p>}

      <article className="content-wrapper">
        {children}
      </article>
    </>
  );
}

export function IconButton({ label, children, onClick, className = '' }) {
  return (
    <button 
      className={`sp-card-action ${className}`} 
      type="button" 
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
  variant = "primary",
  size = "",
  type = "button",
  className = "",
  disabled = false,
  icon = null
}) {
  const sizeClass = size ? `btn-${size}` : '';
  const variantClass = variant ? `btn-${variant}` : '';
  return (
    <button 
      className={`btn ${variantClass} ${sizeClass} ${className}`} 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      aria-label={typeof children === 'string' ? children : 'Botó'}
    >
      {icon && <span className="icon-btn">{icon}</span>}
      {children}
    </button>
  );
}

export function UniversalCard({
  title,
  headingLevel = "h3",
  subtitle,
  body,
  location,
  time,
  author = 'Sóc de Poble',
  authorHref = '#targeta-perfil',
  avatarUrl = '/assets/system/ui/logo-socdepoble-cuadrat-verd.svg',
  imageUrl,
  price,
  labels = [],
  onClick,
  mainHref = '#',
  copyright,
  calendarBadge = null,
  isAvis = false
}) {
  const HeadingTag = headingLevel;

  return (
    <article className={`sp-card ${isAvis ? 'sp-card--avis' : ''}`}>
      <header className="sp-card-header">
        <a className="sp-card-author-link" href={authorHref}>
          <div className="sp-card-author">
            <img alt={author} className="sp-card-avatar sdp-p-0" src={avatarUrl} />
            <div className="sp-card-author-info">
              <div className="sp-card-author-name">{author}</div>
              <div className="sp-card-author-location">
                {location || 'La Torre de les Maçanes'}
              </div>
            </div>
          </div>
        </a>
        
        <div className="sp-card-meta sdp-gap-8">
          <button
            type="button"
            className="btn-icon-orange"
            title="Ancorar"
            aria-label="Ancorar aquesta publicació"
          >
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 11V7a4 4 0 0 0-8 0v4l-2 4h12l-2-4z" />
              <path d="M12 15v7" />
            </svg>
          </button>
          <button
            type="button"
            className="btn-date-time"
            aria-label={`Data i hora: ${time || '23:33 22/3/26'}`}
          >
            <span>{time ? time.split(' ')[0] : '23:33'}</span>
            <span>{time ? time.split(' ')[1] : '22/3/26'}</span>
          </button>
        </div>
      </header>
      
      {imageUrl && (
        <div className="sp-card-media">
          <img src={imageUrl} alt={title || 'Imatge de la publicació'} />
        </div>
      )}
      
      <div className="sp-card-body">
        {calendarBadge && (
          <div className="sp-card-calendar-badge" aria-hidden="true">
            <div className="sp-card-calendar-badge__dia">{calendarBadge.dia}</div>
            <div className="sp-card-calendar-badge__mes">{calendarBadge.mes}</div>
          </div>
        )}
        {price && <div className="sp-card-price">{price}</div>}

        <HeadingTag className="sp-card-title">
          <a
            href={mainHref}
            className="sp-card-main-link"
            onClick={(e) => {
              if (onClick) {
                e.preventDefault();
                onClick();
              }
            }}
          >
            {title}
            <span className="sp-card-link-overlay" aria-hidden="true" />
          </a>
        </HeadingTag>
        {subtitle && <h2 className="sp-card-subtitle">{subtitle}</h2>}
        {body && <div className="sp-card-text">{body}</div>}
        {labels.length > 0 && (
          <div className="sp-card-labels">
            {labels.map((l, i) => (
              <span key={i} className={`sp-card-label ${l.className || 'label-blue'}`}>{l.text}</span>
            ))}
          </div>
        )}
        {copyright && <div className="sp-card-copyright sdp-mt-4">{copyright}</div>}
      </div>
      
      <footer className="sp-card-footer">
        <div className="sp-card-actions">
          <IconButton label="Traduir">
            <Languages className="icon" size={24} strokeWidth={2} aria-hidden="true" />
          </IconButton>
          <IconButton label="Comentar">
            <MessageCircle className="icon" size={24} strokeWidth={2} aria-hidden="true" />
          </IconButton>
          <IconButton label="Compartir">
            <Share2 className="icon" size={24} strokeWidth={2} aria-hidden="true" />
          </IconButton>
        </div>
        <button
          type="button"
          className="sp-card-connect"
          onClick={onClick}
          aria-label="Connectar amb aquesta publicació"
        >
          Connectar
        </button>
      </footer>
    </article>
  );
}
"""

with open(universal_path, "w") as f:
    f.write(content)

print("Updated UniversalComponents.jsx")
