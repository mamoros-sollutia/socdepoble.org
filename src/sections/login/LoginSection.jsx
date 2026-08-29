import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { UniversalPage } from '../../components/universal/UniversalComponents';
import { useAppData } from '../../app/AppDataContext';
import { loginWithEmail, registerWithEmail, loginWithGoogle } from '../../data/backendPort.js';
import { showToast } from '../../components/universal/AvisadorEfimer';
import { useNavigate } from 'react-router-dom';

export default function LoginSection() {
  const { t, externalConfig } = useAppData();
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!formData.email || !formData.password) {
      showToast(t('section.login.error.empty', 'Emplena tots els camps'), 'error');
      return;
    }
    setIsLoading(true);
    try {
      const res = await loginWithEmail(formData.email, formData.password, externalConfig);
      if (res.error) throw new Error(res.error.message);
      showToast(t('section.login.success.login', 'Benvingut de nou!'), 'success');
      window.dispatchEvent(new CustomEvent('sdp:auth-change'));
      navigate('/xat', { replace: true });
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle(externalConfig);
      showToast(t('section.login.success.login', 'Benvingut de nou!'), 'success');
      window.dispatchEvent(new CustomEvent('sdp:auth-change'));
      navigate('/xat', { replace: true });
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showToast(t('section.login.error.empty', 'Emplena tots els camps'), 'error');
      return;
    }
    setIsLoading(true);
    try {
      const res = await registerWithEmail(formData.email, formData.password, formData.name, externalConfig);
      if (res.error) throw new Error(res.error.message);
      showToast(t('section.login.success.register', 'Compte creat amb èxit! Benvingut!'), 'success');
      window.dispatchEvent(new CustomEvent('sdp:auth-change'));
      navigate('/xat', { replace: true });
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const isLogin = activeMode === 'login';
  const isRegister = activeMode === 'register';
  const isGoogle = activeMode === 'google';

  const dynamicTitle = isLogin
    ? t('section.login.loginTitle', 'Entrar')
    : isRegister
      ? t('section.login.registerTitle', 'Registre personal')
      : t('section.login.googleTitle', 'Google');

  const dynamicSubtitle = isLogin
    ? t('section.login.loginSubtitle', 'Accedeix al teu compte i recupera la teua sessió')
    : isRegister
      ? t('section.login.registerSubtitle', 'Obri un compte nou per a tindre el teu espai propi')
      : t('section.login.googleSubtitle', 'Accedeix ràpidament amb el teu compte de Google en un sol clic');

  return (
    <UniversalPage
      title={dynamicTitle}
      subtitle={dynamicSubtitle}
      lead={!isLogin ? t('section.login.registerEntradilla', 'Deus registrar-te amb el teu nom real com a persona física i el teu perfil serà sempre privat per defecte. Una vegada dins, podràs crear grups de treball i empreses de forma pública per a la teua comarca.') : null}
      chrome="system"
      showLogos={true}
    >
      <div className="login-layout">
        
        <div className="login-switcher" role="tablist" aria-label="Opcions d’accés">
          <button
            type="button"
            className={`pill ${isLogin ? 'pill--active' : ''}`}
            onClick={() => setActiveMode('login')}
            role="tab"
            aria-selected={activeMode === 'login'}
          >
            {t('section.login.loginButton', 'Entrar')}
          </button>
          <button
            type="button"
            className={`pill ${isRegister ? 'pill--active' : ''}`}
            onClick={() => setActiveMode('register')}
            role="tab"
            aria-selected={activeMode === 'register'}
          >
            {t('section.login.registerButton', 'Crear compte')}
          </button>
          <button
            type="button"
            className={`pill ${isGoogle ? 'pill--active' : ''}`}
            onClick={() => setActiveMode('google')}
            role="tab"
            aria-selected={activeMode === 'google'}
          >
            Google
          </button>
        </div>

        <div className="card">
          <div className="card__body">
            {activeMode === 'login' ? (
              <form className="login-form" onSubmit={handleLogin}>

                <label className="form-group">
                  <span>{t('section.login.loginEmail', 'Correu electrònic')}</span>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="nom@exemple.com" autoComplete="email" disabled={isLoading} />
                </label>

                <label className="form-group">
                  <span>{t('section.login.loginPassword', 'Contrasenya')}</span>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" autoComplete="current-password" disabled={isLoading} />
                </label>

                <button type="submit" className="pill pill--primary login-action" disabled={isLoading}>
                  {isLoading ? <Loader2 className="spinner" size={16} /> : (
                    <>
                      {t('section.login.loginButton', 'Entrar')}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            ) : activeMode === 'register' ? (
              <form className="login-form" onSubmit={handleRegister}>

                <label className="form-group">
                  <span>{t('section.login.registerName', 'Nom')}</span>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nom i cognoms" autoComplete="name" disabled={isLoading} />
                </label>

                <label className="form-group">
                  <span>{t('section.login.loginEmail', 'Correu electrònic')}</span>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="nom@exemple.com" autoComplete="email" disabled={isLoading} />
                </label>
                
                <label className="form-group">
                  <span>{t('section.login.loginPassword', 'Contrasenya')}</span>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" autoComplete="new-password" disabled={isLoading} />
                </label>

                <button type="submit" className="pill pill--primary login-action" disabled={isLoading}>
                  {isLoading ? <Loader2 className="spinner" size={16} /> : (
                    <>
                      {t('section.login.registerButton', 'Crear compte')}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="login-form">
                <button type="button" className="pill pill--primary login-action" disabled={isLoading} onClick={handleGoogleLogin}>
                  {isLoading ? <Loader2 className="spinner" size={16} /> : (
                    <>
                      {t('section.login.loginTitle', 'Entrar')}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </UniversalPage>
  );
}
