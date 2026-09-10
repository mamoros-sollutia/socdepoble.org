import React from 'react';
import { useNavigate } from '../../app/contexts/RouterContext';
import { User, Cpu, Network, Receipt, FileText, Store, Calendar, MapPin, MessageSquare, Shield, LogOut, Car, PawPrint, MessageCircle } from 'lucide-react';
import { UniversalPage } from '../../components/universal/UniversalPage';
import { UniversalCard, UniversalIndicatorCard, UniversalButton } from '../../components/universal/UniversalElements';
import { resolveAsset } from '../../config/assetResolver';
import { useUIActions } from '../../app/contexts/UIContext';

export default function ControlSection() {
  const navigate = useNavigate();
  const { t } = useUIActions();


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
      <div className="ctl-main-container">
        
        {/* Accions Principals - Quadres de Comandament */}
        <section>
          
          <div className="sdp-card-grid">
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
            <UniversalIndicatorCard 
              icon={<Car size={40} strokeWidth={1.5} />}
              title="Compartir vehicle"
              subtitle="Oferir o demanar viatge"
              onClick={() => navigate('/notes')}
              iconColor="var(--sdp-accent)"
            />
            <UniversalIndicatorCard 
              icon={<PawPrint size={40} strokeWidth={1.5} />}
              title="Animalets perduts"
              subtitle="Cercar els propietaris"
              onClick={() => navigate('/notes')}
              iconColor="var(--sdp-accent)"
            />
            <UniversalIndicatorCard 
              icon={<MessageCircle size={40} strokeWidth={1.5} />}
              title="Publicar al Xat"
              subtitle="Crear anunci per a grups"
              onClick={() => navigate('/notes')}
              iconColor="var(--sdp-accent)"
            />
          </div>
        </section>

        {/* Eines i Recursos (Opcions secundàries) */}
        <section className="ctl-secondary-tools">
          <UniversalButton onClick={() => navigate('/xat/0001')} variant="primary" icon={<MessageSquare size={18} />}>
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
