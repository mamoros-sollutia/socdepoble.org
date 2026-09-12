import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from '../../app/contexts/RouterContext';
import { UniversalPage } from '../../components/universal/UniversalPage';
import { useUIActions } from '../../app/contexts/UIContext';
import { useSession } from '../../app/contexts/SessionContext';
import { teCapacitat } from '../../data/backendPort';

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


  if (!teCapacitat('gestoria')) {
    return (
      <UniversalPage title={t('section.gestoria.title', 'Gestoria')} chrome="none">
        <div className="sdp-buit">
          <div role="status" className="sdp-alerta sdp-alerta--info">
            <h3>Gestoria pendent de backend</h3>
            <p>Esta secció necessita que el backend implemente <code>loadGestoria</code>. Encara no està disponible.</p>
          </div>
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
