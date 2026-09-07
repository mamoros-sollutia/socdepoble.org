import { useMemo, useState } from 'react';
import SectionItemCard from '../../components/SectionItemCard';
import { UniversalPage } from '../../components/universal/UniversalComponents';
import { Link } from 'react-router-dom';
import { getSectionItemPath } from '../../config/navigation';
import { useMultimedia } from './MultimediaContext';
import { useUIActions } from '../../app/contexts/UIContext';

export default function MultimediaSection() {
  const { mediaItems, mediaTimelineGroups } = useMultimedia();
  const { t } = useUIActions();
  const [viewMode, setViewMode] = useState('grid');
  const featured = useMemo(() => mediaItems[0] || null, [mediaItems]);
  const timelineGroups = useMemo(() => mediaTimelineGroups, [mediaTimelineGroups]);

  return (
    <UniversalPage
      title={t('section.multimedia.title', 'Arxiu visual')}
      subtitle={t('section.multimedia.subtitle', 'Galeria d’imatges i cronologia visual del projecte.')}
      chrome="system"
      showLogos={true}
    >
      <div className="bar-orange sdp-items-center" style={{ display: 'flex', position: 'relative', top: 0, zIndex: 10, margin: '-24px -24px 24px -24px', padding: '12px 24px', borderRadius: 'var(--sdp-radi-xl) var(--sdp-radi-xl) 0 0' }}>
        <strong style={{ flex: 1 }}>{t('section.multimedia.all', 'TOTS')} ({mediaItems.length}) - {featured?.created_at ? new Date(featured.created_at).toLocaleDateString('ca-ES', { month: 'long', year: 'numeric' }) : ''}</strong>
        <div className="section-actions" style={{ display: 'flex', gap: '8px' }}>
          <button type="button" className={`pill ${viewMode === 'grid' ? 'pill--active' : ''}`} onClick={() => setViewMode('grid')}>
            {t('section.multimedia.gallery', 'Galeria')}
          </button>
          <button type="button" className={`pill ${viewMode === 'timeline' ? 'pill--active' : ''}`} onClick={() => setViewMode('timeline')}>
            {t('section.multimedia.timeline', 'Cronologia')}
          </button>
        </div>
      </div>



      {viewMode === 'grid' ? (
        <div className="photo-grid">
          {mediaItems.map((item, index) => (
            <Link
              key={`${item.id}-${index}`}
              to={getSectionItemPath('multimedia', item.id)}
              state={{ preloadedItem: item }}
              className="photo-grid__item"
            >
              {item.src ? (
                <img src={item.src} alt={item.title || item.tag} loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <div style={{  width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span className="sdp-sr-only">{item.title || 'Sense imatge'}</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="stack-grid">
          {timelineGroups.map((group) => (
            <section key={group.key} className="card card--soft">
              <div className="card__body">
                <div className="panel-head">
                  <h2 className="section-title">{group.label}</h2>
                  <span className="pill">{group.items.length} {t('section.multimedia.elements', 'elements')}</span>
                </div>
                <div className="photo-grid">
                  {group.items.map((item, idx) => (
                    <Link
                      key={`${item.id}-${idx}`}
                      to={getSectionItemPath('multimedia', item.id)}
                      state={{ preloadedItem: item }}
                      className="photo-grid__item"
                    >
                      {item.src ? (
                        <img src={item.src} alt={item.title || item.tag} loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />
                      ) : (
                        <div style={{  width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <span className="sdp-sr-only">{item.title || 'Sense imatge'}</span>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </UniversalPage>
  );
}
