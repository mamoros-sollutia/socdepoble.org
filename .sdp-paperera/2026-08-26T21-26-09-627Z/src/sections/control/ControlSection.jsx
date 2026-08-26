import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Cpu, Network, Receipt, FileText, Store, Calendar, MapPin, MessageSquare, Shield, LogOut } from 'lucide-react';
import { UniversalPage, UniversalCard, UniversalIndicatorCard, UniversalButton } from '../../components/universal/UniversalComponents';
import { useAppData } from '../../app/AppDataContext';
import { resolveAsset } from '../../config/assetResolver';

export default function ControlSection() {
  const navigate = useNavigate();
  const { t } = useAppData();

  const handleNavNotes = (e) => {
    e?.stopPropagation();
    navigate('/notes');
  };
  const handleNavIA = (e) => {
    e?.stopPropagation();
    navigate('/ia');
  };
  const handleNavTermo = (e) => {
    e?.stopPropagation();
    console.warn('Accés a consola termodinàmica bloquejat per seguretat del host.');
  };
  const handleNavGestoria = (e) => {
    e?.stopPropagation();
    navigate('/gestoria');
  };
  const handleNavConnectar = (e) => {
    e?.stopPropagation();
    navigate('/connectar');
  };

  return (
    <UniversalPage
      title={t('section.control.title', 'Panell de Control')}
      subtitle={t('section.control.subtitle', 'Node principal i accés a les eines d\'administració i gestió.')}
      labels={[
        { text: t('section.control.meta1', 'Admin'), className: 'sdp-badge-system' },
        { text: t('section.control.meta2', 'Sistema'), className: 'sdp-badge-category' }
      ]}
      chrome="system"
    >
      <div style={{ padding: 'var(--sdp-space-8) var(--sdp-space-4)', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--sdp-space-12)' }}>
        
        {/* Accions Principals - Quadres de Comandament */}
        <section>
          <div style={{ textAlign: 'center', marginBottom: 'var(--sdp-space-6)' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--sdp-text-suau)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Accessos Ràpids</h4>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--sdp-space-4)' }}>
            <UniversalIndicatorCard 
              icon={<FileText size={40} strokeWidth={1.5} />}
              title="Mur"
              subtitle="Compartir novetats"
              onClick={() => navigate('/mur')}
              iconColor="var(--sdp-accent)"
            />
            <UniversalIndicatorCard 
              icon={<Store size={40} strokeWidth={1.5} />}
              title="Mercat"
              subtitle="Vendre productes"
              onClick={() => navigate('/mercat')}
              iconColor="var(--sdp-accent)"
            />
            <UniversalIndicatorCard 
              icon={<Calendar size={40} strokeWidth={1.5} />}
              title="Esdeveniments"
              subtitle="Crear agenda"
              onClick={() => navigate('/events')}
              iconColor="var(--sdp-accent)"
            />
            <UniversalIndicatorCard 
              icon={<MapPin size={40} strokeWidth={1.5} />}
              title="Mapes"
              subtitle="Veure rutes"
              onClick={() => navigate('/mapes')}
              iconColor="var(--sdp-accent)"
            />
          </div>
        </section>

        {/* Nodes d'Administració (antic control-grid) */}
        <section>
          <div style={{ textAlign: 'center', marginBottom: 'var(--sdp-space-6)' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--sdp-text-suau)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Nodes d'Administració</h4>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--sdp-space-6)' }}>
            <UniversalCard
              title="JAVI LLINARES"
              subtitle="EL TEU ESPAI PERSONAL"
              author="Javi Llinares"
              location="La Torre de les Maçanes"
              avatarUrl={resolveAsset("/assets/uploads/gent/javi-llinares/avatars/javi-llinares-perfil-1200px.jpg")}
              avatarAlt="Avatar Javi Llinares"
              onMainClick={handleNavNotes}
              onConnect={handleNavConnectar}
              body={
                // eslint-disable-next-line
                <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0 16px', color: 'var(--sdp-accent)' }}>
                  <User size={64} strokeWidth={1.5} />
                </div>
              }
            />

            <UniversalCard
              title="IAIA MarIA"
              subtitle="ÀNIMA I CONSCIÈNCIA DEL SISTEMA"
              author="IAIA MarIA"
              location="La Torre de les Maçanes"
              avatarUrl={resolveAsset("/assets/images/nano_anima_mas_ibanez_v3_1781060081431.webp")}
              avatarAlt="Avatar IAIA MarIA"
              onMainClick={handleNavIA}
              onConnect={handleNavConnectar}
              body={
                // eslint-disable-next-line
                <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0 16px', color: 'var(--sdp-accent)' }}>
                  <Cpu size={64} strokeWidth={1.5} />
                </div>
              }
            />

            <UniversalCard
              title="TERMODINÀMICA"
              subtitle="MONITORATGE DE RECURSOS"
              author="Sóc de Poble"
              location="La Torre de les Maçanes"
              avatarUrl={resolveAsset("/assets/images/nano_porta_masia_roure_1774195469079.png")}
              avatarAlt="Termodinàmica"
              onMainClick={handleNavTermo}
              onConnect={handleNavConnectar}
              body={
                // eslint-disable-next-line
                <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0 16px', color: 'var(--sdp-accent)' }}>
                  <Network size={64} strokeWidth={1.5} />
                </div>
              }
            />

            <UniversalCard
              title="GESTORIA"
              subtitle="ADMINISTRACIÓ I FINANCES"
              author="Sóc de Poble"
              location="La Torre de les Maçanes"
              avatarUrl={resolveAsset("/assets/images/nano_porta_del_mas.png")}
              avatarAlt="Gestoria"
              onMainClick={handleNavGestoria}
              onConnect={handleNavConnectar}
              body={
                // eslint-disable-next-line
                <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0 16px', color: 'var(--sdp-accent)' }}>
                  <Receipt size={64} strokeWidth={1.5} />
                </div>
              }
            />
          </div>
        </section>

        {/* Eines i Recursos (Opcions secundàries) */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sdp-space-4)', maxWidth: '400px', margin: '0 auto' }}>
          <UniversalButton onClick={() => navigate('/xat')} variant="outline" icon={<MessageSquare size={18} />}>
            Missatges per a dubtes
          </UniversalButton>
          <UniversalButton onClick={handleNavNotes} variant="primary" icon={<FileText size={18} />}>
            Bloc de notes
          </UniversalButton>
          <UniversalButton onClick={() => navigate('/projecte')} variant="secondary" icon={<Shield size={18} />}>
            El Projecte
          </UniversalButton>
          <UniversalButton variant="ghost" icon={<LogOut size={18} />}>
            Eixir del poble
          </UniversalButton>
        </section>

      </div>
    </UniversalPage>
  );
}
