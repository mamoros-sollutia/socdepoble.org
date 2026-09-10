import React from 'react';
import { UniversalPage } from '../../components/universal/UniversalPage';
import { TranslateIcon } from '../../components/universal/UniversalElements';
import { SUPPORTED_LANGUAGES } from '../../config/i18n';
import { useUIState } from '../../app/contexts/UIContext';
import { useUIActions } from '../../app/contexts/UIContext';

export default function TranslationsSection() {
  const { language } = useUIState();
  const { setLanguage, t } = useUIActions();

  return (
    <UniversalPage
      title={t('section.translations.title', 'Traduccions i llengua')}
      subtitle={t('section.translations.subtitle', 'Gestió d\'idiomes del sistema i contingut')}
      chrome="system"
      showLogos={true}
    >
      <div className="trans-container">
        <h2>1. Idioma del Sistema</h2>
        <p className="lead">Aquest ajust canvia l'idioma de tots els menús, botons i interfícies de l'aplicació. El nostre sistema suporta de forma nativa aquests {SUPPORTED_LANGUAGES.length} idiomes.</p>

        <div className="sdp-card-grid" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
          {SUPPORTED_LANGUAGES.map((item) => {
            const isActive = item.code === language;
            return (
              <button
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`card ${isActive ? 'card--accent' : 'card--hover'}`}
              >
                <div className="card__body">
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

        <hr className="trans-divider" />

        <h2>2. Traducció Dinàmica de Targetes</h2>
        <p className="lead">Com funciona la traducció del contingut creat pels usuaris en altres pobles.</p>
        
        <div className="trans-body">
          <h3>Motor de Traducció Integrat</h3>
          <p>
            A part de l'idioma base de la interfície, les Targetes (Mur, Xats, Mercat i Esdeveniments) compten amb un motor de traducció automàtic recolzat per <strong>Google Translator</strong>. 
            Això et permet llegir a l'instant el que escriuen usuaris d'altres pobles de l'estat (per exemple, si algú publica en Euskara o en Gallec) traduint-ho a la teua llengua de preferència.
          </p>

          <h3>Com utilitzar-ho</h3>
          <ul className="trans-list">
            <li>Busca la icona de traducció <span className="trans-icon-wrap"><TranslateIcon /></span> dins de les publicacions de les targetes.</li>
            <li>Fes clic sobre el botó per traduir només aquell missatge o publicació específica.</li>
            <li><strong>Nota:</strong> Les traduccions automàtiques de Google poden contindre xicotets errors d'interpretació quan es tracta d'expressions molt locals o frases fetes de cada territori.</li>
          </ul>
        </div>
      </div>
    </UniversalPage>
  );
}
