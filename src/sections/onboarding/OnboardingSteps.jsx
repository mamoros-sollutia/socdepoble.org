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
import { PillToggle } from '../../components/ui/PillToggle.jsx';
import { UniversalCard } from '../../components/universal/UniversalElements.jsx';

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
      <UniversalCard
        variant="onboarding"
        icon={<MailCheck size={28} />}
        subtitle="Correu enviat"
        title="Confirma el teu compte"
        body={
          <>
            <p>
              Hem enviat l’enllaç de confirmació a <strong>{confirmationEmail}</strong>.
              En confirmar-lo, torna a entrar per continuar amb l’empresa i el grup.
            </p>
            <button type="button" className="btn btn-secondary onboarding-card__action" onClick={() => window.location.reload()}>
              Entés <ArrowRight size={18} aria-hidden="true" />
            </button>
          </>
        }
      />
    );
  }

  return (
    <UniversalCard
      variant="onboarding"
      title="Accés o nou registre"
      body={
        <>
          <p className="onboarding-card__intro onb-center-text">
            Primer entra una persona real. El teu perfil queda privat i separat de les
            organitzacions que crearàs després.
          </p>
          <p className="onboarding-card__intro onb-center-text-mt">
            En entrar o crear compte, acceptes el tractament de dades (RGPD Llei 05) per a Sóc de Poble. 
            També comprens que estem en <strong>fase Beta</strong> (proves) i que les teues dades podrien patir reinicis o pèrdues.
          </p>

          {/* 260911: abans role="tab" sense tabpanel ni fletxes (patró ARIA
              incomplet) i `.pill--active` sense regla CSS. */}
          <PillToggle
            className="sdp-pindola--centrada ob-mb-15"
            etiqueta="Opcions d’accés"
            valor={mode}
            onCanvi={(v) => { setMode(v); setErrors({}); }}
            opcions={[
              { valor: 'login', text: 'Entrar' },
              { valor: 'register', text: 'Crear compte' },
            ]}
          />

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
        </>
      }
    />
  );
}

