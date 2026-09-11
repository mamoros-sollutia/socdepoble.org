import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from '../../app/contexts/RouterContext';
import { UniversalPage } from '../../components/universal/UniversalPage';
import { useUIActions } from '../../app/contexts/UIContext';
import { initializeDBWithCSV } from './lib/csv_ingestor';
import { useSession } from '../../app/contexts/SessionContext';

// Vistes Nadiues de la Gestoria
import GestoriaHome from './views/GestoriaHome';
import GestoriaFacturacio from './views/GestoriaFacturacio';
import GestoriaContactes from './views/GestoriaContactes';
import GestoriaBurocracia from './views/GestoriaBurocracia';
import GestoriaBancs from './views/GestoriaBancs';
import GestoriaImpostos from './views/GestoriaImpostos';
import GestoriaInformes from './views/GestoriaInformes';
import GestoriaIngesta from './views/GestoriaIngesta';

export default function GestoriaSection() {
  const { currentUser } = useSession();
  const { t } = useUIActions();
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    // Inicialitzem la base de dades Dexie en entrar a la secció
    initializeDBWithCSV().then(() => {
      setDbReady(true);
    }).catch(err => {
      console.error("Error inicialitzant DB Gestoria:", err);
      setDbReady(true); // Fallback per no bloquejar l'UI
    });
  }, []);

  if (!currentUser) {
    return (
      <UniversalPage title={t('section.gestoria.title', 'Gestoria')} chrome="none">
        <div className="sdp-gestor-buit">
          <div role="alert" className="sdp-alerta--error">
            <h3>Accés Restringit</h3>
            <p>Ho sentim, però no pots accedir a la gestoria perquè no estàs registrat ni has iniciat sessió.</p>
          </div>
        </div>
      </UniversalPage>
    );
  }

  if (!dbReady) {
    return (
      <UniversalPage title={t('section.gestoria.title', 'Gestoria de Poble')} chrome="none">
        <div className="sdp-gestor-buit">
          Cargant Base de Dades Local...
        </div>
      </UniversalPage>
    );
  }

  return (
    <Routes>
      <Route path="" element={<Navigate to="/gestoria/home" replace />} />
      <Route path="/" element={<Navigate to="/gestoria/home" replace />} />
      <Route path="home" element={<GestoriaHome />} />
      <Route path="facturacio" element={<GestoriaFacturacio />} />
      <Route path="contactes" element={<GestoriaContactes />} />
      <Route path="burocracia" element={<GestoriaBurocracia />} />
      <Route path="bancs" element={<GestoriaBancs />} />
      <Route path="impostos" element={<GestoriaImpostos />} />
      <Route path="informes" element={<GestoriaInformes />} />
      <Route path="ingesta" element={<GestoriaIngesta />} />
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/gestoria/home" replace />} />
    </Routes>
  );
}
