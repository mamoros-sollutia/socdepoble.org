import React from 'react';
import { UniversalPage } from '../../../components/universal/UniversalPage';
import { UniversalCard } from '../../../components/ui/UniversalCard';
import { useGestoriaData } from '../hooks/useGestoriaData';
import { useUIActions } from '../../../app/contexts/UIContext';

export default function GestoriaHome() {
  const { data, loading } = useGestoriaData();
  const { t } = useUIActions();

  if (loading) {
    return (
      <UniversalPage title="Gestoria de Poble" chrome="none">
        <div className="sdp-gestor-buit">
          Cargant Dades...
        </div>
      </UniversalPage>
    );
  }

  const { saldoFormatted, mesosRebost, events } = data;
  const eventsRecents = events.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

  return (
    <UniversalPage
      title="Tauler d'Inici"
      category="GESTORIA"
      tags={["PANEL INTERN", "VISTA RESUM"]}
      heroImage="/assets/fons_gestoria.jpg"
    >
      <div className="up-document universal-grid">
        
        <div className="stat-grid">
          
          <div className="stat-card">
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icona-linia"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">{saldoFormatted}</div>
              <div className="stat-label">Balanç Viu (Caixa)</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icona-linia"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <div className="stat-info">
              <div className="stat-value text-accent">{mesosRebost} mesos</div>
              <div className="stat-label">Mesos de Rebost (Runway)</div>
            </div>
          </div>

        </div>

        <UniversalCard
          title="Darrers Moviments Bancaris"
          headingLevel="h3"
        >
          {eventsRecents.length === 0 ? (
            <p className="sdp-text-mut sdp-marge-top">Sense moviments registrats.</p>
          ) : (
            <div className="sdp-taula-wrapper sdp-marge-top">
              <table className="sdp-taula sdp-taula--densa sdp-taula--zebra">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Concepte</th>
                    <th style={{ textAlign: 'right' }}>Import</th>
                  </tr>
                </thead>
                <tbody>
                  {eventsRecents.map((ev, i) => (
                    <tr key={i}>
                      <td className="sdp-text-mut sdp-text-nowrap">
                        {new Date(ev.timestamp).toLocaleDateString()}
                      </td>
                      <td>
                        <strong>{ev.clean_concept || ev.concept}</strong>
                      </td>
                      <td className={`sdp-text-dreta sdp-text-negreta ${ev.amount > 0 ? 'sdp-text-exit' : ''}`}>
                        {data.formatEur(ev.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </UniversalCard>

      </div>
    </UniversalPage>
  );
}
