import { Tag, UserRound } from 'lucide-react';
import { renderRichText } from '../../detail/detailRichText.jsx';
import { getFirstImage } from '../../detail/detailHelpers.jsx';

export function buildMercatDetailSectionMeta({ marketItems = [], t }) {
  return {
    title: t('section.detail.mercat.title', 'Mercat'),
    label: t('section.detail.mercat.label', 'Producte'),
    listPath: '/mercat',
    items: marketItems,
    getTitle: (item) => item.title || t('section.detail.mercat.itemTitle', 'Producte'),
    getSubtitle: (item) => item.subtitle || item.description || item.summary || '',
    getImage: (item) => getFirstImage(item.imageSrc || item.image_url || item.image || item.avatar_url) || null,
    renderBody: (item) => (
      <>
        {Array.isArray(item.variations) && item.variations.length > 0 ? (
          // eslint-disable-next-line
          <div className="stack-grid" style={{ marginTop: 18 }}>
            {item.variations.map((variation) => (
              // eslint-disable-next-line
              <div key={variation.name} className="note-card sdp-text-center" style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {variation.image && (
                  <img 
                    src={`/assets/uploads/empresa/soc-de-poble/mercat/samarreta-soc-de-poble/${variation.image}`} 
                    alt={variation.name} 
                    // eslint-disable-next-line
                    style={{ borderRadius: 16, marginBottom: 16, width: 120, height: 'auto', objectFit: 'contain' }} 
                  />
                )}
                // eslint-disable-next-line
                <h3 className="sdp-text-accent" style={{ marginBottom: 4 }}>
                  {variation.name}
                </h3>
                // eslint-disable-next-line
                <p className="card__text" style={{ marginBottom: 4 }}>
                  {variation.description}
                </p>
                // eslint-disable-next-line
                <p style={{ color: 'var(--sdp-color-muted, gray)', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: 16 }}>
                  VENEDOR: SÓC DE POBLE
                </p>
                // eslint-disable-next-line
                <div className="sp-card-price" style={{ fontSize: '1.5rem', marginBottom: 8, color: 'var(--sdp-accent)' }}>
                  {variation.price}
                </div>
                // eslint-disable-next-line
                <button className="btn btn-secondary" style={{ width: '100%', maxWidth: 320, textTransform: 'uppercase', marginTop: 8, justifyContent: 'center', textAlign: 'center' }}>
                  Afegeix al cabàs
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </>
    )
  };
}
