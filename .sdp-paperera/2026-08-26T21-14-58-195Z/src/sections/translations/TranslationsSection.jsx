import React from 'react';
import { useAppData } from '../../app/AppDataContext';
import { UniversalPage, UniversalButton } from '../../components/universal/UniversalComponents';
import { SUPPORTED_LANGUAGES } from '../../config/i18n';

export default function TranslationsSection() {
  const { language, setLanguage, t } = useAppData();

  return (
    <UniversalPage
      title={t('section.translations.title', 'Traduccions i llengua')}
      subtitle={t('section.translations.subtitle', 'Canvia l’idioma de la interfície')}
      lead="Aquesta pàgina et permet canviar l'idioma global de la interfície del sistema. Tingues en compte que el contingut d'una publicació o fitxa específica es tradueix des dels botons que trobaràs dins de cada publicació, no des d'ací."
      chrome="system"
      showLogos={true}
      labels={[{ text: 'Sistema' }]}
    >
      // eslint-disable-next-line
      <div className="sdp-card-grid" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {SUPPORTED_LANGUAGES.map((item) => {
          const isActive = item.code === language;
          return (
            <button
              key={item.code}
              onClick={() => setLanguage(item.code)}
              // eslint-disable-next-line
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--sdp-space-5)',
                borderRadius: 'var(--sdp-radi-targeta)',
                border: isActive ? '2px solid var(--sdp-accent)' : '1px solid var(--sdp-vora-control)',
                background: isActive ? 'var(--sdp-fons-subtil)' : 'var(--sdp-fons-targeta)',
                cursor: 'pointer',
                transition: 'all var(--sdp-t)',
                width: '100%',
                textAlign: 'left'
              }}
            >
              // eslint-disable-next-line
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                // eslint-disable-next-line
                <span style={{ fontWeight: '700', fontSize: '1.2rem', color: isActive ? 'var(--sdp-accent)' : 'var(--sdp-text-titol)' }}>
                  {item.name}
                </span>
                // eslint-disable-next-line
                <span style={{ fontSize: '0.9rem', color: 'var(--sdp-text-suau)', marginTop: 'var(--sdp-space-1)' }}>
                  {item.code.toUpperCase()}
                </span>
              </div>
              
              // eslint-disable-next-line
              <div style={{ display: 'flex', alignItems: 'center' }}>
                // eslint-disable-next-line
                <span style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: '600',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  background: isActive ? 'var(--sdp-accent)' : 'var(--sdp-fons-invers)',
                  color: isActive ? 'var(--sdp-sobre-accent)' : 'var(--sdp-text-invers)'
                }}>
                  {isActive ? t('section.translations.status.active', 'Actiu') : t('section.translations.status.available', 'Disponible')}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </UniversalPage>
  );
}
