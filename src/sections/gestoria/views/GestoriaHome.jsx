import React from 'react';
import { UniversalPage } from '../../../components/universal/UniversalPage';
import { UniversalCard } from '../../../components/ui/UniversalCard';
import { useGestoriaData } from '../hooks/useGestoriaData';

export default function GestoriaHome() {
  const { data, loading } = useGestoriaData();

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
  const eventsRecents = [...events]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  return (
    <UniversalPage chrome="system"
      title="Tauler d'Inici"
      labels={["GESTORIA", "PANELL INTERN", "VISTA RESUM"]}
      heroImage="/assets/fons_gestoria.jpg"
    >
      <div className="content-wrapper sdp-card-grid">
        
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
          body={
            eventsRecents.length === 0 ? (
              <p className="sdp-camp__ajuda sdp-camp">Sense moviments registrats.</p>
            ) : (
              <div className="sdp-camp">
                <table className="sdp-taula sdp-taula--densa">
                  <thead>
                    <tr>
                      <th scope="col">Data</th>
                      <th scope="col">Concepte</th>
                      <th scope="col" className="sdp-text-dreta">Import</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventsRecents.map((ev) => (
                      <tr key={ev.id ?? `${ev.timestamp}-${ev.amount}`}>
                        <td className="sdp-camp__ajuda sdp-num">
                          {new Date(ev.timestamp).toLocaleDateString()}
                        </td>
                        <td><strong>{ev.clean_concept || ev.concept}</strong></td>
                        <td className={`sdp-text-dreta sdp-text-negreta ${ev.amount > 0 ? 'sdp-text-exit' : ''}`}>
                          {data.formatEur(ev.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        />


      </div>
    </UniversalPage>
  );
}
