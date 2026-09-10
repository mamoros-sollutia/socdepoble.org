import React, { useState, useEffect } from 'react';
import { ShieldAlert, Lock, LogOut, User, Building2, ServerCog } from 'lucide-react';
import { UniversalPage } from '../../components/universal/UniversalPage';
import AppGridShell from '../../components/layout/AppGridShell';
import AppGridColumn from '../../components/layout/AppGridColumn';
import { esAdminLocal, desaAdminLocal, tancaAdminLocal } from '../../data/identitat.js';
import { adminListUsers, adminListOrganizations } from '../../data/backendPort.js';
import { UniversalManager } from '../../components/universal/manager/UniversalManager';
import { usersManagerConfig } from '../../components/universal/manager/configs/usersManager';
import { companiesManagerConfig } from '../../components/universal/manager/configs/companiesManager';
import '../../components/universal/manager/UniversalManager.css';

function LocalAdminStep({ onLogin }) {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (secret === 'Mestre') {
      onLogin(secret);
    } else {
      setError('Secret incorrecte. Accés denegat.');
    }
  };

  return (
    <UniversalPage>
      <div className="univ-manager-admin-login-wrapper">
        <section className="onboarding-card" aria-labelledby="admin-login-title">
          <div className="onboarding-card__heading">
            <span className="onboarding-card__icon" aria-hidden="true"><ShieldAlert size={28} /></span>
            <h2 id="admin-login-title">Accés Superadministrador</h2>
          </div>
          <p className="onboarding-card__intro onb-center-text">
            Panell de manteniment. Aquesta àrea requereix credencials de superusuari a la base de dades per a operar.
          </p>
          {error && <div className="alert alert-error" role="alert">{error}</div>}
          <form className="onboarding-form" onSubmit={submit}>
            <label className={`form-group${error ? ' has-error' : ''}`}>
              <span>Codi de validació d'entorn</span>
              <input 
                type="password" 
                value={secret} 
                onChange={e => { setSecret(e.target.value); setError(''); }} 
                autoFocus
              />
            </label>
            <button type="submit" className="btn btn-secondary onboarding-card__action">
              <Lock size={18} aria-hidden="true" />
              Verificar Autoritat
            </button>
          </form>
        </section>
      </div>
    </UniversalPage>
  );
}

function AdminSidebar({ onLogout, activeTab, setActiveTab }) {
  return (
    <aside className="notes-column">
      <AppGridColumn titol="Administració" plegable={false} onReplega={() => {}} />
      <div className="univ-manager-admin-sidebar-inner">
        <h2 className="sdp-heading-3 ob-mb-15">Mode Administrador</h2>
        
        <div className="folders-list" role="navigation" aria-label="Menú d'administració">
          <button 
            className={`univ-manager-facet-item ${activeTab === 'dashboard' ? 'univ-manager-facet-item--active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <ServerCog size={18} aria-hidden="true" />
            <span>Panell General</span>
          </button>
          <button 
            className={`univ-manager-facet-item ${activeTab === 'usuaris' ? 'univ-manager-facet-item--active' : ''}`}
            onClick={() => setActiveTab('usuaris')}
          >
            <User size={18} aria-hidden="true" />
            <span>Usuaris</span>
          </button>
          <button 
            className={`univ-manager-facet-item ${activeTab === 'entitats' ? 'univ-manager-facet-item--active' : ''}`}
            onClick={() => setActiveTab('entitats')}
          >
            <Building2 size={18} aria-hidden="true" />
            <span>Entitats</span>
          </button>
        </div>
        
        <div className="univ-manager-admin-actions">
          <button className="btn btn-outline univ-manager-admin-action-btn" onClick={onLogout}>
            <LogOut size={16} />
            Eixir del panell
          </button>
        </div>
      </div>
    </aside>
  );
}

function AdminDashboard() {
  return (
    <aside className="notes-column">
      <AppGridColumn titol="Tauler" plegable={false} onReplega={() => {}} />
      <div className="univ-manager-admin-dashboard sdp-article">
        <p>Benvingut a l'administració de Sóc de Poble.</p>
        <div className="alert alert-info">
          La connexió s'ha establert com a Superadmin Local. Tens accés de lectura a les taules restringides via RPC.
        </div>
      </div>
    </aside>
  );
}

function AdminUsersManager() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    adminListUsers().then(setUsers).catch(console.error);
  }, []);

  return (
    <UniversalManager
      items={users}
      facets={usersManagerConfig.facets}
      getItemId={usersManagerConfig.getItemId}
      getItemSearchText={usersManagerConfig.getItemSearchText}
      renderItem={(item, isActive) => (
         <div>
            <strong>{item.email}</strong>
         </div>
      )}
      renderDetail={(item) => (
         <aside className="notes-column">
           <AppGridColumn titol="Detall de l'Usuari" plegable={false} onReplega={() => {}} />
           <div className="univ-manager-admin-detail">
             <h2>{item.email}</h2>
             <pre className="univ-manager-admin-pre">
               {JSON.stringify(item, null, 2)}
             </pre>
           </div>
         </aside>
      )}
    />
  );
}

function AdminCompaniesManager() {
  const [companies, setCompanies] = useState([]);
  
  useEffect(() => {
    adminListOrganizations().then(setCompanies).catch(console.error);
  }, []);

  return (
    <UniversalManager
      items={companies}
      facets={companiesManagerConfig.facets}
      getItemId={companiesManagerConfig.getItemId}
      getItemSearchText={companiesManagerConfig.getItemSearchText}
      renderItem={(item, isActive) => (
         <div>
            <strong>{item.name}</strong>
            <span className="ob-text-small ob-ml-5 ob-color-subtle">{item.kind}</span>
         </div>
      )}
      renderDetail={(item) => (
         <aside className="notes-column">
           <AppGridColumn titol="Detall de l'Entitat" plegable={false} onReplega={() => {}} />
           <div className="univ-manager-admin-detail">
             <h2>{item.name}</h2>
             <pre className="univ-manager-admin-pre">
               {JSON.stringify(item, null, 2)}
             </pre>
           </div>
         </aside>
      )}
    />
  );
}

export default function AdminSection() {
  const [isAdmin, setIsAdmin] = useState(esAdminLocal());
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = (secret) => {
    desaAdminLocal(secret);
    setIsAdmin(true);
  };

  const handleLogout = () => {
    tancaAdminLocal();
    setIsAdmin(false);
  };

  if (!isAdmin) {
    return <LocalAdminStep onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (activeTab === 'usuaris') {
      return (
         <div className="univ-manager-admin-container">
           <div className="univ-manager-admin-header">
              <button className="btn btn-outline" onClick={() => setActiveTab('dashboard')}>← Tornar al Tauler</button>
              <h3 className="univ-manager-admin-header-title">Gestió d'Usuaris</h3>
           </div>
           <div className="univ-manager-admin-content">
             <AdminUsersManager />
           </div>
         </div>
      );
    }

    if (activeTab === 'entitats') {
      return (
         <div className="univ-manager-admin-container">
           <div className="univ-manager-admin-header">
              <button className="btn btn-outline" onClick={() => setActiveTab('dashboard')}>← Tornar al Tauler</button>
              <h3 className="univ-manager-admin-header-title">Gestió d'Entitats</h3>
           </div>
           <div className="univ-manager-admin-content">
             <AdminCompaniesManager />
           </div>
         </div>
      );
    }

    return (
      <UniversalPage>
        <AppGridShell
          leftColumn={<AdminSidebar onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab} />}
          middleColumn={<AdminDashboard />}
          rightColumn={null}
        />
      </UniversalPage>
    );
  };

  return renderContent();
}

