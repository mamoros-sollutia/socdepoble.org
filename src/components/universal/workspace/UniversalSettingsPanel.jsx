import React from 'react';
import { useAppGrid } from '../../layout/AppGridShell';
import { useManager } from '../manager/ManagerContext';

export default function UniversalSettingsPanel() {
  const { applyPreset } = useAppGrid();
  const { setViewMode } = useManager();

  return (
    <div className="sdp-article-layout">
      <div className="page-title" style={{ textAlign: 'left', padding: 'var(--sdp-space-8) var(--sdp-space-8) var(--sdp-space-6)' }}>
        <h1 style={{ color: 'var(--sdp-accio-text)' }}>Ajustos de la Graella</h1>
        <p className="lead" style={{ color: 'var(--sdp-text-suau)', marginBottom: 'var(--sdp-space-6)' }}>
          Ací concentrarem les preferències de la Plantilla Enxufable. Pots provar ara mateix unes amplàries equilibrades o restaurar la mida original.
        </p>
        <div style={{ display: 'flex', gap: 'var(--sdp-space-3)', flexWrap: 'wrap', marginBottom: 'var(--sdp-space-8)' }}>
          <button type="button" className="sdp-boto sdp-boto--secundari" onClick={() => applyPreset('compacta')}>Compacta</button>
          <button type="button" className="sdp-boto sdp-boto--secundari" onClick={() => applyPreset('defecte')}>Per defecte</button>
          <button type="button" className="sdp-boto sdp-boto--secundari" onClick={() => applyPreset('ampla')}>Ampla</button>
        </div>
        <div>
          <button type="button" className="sdp-boto" onClick={() => setViewMode('editor')}>Tornar a la nota</button>
        </div>
      </div>
    </div>
  );
}
