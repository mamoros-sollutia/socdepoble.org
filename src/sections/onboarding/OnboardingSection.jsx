import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UniversalPage } from '../../components/universal/UniversalComponents.jsx';
import { showToast } from '../../components/universal/AvisadorEfimer.jsx';
import { createOnboardingSeed } from '../../data/appSeed.js';
import {
  createOrganization,
  listMyOrganizations,
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle
} from '../../data/backendPort.js';
import {
  findSeedOrganization,
  readableBackendError
} from './onboardingModel.js';
import { useSession } from '../../app/contexts/SessionContext';
import { useUIState } from '../../app/contexts/UIContext';
import {
  OnboardingComplete,
  OrganizationStep,
  RegistrationStep,
  IdentityForkStep,
  ClaimStep
} from './OnboardingSteps.jsx';

export default function OnboardingSection() {
  const navigate = useNavigate();
  const { currentUser } = useSession();
  const { externalConfig } = useUIState();
  const seed = useMemo(() => createOnboardingSeed(), []);
  const [organizations, setOrganizations] = useState([]);
  const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(false);
  const [busyStep, setBusyStep] = useState(null);
  const [error, setError] = useState('');
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [onboardingPath, setOnboardingPath] = useState(null); // 'create' | 'claim' | null

  const company = findSeedOrganization(organizations, seed.company);
  const group = findSeedOrganization(organizations, seed.group, company?.id);
  
  const activeStep = useMemo(() => {
    if (!currentUser) return 0;
    if (onboardingPath === null) return 1; // IdentityFork
    if (onboardingPath === 'create' && !company) return 2;
    if (onboardingPath === 'claim') return 2; // ClaimStep
    return 3; // Complete
  }, [currentUser, onboardingPath, company]);

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

  const register = async ({ name, email, password }) => {
    setBusyStep('register');
    setError('');
    try {
      const result = await registerWithEmail(email, password, name, externalConfig);
      if (result?.access_token && result?.user) {
        showToast('Compte creat. Ara plantarem l’empresa.', 'success');
        window.dispatchEvent(new CustomEvent('sdp:auth-change', { detail: { user: result.user } }));
      } else {
        setConfirmationEmail(email.trim());
      }
    } catch (registerError) {
      setError(readableBackendError(registerError));
    } finally {
      setBusyStep(null);
    }
  };

  const createCompany = async (blueprint) => {
    setBusyStep('company');
    setError('');
    try {
      const created = await createOrganization(blueprint, externalConfig);
      setOrganizations((current) => [...current.filter((item) => item.id !== created.id), created]);
      showToast('L’empresa Sóc de Poble ja està creada.', 'success');
    } catch (creationError) {
      setError(readableBackendError(creationError));
    } finally {
      setBusyStep(null);
    }
  };

  const createGroup = async (blueprint) => {
    if (!company) return;
    setBusyStep('group');
    setError('');
    try {
      const created = await createOrganization({
        ...blueprint,
        parentOrganizationId: company.id
      }, externalConfig);
      setOrganizations((current) => [...current.filter((item) => item.id !== created.id), created]);
      showToast('El grup Rentonar ja està creat.', 'success');
    } catch (creationError) {
      setError(readableBackendError(creationError));
    } finally {
      setBusyStep(null);
    }
  };

  const login = async ({ email, password }) => {
    setBusyStep('register');
    setError('');
    try {
      const result = await loginWithEmail(email, password, externalConfig);
      if (result.error) throw new Error(result.error.message);
      showToast('Benvingut de nou al Mas!', 'success');
      window.dispatchEvent(new CustomEvent('sdp:auth-change', { detail: { user: result.user } }));
    } catch (loginError) {
      setError(readableBackendError(loginError));
    } finally {
      setBusyStep(null);
    }
  };

  const googleLogin = async () => {
    setBusyStep('register');
    setError('');
    try {
      await loginWithGoogle(externalConfig);
      showToast('Benvingut de nou al Mas!', 'success');
      window.dispatchEvent(new CustomEvent('sdp:auth-change'));
    } catch (loginError) {
      setError(readableBackendError(loginError));
    } finally {
      setBusyStep(null);
    }
  };

  return (
    <UniversalPage
      title="Benvinguda al Mas Electrònic"
      subtitle="Cada identitat al seu lloc"
      lead="Entra primer com a persona. El teu perfil serà sempre privat (ningú veurà que estàs dins) i només serà públic si tu ho decideixes. Una vegada a dins, podràs crear els grups o empreses que necessites. Nota: Encara no tenim operativa l'alta directa per a Ajuntaments i altres institucions oficials."
      labels={['Online-First', 'Perfil privat', 'RLS']}
      chrome="system"
      showLogos={true}
    >
      <div className="onboarding-layout">
        {activeStep === 0 && !isLoadingOrganizations && (
          <>
            <section className="onboarding-card" style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '1.5rem' }}>
              <h3>Accés ràpid amb Google</h3>
              <p>
                Crea o entra al teu compte amb un sol clic sense contrasenyes.
              </p>

              <p style={{ marginTop: '1.5rem', opacity: 0.8 }}>
                En entrar o crear compte, acceptes el tractament de dades (RGPD Llei 05) per a Sóc de Poble. 
                També comprens que estem en <strong>fase Beta</strong> (proves) i que les teues dades podrien patir reinicis o pèrdues.
              </p>
              <button 
                type="button" 
                className="btn btn-secondary onboarding-card__action" 
                onClick={googleLogin}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}
                disabled={busyStep === 'register'}
              >
                Entrar amb Google
              </button>
            </section>
            
            <div style={{ textAlign: 'center', marginBottom: '1.5rem', opacity: 0.6, fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
            confirmationEmail={confirmationEmail}
            onRegister={register}
            onLogin={login}
            onClearError={() => setError('')}
          />
        ) : activeStep === 1 ? (
          <IdentityForkStep
            onCreateNew={(kind) => setOnboardingPath('create')}
            onClaimExisting={() => setOnboardingPath('claim')}
            onSkip={() => navigate('/xat', { replace: true })}
          />
        ) : activeStep === 2 && onboardingPath === 'create' ? (
          <OrganizationStep
            key="company"
            blueprint={seed.company}
            isBusy={busyStep === 'company'}
            error={error}
            onCreate={createCompany}
            onClearError={() => setError('')}
            onSkip={() => navigate('/xat', { replace: true })}
          />
        ) : activeStep === 2 && onboardingPath === 'claim' ? (
          <ClaimStep
            organizations={organizations}
            onClaim={(id) => {
              // Stub for claim, will need backend logic, currently just skip
              showToast('Sol·licitud de reclamació enviada', 'success');
              navigate('/xat', { replace: true });
            }}
            onBack={() => setOnboardingPath(null)}
            isBusy={busyStep === 'claim'}
            error={error}
          />
        ) : (
          <OnboardingComplete
            company={company || seed.company}
            group={group || seed.group}
            onFinish={() => navigate('/xat', { replace: true })}
          />
        )}
      </div>
    </UniversalPage>
  );
}
