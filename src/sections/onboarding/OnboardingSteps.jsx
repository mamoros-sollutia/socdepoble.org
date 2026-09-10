import { useState } from 'react';
import {
  ArrowRight,
  Building2,
  Check,
  Loader2,
  MailCheck,
  UserRound,
  UsersRound,
  MapPin
} from 'lucide-react';
import { validateRegistration } from './onboardingModel.js';



export function RegistrationStep({ isBusy, error, confirmationEmail, onRegister, onLogin, onClearError }) {
  const [mode, setMode] = useState('register');
  const [fields, setFields] = useState({ name: '', email: '', password: '', rgpd: false });
  const [errors, setErrors] = useState({});

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setFields((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    if (onClearError && error) onClearError();
  };

  const submit = async (event) => {
    event.preventDefault();
    if (mode === 'register') {
      const nextErrors = validateRegistration(fields);
      if (!fields.rgpd) {
        nextErrors.rgpd = 'Has d’acceptar la política de privacitat per continuar.';
      }
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) return;
      await onRegister(fields);
      setFields((current) => ({ ...current, password: '' }));
    } else {
      const nextErrors = {};
      if (!fields.email) nextErrors.email = 'Correu obligatori';
      if (!fields.password) nextErrors.password = 'Contrasenya obligatòria';
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) return;
      await onLogin({ email: fields.email, password: fields.password });
    }
  };

  if (confirmationEmail) {
    return (
      <section className="onboarding-card onboarding-confirmation" aria-live="polite">
        <span className="onboarding-card__icon" aria-hidden="true"><MailCheck size={28} /></span>
        <p className="onboarding-card__eyebrow">Correu enviat</p>
        <h2>Confirma el teu compte</h2>
        <p>
          Hem enviat l’enllaç de confirmació a <strong>{confirmationEmail}</strong>.
          En confirmar-lo, torna a entrar per continuar amb l’empresa i el grup.
        </p>
        <button type="button" className="btn btn-secondary onboarding-card__action" onClick={() => window.location.reload()}>
          Entés <ArrowRight size={18} aria-hidden="true" />
        </button>
      </section>
    );
  }

  return (
    <section className="onboarding-card" aria-labelledby="onboarding-register-title">
      <h3 id="onboarding-register-title" className="onb-center-text">
        <span className="onboarding-card__icon" aria-hidden="true" style={{ marginRight: '8px', verticalAlign: 'middle' }}><UserRound size={28} /></span>
        <span style={{ verticalAlign: 'middle' }}>Accés o nou registre</span>
      </h3>

      <p className="onboarding-card__intro onb-center-text">
        Primer entra una persona real. El teu perfil queda privat i separat de les
        organitzacions que crearàs després.
      </p>
      <p className="onboarding-card__intro onb-center-text-mt">
        En entrar o crear compte, acceptes el tractament de dades (RGPD Llei 05) per a Sóc de Poble. 
        També comprens que estem en <strong>fase Beta</strong> (proves) i que les teues dades podrien patir reinicis o pèrdues.
      </p>

      <div className="login-switcher ob-mb-15" role="tablist" aria-label="Opcions d’accés">
        <button
          type="button"
          className={`pill ${mode === 'login' ? 'pill--active' : ''}`}
          onClick={() => { setMode('login'); setErrors({}); }}
          role="tab"
          aria-selected={mode === 'login'}
        >
          Entrar
        </button>
        <button
          type="button"
          className={`pill ${mode === 'register' ? 'pill--active' : ''}`}
          onClick={() => { setMode('register'); setErrors({}); }}
          role="tab"
          aria-selected={mode === 'register'}
        >
          Crear compte
        </button>
      </div>

      {error ? <div className="alert alert-error" role="alert">{error}</div> : null}

      <form className="onboarding-form" onSubmit={submit} noValidate>
        {mode === 'register' && (
          <label className={`form-group${errors.name ? ' has-error' : ''}`}>
            <span>Nom i cognoms</span>
            <input
              type="text"
              name="name"
              value={fields.name}
              onChange={updateField}
              autoComplete="name"
              maxLength={120}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'onboarding-name-error' : undefined}
              disabled={isBusy}
            />
            {errors.name ? <span id="onboarding-name-error" className="error-text">{errors.name}</span> : null}
          </label>
        )}

        <label className={`form-group${errors.email ? ' has-error' : ''}`}>
          <span>Correu electrònic</span>
          <input
            type="email"
            name="email"
            value={fields.email}
            onChange={updateField}
            autoComplete="email"
            inputMode="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'onboarding-email-error' : undefined}
            disabled={isBusy}
          />
          {errors.email ? <span id="onboarding-email-error" className="error-text">{errors.email}</span> : null}
        </label>

        <label className={`form-group${errors.password ? ' has-error' : ''}`}>
          <span>Contrasenya</span>
          <input
            type="password"
            name="password"
            value={fields.password}
            onChange={updateField}
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            minLength={mode === 'register' ? 10 : undefined}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={mode === 'register' ? 'onboarding-password-help' : undefined}
            disabled={isBusy}
          />
          {mode === 'register' && (
            <span id="onboarding-password-help" className={errors.password ? 'error-text' : 'onboarding-field-help'}>
              {errors.password || 'Mínim 10 caràcters. No reutilitzes una contrasenya antiga.'}
            </span>
          )}
          {mode === 'login' && errors.password && (
            <span className="error-text">{errors.password}</span>
          )}
        </label>

        {mode === 'register' && (
          <>


            <label className={`form-group form-group--checkbox${errors.rgpd ? ' has-error sdp-border-error' : ' sdp-border-vora'} sdp-items-center`}
            >
              <input
                type="checkbox"
                name="rgpd"
                checked={fields.rgpd}
                onChange={updateField}
                aria-invalid={Boolean(errors.rgpd)}
                aria-describedby={errors.rgpd ? 'onboarding-rgpd-error' : undefined}
                disabled={isBusy}
                className="onb-icon-action"
              />
              <span className="">Consent el tractament de dades personals (RGPD Llei 05) exclusivament per a Sóc de Poble.</span>
            </label>
            {errors.rgpd ? <span id="onboarding-rgpd-error" className="error-text onb-block-mt">{errors.rgpd}</span> : null}
          </>
        )}

        <button type="submit" className="btn btn-secondary onboarding-card__action" disabled={isBusy}>
          {isBusy ? <Loader2 className="spinner" size={18} aria-hidden="true" /> : <UserRound size={18} aria-hidden="true" />}
          {mode === 'login' ? 'Entrar al compte' : 'Crear el compte'}
        </button>
      </form>
    </section>
  );
}

export function OrganizationStep({ blueprint, parentOrganization, isBusy, error, onCreate, onClearError, onSkip }) {
  const [name, setName] = useState(blueprint.name);
  const [slug, setSlug] = useState(blueprint.slug);
  const [lema, setLema] = useState(blueprint.lema || '');
  const [description, setDescription] = useState(blueprint.description);
  const [errors, setErrors] = useState({});
  const isGroup = blueprint.kind === 'group';
  const Icon = isGroup ? UsersRound : Building2;

  const submit = async (event) => {
    event.preventDefault();
    const organization = { ...blueprint, name, slug, lema, description };
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'El nom és obligatori.';
    if (!slug.trim()) nextErrors.slug = 'L’identificador és obligatori.';
    if (!description.trim()) nextErrors.description = 'La descripció és obligatòria.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    await onCreate(organization);
  };

  return (
    <section className="onboarding-card" aria-labelledby={`onboarding-${blueprint.kind}-title`}>
      <h2 id={`onboarding-${blueprint.kind}-title`} className="onb-center-text">
        <span className="onboarding-card__icon" aria-hidden="true" style={{ marginRight: '8px', verticalAlign: 'middle' }}><Icon size={28} /></span>
        <span style={{ verticalAlign: 'middle' }}>{isGroup ? 'Crea el grup Rentonar' : 'Crea l’empresa Sóc de Poble'}</span>
      </h2>

      <p className="onboarding-card__intro onb-center-text">
        {isGroup
          ? 'El grup quedarà vinculat a l’empresa. Tu en seràs la persona propietària inicial.'
          : 'L’empresa és una identitat pública distinta del teu perfil personal.'}
      </p>
      <p className="onboarding-card__intro onb-center-text-mt">
        En continuar, acceptes el tractament de dades (RGPD Llei 05) per a Sóc de Poble. 
        També comprens que estem en <strong>fase Beta</strong> (proves) i que les teues dades podrien patir reinicis o pèrdues.
      </p>

      {error ? <div className="alert alert-error" role="alert">{error}</div> : null}

      <form className="onboarding-form" onSubmit={submit} noValidate>
        <div className="onboarding-field-grid">
          <label className={`form-group${errors.name ? ' has-error' : ''}`}>
            <span>Nom públic</span>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => {
                setName(e.target.value);
                setErrors((current) => ({ ...current, name: undefined }));
                if (onClearError && error) onClearError();
              }}
              aria-invalid={Boolean(errors.name)}
              disabled={isBusy}
            />
          </label>
          <label className={`form-group${errors.slug ? ' has-error' : ''}`}>
            <span>Identificador</span>
            <input 
              type="text" 
              value={slug} 
              onChange={(e) => {
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                setErrors((current) => ({ ...current, slug: undefined }));
                if (onClearError && error) onClearError();
              }}
              aria-invalid={Boolean(errors.slug)}
              disabled={isBusy}
            />
          </label>
        </div>
        
        <label className={`form-group${errors.lema ? ' has-error' : ''}`}>
          <span>Lema o Entradilla</span>
          <input 
            type="text" 
            value={lema} 
            onChange={(e) => {
              setLema(e.target.value);
              setErrors((current) => ({ ...current, lema: undefined }));
              if (onClearError && error) onClearError();
            }}
            aria-invalid={Boolean(errors.lema)}
            disabled={isBusy}
            maxLength={120}
          />
          {errors.lema ? <span className="error-text">{errors.lema}</span> : null}
        </label>

        <label className={`form-group${errors.description ? ' has-error' : ''}`}>
          <span>Descripció pública</span>
          <textarea
            rows="4"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              setErrors((current) => ({ ...current, description: undefined }));
              if (onClearError && error) onClearError();
            }}
            maxLength={500}
            aria-invalid={Boolean(errors.description)}
            aria-describedby="onboarding-description-help"
            disabled={isBusy}
          />
          <span id="onboarding-description-help" className={errors.description ? 'error-text' : 'onboarding-field-help'}>
            {errors.description || `${description.length}/500 caràcters`}
          </span>
        </label>

        <div className="onboarding-public-note">
          <span className="badge badge-primary">Públic</span>
          <p>Nom, descripció i relació entre entitats seran visibles. El teu perfil personal continua privat.</p>
        </div>

        <div className="onb-btn-group-full">
          <button
            type="submit"
            className="btn btn-secondary onboarding-card__action"
            disabled={isBusy || (isGroup && !parentOrganization)}
          >
            {isBusy ? <Loader2 className="spinner" size={18} aria-hidden="true" /> : <Icon size={18} aria-hidden="true" />}
            {isGroup ? 'Crear el grup' : 'Crear l’empresa'}
          </button>
          {onSkip && (
            <button
              type="button"
              className="btn onboarding-card__action"
              onClick={onSkip}
              disabled={isBusy}
            >
              Continuar com a persona
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export function OnboardingComplete({ company, group, onFinish }) {
  return (
    <section className="onboarding-card onboarding-complete" aria-labelledby="onboarding-complete-title">
      <span className="onboarding-complete__mark" aria-hidden="true"><Check size={34} /></span>
      <p className="onboarding-card__eyebrow">Alta completa</p>
      <h2 id="onboarding-complete-title">El Mas ja té les tres pedres</h2>
      <p>
        El perfil personal és privat. <strong>{company.name}</strong> és l’empresa
        pública i <strong>{group.name}</strong> és el seu grup de treball.
      </p>
      <dl className="onboarding-summary">
        <div><dt>Empresa</dt><dd>{company.name}</dd></div>
        <div><dt>Grup</dt><dd>{group.name}</dd></div>
        <div><dt>El teu rol</dt><dd>Propietari</dd></div>
      </dl>
      <button type="button" className="btn btn-secondary onboarding-card__action" onClick={onFinish}>
        Entrar a Sóc de Poble <ArrowRight size={18} aria-hidden="true" />
      </button>
    </section>
  );
}

export function IdentityForkStep({ onCreateNew, onClaimExisting, onSkip }) {
  return (
    <section className="onboarding-card">
      <h2 className="onb-center-text">
        <span className="onboarding-card__icon" aria-hidden="true" style={{ marginRight: '8px', verticalAlign: 'middle' }}><UserRound size={28} /></span>
        <span style={{ verticalAlign: 'middle' }}>Quina és la teua relació amb el poble?</span>
      </h2>
      <p className="onboarding-card__intro onb-center-text">
        Tria com vols interactuar dins la xarxa. Pots crear una empresa, reclamar-ne una d'existent, o simplement explorar com a persona.
      </p>
      <div className="fork-grid onb-fork-grid-margin">
        <button type="button" className="btn btn-secondary onb-btn-icon-center" onClick={() => onCreateNew('company')}>
          <Building2 size={20} /> Sóc una empresa o comerç
        </button>
        <button type="button" className="btn btn-secondary onb-btn-icon-center" onClick={() => onCreateNew('group')}>
          <UsersRound size={20} /> Sóc una associació o col·lectiu
        </button>
        <button type="button" className="btn btn-secondary onb-btn-icon-center" onClick={() => onClaimExisting()}>
          <MapPin size={20} /> Vull gestionar una entitat ja existent
        </button>
        <button type="button" className="btn btn-outline-accio" onClick={onSkip}>
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
      <h2 className="onb-center-text">
        <span className="onboarding-card__icon" aria-hidden="true" style={{ marginRight: '8px', verticalAlign: 'middle' }}><MapPin size={28} /></span>
        <span style={{ verticalAlign: 'middle' }}>Reclama la gestió d'una entitat</span>
      </h2>
      
      {error ? <div className="alert alert-error" role="alert">{error}</div> : null}

      {orphanEntities.length === 0 ? (
        <p className="onb-center-text">No hi ha entitats disponibles per reclamar en este moment.</p>
      ) : (
        <ul className="onb-org-list">
          {orphanEntities.map(org => (
            <li key={org.id} className="onb-org-item">
              <div>
                <strong className="onb-block">{org.name}</strong>
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
      <button className="btn btn-primary onb-full-width-btn" onClick={onBack} disabled={isBusy}>
        Tornar arrere
      </button>
    </section>
  );
}
