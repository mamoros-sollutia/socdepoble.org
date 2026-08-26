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
    getImage: (item) => getFirstImage(item.imageSrc || item.image_url || item.image || item.images?.[0] || item.avatar_url) || null,
    renderBody: (item) => (
      <>
        {item.description && (
          <div className="sdp-mb-8">
            {renderRichText(item.description)}
          </div>
        )}
        {Array.isArray(item.variations) && item.variations.length > 0 ? (
          <div className="stack-grid sdp-mt-5">
            {item.variations.map((variation) => (
              <div key={variation.name} className="note-card sdp-text-center sdp-flex-col sdp-items-center sdp-p-4">
                {variation.image && (
                  <img 
                    src={variation.image} 
                    alt={variation.name} 
                    className="sdp-mb-4 sdp-radi-xl sdp-object-contain"
                    width={120}
                  />
                )}
                <h3 className="sdp-text-accent sdp-mb-1">
                  {variation.name}
                </h3>
                <p className="card__text sdp-mb-1">
                  {variation.description}
                </p>
                <p className="sdp-text-muted sdp-uppercase sdp-text-sm sdp-mb-4">
                  VENEDOR: {item.seller || 'SÓC DE POBLE'}
                </p>
                <div className="sp-card-price sdp-text-accent sdp-text-2xl sdp-mb-2">
                  {variation.price}
                </div>
                <button className="btn btn-secondary sdp-w-full sdp-max-w-xs sdp-uppercase sdp-mt-2 sdp-justify-center sdp-text-center">
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
