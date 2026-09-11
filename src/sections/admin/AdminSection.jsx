import React, { useState, useEffect } from 'react';
import { User, Building2, ServerCog } from 'lucide-react';
import { UniversalPage } from '../../components/universal/UniversalPage';
import AppGridShell from '../../components/layout/AppGridShell';
import AppGridColumn from '../../components/layout/AppGridColumn';
import { adminListUsers, adminListOrganizations } from '../../data/backendPort.js';
import { UniversalManager } from '../../components/universal/manager/UniversalManager';
import { usersManagerConfig } from '../../components/universal/manager/configs/usersManager';
import { companiesManagerConfig } from '../../components/universal/manager/configs/companiesManager';


function AdminSidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="univ-manager-admin-sidebar-inner">
      <AppGridColumn titol="Administració" />
      <h2 className="sdp-heading-3 ob-mb-15">Mode Administrador</h2>
      
      <div className="univ-manager-facet-list" role="navigation" aria-label="Menú d'administració">
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
    </aside>
  );
}

function AdminDashboard() {
  return (
    <div className="univ-manager-admin-dashboard sdp-article">
      <AppGridColumn titol="Tauler" />
      <p>Benvingut a l'administració de Sóc de Poble.</p>
      <div className="alert alert-info">
        Nota: Aquesta àrea està restringida a Superadmins. Si no tens permisos a la base de dades, les crides fallaran amb 42501.
      </div>
    </div>
  );
}

function AdminUsersManager() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    adminListUsers()
      .then(setUsers)
      .catch(err => {
        console.error(err);
        setError("Error de permisos o de xarxa en carregar usuaris.");
      });
  }, []);

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <UniversalManager
      items={users}
      facets={usersManagerConfig.facets}
      getItemId={usersManagerConfig.getItemId}
      getItemSearchText={usersManagerConfig.getItemSearchText}
      getItemCard={usersManagerConfig.getItemCard}
      renderDetail={(item) => (
         <aside className="univ-manager-admin-detail">
           <AppGridColumn titol="Detall de l'Usuari" />
           <h2>{item.email}</h2>
           <p className="ob-color-subtle">ID: {item.id}</p>
           <p>Alta: {item.created_at}</p>
           <p>Últim accés: {item.last_sign_in_at}</p>
         </aside>
      )}
    />
  );
}

function AdminCompaniesManager() {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    adminListOrganizations()
      .then(setCompanies)
      .catch(err => {
        console.error(err);
        setError("Error de permisos o de xarxa en carregar entitats.");
      });
  }, []);

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <UniversalManager
      items={companies}
      facets={companiesManagerConfig.facets}
      getItemId={companiesManagerConfig.getItemId}
      getItemSearchText={companiesManagerConfig.getItemSearchText}
      getItemCard={companiesManagerConfig.getItemCard}
      renderDetail={(item) => (
         <aside className="univ-manager-admin-detail">
           <AppGridColumn titol="Detall de l'Entitat" />
           <h2>{item.name}</h2>
           <p className="ob-color-subtle">ID: {item.id} / Slug: {item.slug}</p>
           <p>Alta: {item.created_at}</p>
           <p>{item.description}</p>
         </aside>
      )}
    />
  );
}

export default function AdminSection() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const middleContent = () => {
    switch (activeTab) {
      case 'usuaris': return <AdminUsersManager />;
      case 'entitats': return <AdminCompaniesManager />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <UniversalPage>
      <AppGridShell
        leftColumn={<AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />}
        middleColumn={middleContent()}
        rightColumn={null}
      />
    </UniversalPage>
  );
}

