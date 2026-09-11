import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from '../../app/contexts/RouterContext';
import { UniversalPage } from '../../components/universal/UniversalPage';
import { showToast } from '../../components/universal/AvisadorEfimer.jsx';
import { createOnboardingSeed } from '../../data/appSeed.js';
import {
  createOrganization,
  listMyOrganizations,
  loginWithMagicLink,
  loginWithGoogle,
  registerWithPassword,
  loginWithPassword
} from '../../data/backendPort.js';
import {
  findSeedOrganization,
  readableBackendError
} from './onboardingModel.js';
import { useSession } from '../../app/contexts/SessionContext';
import { useUIState } from '../../app/contexts/UIContext';
import {
  RegistrationStep
} from './OnboardingSteps.jsx';

export default function OnboardingSection() {
  const navigate = useNavigate();
  const { currentUser } = useSession();
  const { externalConfig } = useUIState();
  const seed = useMemo(() => createOnboardingSeed(), []);
  const [organizations, setOrganizations] = useState([]);
  const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(false);
  const [busyStep, setBusyStep] = useState(null);
  const [googleError, setGoogleError] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    if (currentUser) {
      // Bypasses the old onboarding steps, goes straight to dashboard
      navigate('/el-meu-perfil', { replace: true });
    }
  }, [currentUser, navigate]);

  const activeStep = 0;

  const loadOrganizations = useCallback(async (signal) => {
    if (!currentUser?.id) {
      setOrganizations([]);
      return;
    }

    setIsLoadingOrganizations(true);
    setError('');
    try {
      const rows = await listMyOrganizations({ ...externalConfig, signal });
      if (!signal.aborted) setOrganizations(rows);
    } catch (loadError) {
      if (!signal.aborted) setError(readableBackendError(loadError));
    } finally {
      if (!signal.aborted) setIsLoadingOrganizations(false);
    }
  }, [currentUser?.id, externalConfig]);

  useEffect(() => {
    const controller = new AbortController();
    loadOrganizations(controller.signal);
    return () => controller.abort();
  }, [loadOrganizations]);

  const sendMagicLink = async ({ email }) => {
    setBusyStep('register');
    setError('');
    try {
      await loginWithMagicLink(email, externalConfig);
      showToast('Hem enviat l\'enllaç al teu correu.', 'success');
    } catch (err) {
      setError(readableBackendError(err));
    } finally {
      setBusyStep(null);
    }
  };

  const handleRegister = async (fields) => {
    setBusyStep('register');
    setError('');
    try {
      await registerWithPassword(fields.email, fields.password, { full_name: fields.name }, externalConfig);
      showToast('Compte creat. Si cal, comprova el teu correu.', 'success');
      window.dispatchEvent(new CustomEvent('sdp:auth-change'));
    } catch (err) {
      setError(readableBackendError(err));
    } finally {
      setBusyStep(null);
    }
  };

  const handleLogin = async (fields) => {
    setBusyStep('register');
    setError('');
    try {
      await loginWithPassword(fields.email, fields.password, externalConfig);
      showToast('Benvingut de nou al Mas!', 'success');
      window.dispatchEvent(new CustomEvent('sdp:auth-change'));
    } catch (err) {
      setError(readableBackendError(err));
    } finally {
      setBusyStep(null);
    }
  };


  const googleLogin = async () => {
    setBusyStep('register');
    setGoogleError('');
    try {
      await loginWithGoogle(externalConfig);
      showToast('Benvingut de nou al Mas!', 'success');
      window.dispatchEvent(new CustomEvent('sdp:auth-change'));
    } catch (loginError) {
      setGoogleError(readableBackendError(loginError));
    } finally {
      setBusyStep(null);
    }
  };

  return (
    <UniversalPage
      title="Benvinguda al Mas Electrònic"
      lead="Entra per a participar. A l'interior podràs configurar la teua identitat i gestionar grups o empreses."
      labels={['Online-First', 'Perfil privat', 'RGPD Segur']}
      chrome="system"
      showLogos={true}
    >
      <div className="onboarding-layout">
        {activeStep === 0 && !isLoadingOrganizations && (
          <>
            <section className="onboarding-card onb-section-intro">
              <h3 className="onb-center-text">Accés ràpid amb Google</h3>
              <p>
                Crea o entra al teu compte amb un sol clic sense contrasenyes.
              </p>

              <p className="ob-mt-15-op8">
                En entrar o crear compte, acceptes el tractament de dades (RGPD Llei 05) per a Sóc de Poble. 
                També comprens que estem en <strong>fase Beta</strong> (proves) i que les teues dades podrien patir reinicis o pèrdues.
              </p>
              <button 
                type="button" 
                className="btn btn-secondary onboarding-card__action onb-flex-center-mt" 
                onClick={googleLogin}
                disabled={busyStep === 'register'}
              >
                Entrar amb Google
              </button>
              {googleError && (
                <div className="sdp-onboarding-error">
                  {googleError}
                </div>
              )}
            </section>
            
            <div className="onb-section-header">
              — O completar els 3 passos manuals —
            </div>
          </>
        )}


        {isLoadingOrganizations ? (
          <div className="onboarding-loading" role="status" aria-live="polite">
            <span className="onboarding-loading__spinner" aria-hidden="true" />
            Comprovant el teu progrés…
          </div>
        ) : activeStep === 0 ? (
          <RegistrationStep
            isBusy={busyStep === 'register'}
            error={error}
            onRegister={handleRegister}
            onLogin={handleLogin}
            onClearError={() => setError('')}
          />
        ) : null}
      </div>
    </UniversalPage>
  );
}
