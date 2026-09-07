import { useState, useEffect } from 'react';
import { UniversalPage } from '../../components/universal/UniversalComponents';
import { getCurrentUser, logout } from '../../data/backendPort.js';
import { showToast } from '../../components/universal/AvisadorEfimer';
import { LogOut, User, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUIActions } from '../../app/contexts/UIContext';

export default function MyProfileSection() {
  const { t } = useUIActions();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      setFormData({ name: currentUser?.user_metadata?.name || '' });
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // In a real app we'd call Supabase update user API here
      // For now we just simulate success
      showToast(t('section.myprofile.success', 'Perfil actualitzat correctament'), 'success');
    } catch (_error) {
      showToast(t('section.myprofile.error', "Error en actualitzar l'usuari"), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <UniversalPage
      title={t('section.myprofile.title', 'El Meu Perfil')}
      subtitle={t('section.myprofile.subtitle', 'Gestiona les teues dades d\'usuari')}
      chrome="system"
      showLogos={true}
    >
      <div className="card">
        <div className="card__body">
          <form onSubmit={handleSave} className="sdp-flex-col sdp-gap-5">
            <div className="sdp-flex sdp-gap-4 sdp-items-center">
              <div className="avatar avatar--large">
                <User size={32} />
              </div>
              <div>
                <h3 className="card__title sdp-m-0">{user.user_metadata?.full_name || user.user_metadata?.name || 'Usuari Anònim'}</h3>
                {user.user_metadata?.role === 'admin' && (
                  <span className="pill pill--active sdp-text-sobre-accent sdp-mt-2">Super Admin</span>
                )}
                {user.user_metadata?.verified && (
                  <span className="pill pill--active sdp-mt-2">Usuari Verificat</span>
                )}
              </div>
            </div>

            <label className="form-group">
              <span>Nom</span>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                disabled={isSaving}
              />
            </label>

            <label className="form-group">
              <span>Correu electrònic (no editable)</span>
              <input 
                className={isSaving ? 'sdp-opacity-60' : ''}
                type="email" 
                value={user.email} 
                disabled={isSaving}
              />
            </label>

            <div className="profile-actions">
              <button type="submit" className="pill pill--primary login-action" disabled={isSaving}>
                {isSaving ? <Loader2 className="spinner" size={16} /> : (
                  <>
                    <Save size={16} />
                    Guardar Canvis
                  </>
                )}
              </button>
              <button type="button" className="pill login-action pill--error sdp-flex-1 sdp-justify-center" onClick={handleLogout}>
                <LogOut size={16} />
                Tancar Sessió
              </button>
            </div>
          </form>
        </div>
      </div>

      {user.user_metadata?.role === 'superadmin' && (
        <div className="card sdp-mt-6 sdp-border-accent">
          <div className="card__body">
            <h3 className="card__title sdp-flex sdp-items-center sdp-gap-2">
              <span className="sdp-text-xl">🛡️</span>
              {t('section.myprofile.adminTitle', 'Centre de Comandament')}
            </h3>
            <p className="card__text sdp-mb-4">
              {t('section.myprofile.adminDesc', 'Com a Super Administrador, tens accés complet a la configuració del sistema, moderació global i gestió de pobles.')}
            </p>
            <button type="button" className="pill pill--accent login-action" onClick={() => navigate('/configuracio')}>
              {t('section.myprofile.adminButton', 'Obrir Administració del Portal')}
            </button>
          </div>
        </div>
      )}
    </UniversalPage>
  );
}
