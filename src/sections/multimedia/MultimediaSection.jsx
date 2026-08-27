import { useMemo, useState } from 'react';
import SectionItemCard from '../../components/SectionItemCard';
import { useAppData } from '../../app/AppDataContext';
import { UniversalPage } from '../../components/universal/UniversalComponents';
import { getSectionItemPath } from '../../config/navigation';

export default function MultimediaSection() {
  const { mediaItems, mediaTimelineGroups, t } = useAppData();
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
      <div className="section-actions">
        <button type="button" className={`pill ${viewMode === 'grid' ? 'pill--primary' : ''}`} onClick={() => setViewMode('grid')}>
          {t('section.multimedia.gallery', 'Galeria')}
        </button>
        <button type="button" className={`pill ${viewMode === 'timeline' ? 'pill--primary' : ''}`} onClick={() => setViewMode('timeline')}>
          {t('section.multimedia.timeline', 'Cronologia')}
        </button>
      </div>

      {featured ? (
        <div className="card card--soft">
          <div className="split-grid">
            <div className="media-frame">
              <img src={featured.src} alt={featured.title} />
            </div>
            <div>
              <span className="badge">{featured.tag}</span>
              <h2 className="card__title">{featured.title}</h2>
              <p className="card__text">
                {featured.description || t('section.multimedia.featuredFallback', 'Recurs visual destacat del projecte.')}
              </p>
              <div className="feed-card__meta">
                <span>{featured.source}</span>
                <span>{featured.created_at ? String(featured.created_at).slice(0, 10) : t('common.noDate', 'Sense data')}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {viewMode === 'grid' ? (
        <div className="gallery-grid">
          {mediaItems.map((item, index) => (
            <SectionItemCard
              key={`${item.id}-${index}`}
              to={getSectionItemPath('multimedia', item.id)}
              state={{ preloadedItem: item }}
              image={item.src}
              title={item.title}
              subtitle={item.subtitle || item.kind}
              excerpt={item.description || item.tag}
              eyebrow={t('nav.multimedia', 'Multimèdia')}
              meta={[item.source, item.created_at ? String(item.created_at).slice(0, 10) : null]}
              buttonLabel={t('section.multimedia.open', 'Obrir')}
            />
          ))}
        </div>
      ) : (
        <div className="stack-grid">
          {timelineGroups.map((group) => (
            <section key={group.key} className="card card--soft">
              <div className="card__body">
                <div className="text-panel__head">
                  <h2 className="section-title">{group.label}</h2>
                  <span className="pill">{group.items.length} {t('section.multimedia.elements', 'elements')}</span>
                </div>
                <div className="gallery-grid">
                  {group.items.map((item, idx) => (
                    <SectionItemCard
                      key={`${item.id}-${idx}`}
                      to={getSectionItemPath('multimedia', item.id)}
                      state={{ preloadedItem: item }}
                      image={item.src}
                      title={item.title}
                      subtitle={item.subtitle || item.kind}
                      excerpt={item.description || item.tag}
                      eyebrow={item.tag}
                      meta={[item.source]}
                      buttonLabel={t('section.multimedia.open', 'Obrir')}
                    />
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
