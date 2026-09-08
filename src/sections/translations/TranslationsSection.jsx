import React from 'react';
import { UniversalPage } from '../../components/universal/UniversalComponents';
import { SUPPORTED_LANGUAGES } from '../../config/i18n';
import { useUIState } from '../../app/contexts/UIContext';
import { useUIActions } from '../../app/contexts/UIContext';

export default function TranslationsSection() {
  const { language } = useUIState();
  const { setLanguage, t } = useUIActions();

  return (
    <UniversalPage
      title={t('section.translations.title', 'Traduccions i llengua')}
      subtitle={t('section.translations.subtitle', 'Canvia l’idioma de la interfície')}
      lead="Aquesta pàgina et permet canviar l'idioma global de la interfície del sistema. Tingues en compte que el contingut d'una publicació o fitxa específica es tradueix des dels botons que trobaràs dins de cada publicació, no des d'ací."
      chrome="system"
      showLogos={true}
    >
      <div className="sdp-card-grid" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {SUPPORTED_LANGUAGES.map((item) => {
          const isActive = item.code === language;
          return (
            <button
              key={item.code}
              onClick={() => setLanguage(item.code)}
              className={`card ${isActive ? 'card--accent' : 'card--hover'}`}
              style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div className="card__body" style={{ padding: 0 }}>
                <h3 className="card__title">{item.name}</h3>
                <p className="card__text">{item.code.toUpperCase()}</p>
              </div>
              <span className={`pill ${isActive ? 'pill--accent' : ''}`}>
                {isActive ? t('section.translations.status.active', 'Actiu') : t('section.translations.status.available', 'Disponible')}
              </span>
            </button>
          );
        })}
      </div>
    </UniversalPage>
  );
}
