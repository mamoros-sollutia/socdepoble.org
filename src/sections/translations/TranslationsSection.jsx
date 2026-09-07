import React from 'react';
import { UniversalPage, UniversalButton } from '../../components/universal/UniversalComponents';
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
              style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--sdp-space-5)',
                borderRadius: 'var(--sdp-radi-g)',
                border: isActive ? '2px solid var(--sdp-accent)' : '1px solid var(--sdp-vora-control)',
                
                cursor: 'pointer',
                transition: 'all var(--sdp-t)',
                width: '100%',
                textAlign: 'left'
               }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span >
                  {item.name}
                </span>
                <span style={{    marginTop: 'var(--sdp-space-1)'  }}>
                  {item.code.toUpperCase()}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{  
                   
                  
                  padding: '4px 12px',
                  borderRadius: '16px'}}>
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
