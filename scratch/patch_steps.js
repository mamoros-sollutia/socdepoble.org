const fs = require('fs');
const file = 'src/sections/onboarding/OnboardingSteps.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add MapPin import
if (!content.includes('MapPin')) {
  content = content.replace('UsersRound', 'UsersRound,\n  MapPin');
}

const identityForkStepStr = `
export function IdentityForkStep({ onCreateNew, onClaimExisting, onSkip }) {
  return (
    <section className="onboarding-card">
      <div className="onboarding-card__heading">
        <span className="onboarding-card__icon" aria-hidden="true"><UserRound size={28} /></span>
        <div>
          <p className="onboarding-card__eyebrow">Pas 2 de 3</p>
          <h2 style={{ color: 'var(--sdp-accio-text)' }}>Quina és la teua relació amb el poble?</h2>
        </div>
      </div>
      <p className="onboarding-card__intro" style={{ textAlign: 'center' }}>
        Tria com vols interactuar dins la xarxa. Pots crear una empresa, reclamar-ne una d'existent, o simplement explorar com a persona.
      </p>
      <div className="fork-grid" style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
        <button type="button" className="btn btn-secondary" onClick={() => onCreateNew('company')} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <Building2 size={20} /> Sóc una empresa o comerç
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => onCreateNew('group')} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <UsersRound size={20} /> Sóc una associació o col·lectiu
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => onClaimExisting()} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <MapPin size={20} /> Vull gestionar una entitat ja existent
        </button>
        <button type="button" className="btn" onClick={onSkip} style={{ background: 'transparent', color: 'var(--sdp-accio)', border: '1px solid var(--sdp-accio)' }}>
          Només vull explorar (mode persona)
        </button>
      </div>
    </section>
  );
}

export function ClaimStep({ organizations, onClaim, onBack, isBusy, error }) {
  const orphanEntities = organizations.filter(o => !o.has_owner);
  
  return (
    <section className="onboarding-card">
      <div className="onboarding-card__heading">
        <span className="onboarding-card__icon" aria-hidden="true"><MapPin size={28} /></span>
        <div>
          <p className="onboarding-card__eyebrow">Pas 3 de 3</p>
          <h2 style={{ color: 'var(--sdp-accio-text)' }}>Reclama la gestió d'una entitat</h2>
        </div>
      </div>
      
      {error ? <div className="alert alert-error" role="alert">{error}</div> : null}

      {orphanEntities.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>No hi ha entitats disponibles per reclamar en este moment.</p>
      ) : (
        <ul className="claim-list" style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0' }}>
          {orphanEntities.map(org => (
            <li key={org.id} className="claim-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--sdp-vora)' }}>
              <div>
                <strong style={{ display: 'block' }}>{org.name}</strong>
                <span className="badge badge-secondary">{org.kind}</span>
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => onClaim(org.id)}
                disabled={isBusy}
              >
                {isBusy ? <Loader2 className="spinner" size={18} /> : 'Sol·licitar gestió'}
              </button>
            </li>
          ))}
        </ul>
      )}
      <button className="btn btn-ghost" onClick={onBack} disabled={isBusy} style={{ width: '100%', marginTop: '1rem' }}>
        Tornar arrere
      </button>
    </section>
  );
}
`;

if (!content.includes('IdentityForkStep')) {
  content = content + '\n' + identityForkStepStr;
  fs.writeFileSync(file, content);
}
