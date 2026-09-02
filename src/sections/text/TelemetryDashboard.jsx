import { UniversalIndicatorCard } from '../../components/universal/UniversalComponents';
import { BarChart2, PieChart, TrendingUp, Users } from 'lucide-react';

export default function TelemetryDashboard() {
  return (
    <section className="sdp-mb-12 sdp-mt-6">
      <div style={{ textAlign: 'center', marginBottom: 'var(--sdp-space-6)' }}>
        <h3 style={{ margin: 0 }}>Telemetria Oberta</h3>
        <p style={{   marginTop: 'var(--sdp-space-2)'  }}>
          Estadístiques lliures de cookies. No sabem absolutament res de la teua identitat.
        </p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--sdp-space-4)' }}>
        <UniversalIndicatorCard 
          icon={<Users size={40} strokeWidth={1.5} />}
          title="3.174"
          subtitle="Visitants únics"
          iconColor="#3b82f6"
          onClick={() => window.open('https://cloud.umami.is/analytics/eu/websites/6ffce900-c41a-470e-9b12-38fb6028db18', '_blank')}
        />
        <UniversalIndicatorCard 
          icon={<BarChart2 size={40} strokeWidth={1.5} />}
          title="139.314"
          subtitle="Pàgines vistes"
          iconColor="#f97316"
          onClick={() => window.open('https://cloud.umami.is/analytics/eu/websites/6ffce900-c41a-470e-9b12-38fb6028db18', '_blank')}
        />
        <UniversalIndicatorCard 
          icon={<PieChart size={40} strokeWidth={1.5} />}
          title="8.914"
          subtitle="Visites totals"
          iconColor="#8b5cf6"
          onClick={() => window.open('https://cloud.umami.is/analytics/eu/websites/6ffce900-c41a-470e-9b12-38fb6028db18', '_blank')}
        />
        <UniversalIndicatorCard 
          icon={<TrendingUp size={40} strokeWidth={1.5} />}
          title="1.337"
          subtitle="Rebots"
          iconColor="#ef4444"
          onClick={() => window.open('https://cloud.umami.is/analytics/eu/websites/6ffce900-c41a-470e-9b12-38fb6028db18', '_blank')}
        />
      </div>
      
      <div className="alert alert-warning sdp-mt-6 sdp-mb-8">
        <div>
          <strong>Mètrica transparent:</strong> Aquest quadre de comandament és un resum de les estadístiques públiques d'Umami. Fes clic en qualsevol de les targetes per veure el tauler interactiu complet.
        </div>
      </div>
      
      <hr style={{ marginTop: 'var(--sdp-space-12)', marginBottom: 'var(--sdp-space-8)' }} />
    </section>
  );
}
