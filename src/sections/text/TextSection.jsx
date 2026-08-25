import { UniversalPage } from '../../components/universal/UniversalComponents';
import { useAppData } from '../../app/AppDataContext';
import { resolveAsset } from '../../config/assetResolver';
import DOMPurify from 'dompurify';

export default function TextSection({ page, pageKey }) {
  const { t } = useAppData();
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
      time="22:28"
      date="20/08/26"
      dateTime="2026-08-20T22:28:00+02:00"
      chrome="context"
    >
      // eslint-disable-next-line
      <div className="sdp-grid sdp-text-content" style={{ padding: 'var(--sdp-space-6) var(--sdp-space-4)' }}>
        <article children={ DOMPurify.sanitize(page.html) } />
      </div>
    </UniversalPage>
  );
}
