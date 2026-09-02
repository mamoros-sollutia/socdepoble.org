import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Cpu, Network, Receipt, FileText, Store, Calendar, MapPin, MessageSquare, Shield, LogOut } from 'lucide-react';
import { UniversalPage, UniversalCard, UniversalIndicatorCard, UniversalButton } from '../../components/universal/UniversalComponents';
import { useAppData } from '../../app/AppDataContext';
import { resolveAsset } from '../../config/assetResolver';

export default function ControlSection() {
  const navigate = useNavigate();
  const { t } = useAppData();


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
      subtitle={t('section.control.subtitle', 'Node principal i accés a les eines d\'administració i gestió')}
      lead={t('section.control.lead', 'Tria on vols publicar i crea nous continguts des de l\'editor universal.')}
      chrome="system"
    >
      <div style={{ padding: 'var(--sdp-space-8) var(--sdp-space-4)', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--sdp-space-12)' }}>
        
        {/* Accions Principals - Quadres de Comandament */}
        <section>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--sdp-space-4)' }}>
            <UniversalIndicatorCard 
              icon={<FileText size={40} strokeWidth={1.5} />}
              title="Publicar al Mur"
              subtitle="Compartir novetats"
              onClick={() => navigate('/notes')}
              iconColor="var(--sdp-accent)"
            />
            <UniversalIndicatorCard 
              icon={<Store size={40} strokeWidth={1.5} />}
              title="Publicar al Mercat"
              subtitle="Vendre productes"
              onClick={() => navigate('/notes')}
              iconColor="var(--sdp-accent)"
            />
            <UniversalIndicatorCard 
              icon={<Calendar size={40} strokeWidth={1.5} />}
              title="Publicar Esdeveniments"
              subtitle="Crear agenda"
              onClick={() => navigate('/notes')}
              iconColor="var(--sdp-accent)"
            />
            <UniversalIndicatorCard 
              icon={<MapPin size={40} strokeWidth={1.5} />}
              title="Publicar al Mapa"
              subtitle="Veure rutes"
              onClick={() => navigate('/notes')}
              iconColor="var(--sdp-accent)"
            />
          </div>
        </section>

        {/* Eines i Recursos (Opcions secundàries) */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sdp-space-4)', maxWidth: '400px', margin: '0 auto' }}>
          <UniversalButton onClick={() => navigate('/xat/001')} variant="primary" icon={<MessageSquare size={18} />}>
            Missatges per a dubtes
          </UniversalButton>


          <UniversalButton variant="ghost" icon={<LogOut size={18} />}>
            Eixir del poble
          </UniversalButton>
        </section>

      </div>
    </UniversalPage>
  );
}
