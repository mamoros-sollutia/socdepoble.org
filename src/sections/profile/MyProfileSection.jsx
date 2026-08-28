import { useState, useEffect } from 'react';
import { UniversalPage } from '../../components/universal/UniversalComponents';
import { useAppData } from '../../app/AppDataContext';
import { getCurrentUser, logout } from '../../data/backendPort.js';
import { showToast } from '../../components/universal/AvisadorEfimer';
import { LogOut, User, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyProfileSection() {
  const { t } = useAppData();
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
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--sdp-accent-subtil)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sdp-accent)' }}>
                <User size={32} />
              </div>
              <div>
                <h3 className="card__title" style={{ margin: 0 }}>{user.user_metadata?.name || 'Usuari Anònim'}</h3>
                {user.user_metadata?.role === 'superadmin' ? (
                  <span className="pill pill--active" style={{ marginTop: '8px', background: 'var(--sdp-accent)', color: 'var(--sdp-sobre-accent)' }}>Super Admin</span>
                ) : (
                  <span className="pill pill--active" style={{ marginTop: '8px' }}>Usuari Verificat</span>
                )}
              </div>
            </div>

            <label className="login-field">
              <span>Nom</span>
              <input 
                className="section-search" 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                disabled={isSaving}
              />
            </label>

            <label className="login-field">
              <span>Correu electrònic (no editable)</span>
              <input 
                className="section-search" 
                type="email" 
                value={user.email} 
                disabled 
                style={{ opacity: 0.6 }}
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
              <button type="button" className="pill login-action" onClick={handleLogout} style={{ flex: 1, justifyContent: 'center', background: 'var(--sdp-error)', color: 'white' }}>
                <LogOut size={16} />
                Tancar Sessió
              </button>
            </div>
          </form>
        </div>
      </div>
    </UniversalPage>
  );
}
