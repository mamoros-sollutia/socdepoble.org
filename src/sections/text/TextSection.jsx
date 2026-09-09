import { UniversalPage } from '../../components/universal/UniversalComponents';
import { resolveAsset } from '../../config/assetResolver';
import { sanitizeHtml } from '../../utils/sanitize';

import { useUIActions } from '../../app/contexts/UIContext';

function formatDate(dStr) {
  if (!dStr) return '';
  const d = new Date(dStr);
  return d.toLocaleDateString('ca-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function formatTime(dStr) {
  if (!dStr) return '';
  const d = new Date(dStr);
  return d.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
}

export default function TextSection({ page, pageKey }) {
  const { t } = useUIActions();
  return (
    <UniversalPage
      title={page.title}
      subtitle={page.subtitle}
      lead={page.lead}
      heroImage={resolveAsset(page.image || '/assets/img/hero_panoramic_rural_view_1774720664221.png')}
      heroAlt={page.imageAlt || "Panoràmica d'un poble fictici"}
      showLogos={true}
      labels={page.labels || [
        { text: pageKey.toUpperCase(), className: 'sdp-badge-system' },
        { text: t?.('section.text.page', 'Pàgina') || 'Pàgina', className: 'sdp-badge-category' }
      ]}
      copyright="© Sóc de Poble / Fet per la IAIA i Nano Banana"
      time={formatTime(page.date)}
      date={formatDate(page.date)}
      dateTime={page.date || ''}
      chrome="context"
      topBarData={{ showPin: false }}
    >
      <article className="cms-preview" dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.html) }} />
    </UniversalPage>
  );
}
