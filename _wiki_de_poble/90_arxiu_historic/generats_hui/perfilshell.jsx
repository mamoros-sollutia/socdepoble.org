import { UniversalPage } from '../../components/universal/UniversalComponents';
import { useAppData } from '../../app/AppDataContext';
import { PerfilProvider, usePerfil } from './PerfilContext.jsx';
import SelectorIdentitat from './SelectorIdentitat.jsx';
import LlistaAjustos from './LlistaAjustos.jsx';
import DetallAjust from './DetallAjust.jsx';
import './PerfilShell.css';

/* ═══════════════════════════════════════════════════════════════════
   LLEI D'ESTA CLOSCA

   Les tres columnes es munten SEMPRE. En pantalla estreta se n'amaga
   dues amb `data-visible="no"` (visibility, no display:none i mai un
   ternari que les lleve del DOM). Desmuntar el detall és el que feia
   perdre el cursor i l'scroll a l'editor de notes.
   ═══════════════════════════════════════════════════════════════════ */

function Columnes() {
  const { panellObert } = usePerfil();
  const veu = (quin) => (panellObert === quin ? 'si' : 'no');

  return (
    <div className="perfil-shell">
      <section className="perfil-columna" data-visible={veu('identitats')} aria-label="Identitats">
        <SelectorIdentitat />
      </section>
      <section className="perfil-columna" data-visible={veu('ajustos')} aria-label="Ajustos">
        <LlistaAjustos />
      </section>
      <section className="perfil-columna perfil-columna--detall" data-visible={veu('detall')} aria-label="Detall">
        <DetallAjust />
      </section>
    </div>
  );
}

export default function PerfilShell() {
  const { t } = useAppData();

  return (
    <UniversalPage
      title={t('section.perfil.title', 'El meu compte')}
      subtitle={t('section.perfil.subtitle', 'El teu perfil, les teues empreses i els teus grups, tot al mateix lloc.')}
      chrome="system"
      showLogos={true}
    >
      <PerfilProvider>
        <Columnes />
      </PerfilProvider>
    </UniversalPage>
  );
}
