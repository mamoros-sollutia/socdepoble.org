import { UniversalPage } from '../../components/universal/UniversalComponents';
import { useUIActions } from '../../app/contexts/UIContext';

export default function XatControlSection() {
  const { t } = useUIActions();

  return (
    <UniversalPage
      title={t('section.xatcontrol.title', 'Opcions del Xat')}
      subtitle={t('section.xatcontrol.subtitle', 'Ajustos, missatges temporals i organització de converses.')}
      chrome="system"
      showLogos={true}
    >
      <div className="sdp-grid sdp-text-content" style={{ padding: 'var(--sdp-space-6) var(--sdp-space-4)' }}>
        <p>Aquesta pàgina s'anirà emplenant amb les idees i opcions d'organització (Cerca al xat, Missatges temporals, Fons de pantalla, etc.) sense necessitat d'embrutar la interfície amb menús desplegables sobreposats.</p>
        
        <div className="stack-grid sdp-mt-6">
          <section className="card card--soft">
            <div className="card__body">
              <h3 className="section-title">Multimèdia, enllaços i documents</h3>
              <p>Revisa tot el que s'ha enviat al xat.</p>
            </div>
          </section>
          <section className="card card--soft">
            <div className="card__body">
              <h3 className="section-title">Missatges Temporals</h3>
              <p>Activa l'autodestrucció de missatges per a converses sensibles.</p>
            </div>
          </section>
          <section className="card card--soft">
            <div className="card__body">
              <h3 className="section-title">Privacitat i Seguretat</h3>
              <p>Silenciar notificacions, bloquejar, xifratge extrem a extrem.</p>
            </div>
          </section>
        </div>
      </div>
    </UniversalPage>
  );
}
