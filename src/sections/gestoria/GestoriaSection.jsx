import React from 'react';
import { UniversalPage } from '../../components/universal/UniversalPage';
import { useUIActions } from '../../app/contexts/UIContext';

export default function GestoriaSection() {
  const { t } = useUIActions();

  return (
    <UniversalPage
      title={t('section.gestoria.title', 'Gestoria de Poble')}
      subtitle={t('section.gestoria.subtitle', 'Tauler autònom de comptabilitat, bancs i facturació trimestral')}
      chrome="none"
      noPadding
    >
      <div className="gestoria-frame-container" style={{ width: '100%', height: 'calc(100vh - 56px)', minHeight: '600px' }}>
        <iframe
          src="/gestoria/index.html"
          title="Gestoria de Poble"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        />
      </div>
    </UniversalPage>
  );
}
