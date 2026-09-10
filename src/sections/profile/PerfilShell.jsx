import { UniversalPage } from '../../components/universal/UniversalPage';
import { useContent } from '../../components/universal/UniversalElements';
import { PerfilProvider } from './PerfilContext.jsx';
import SelectorIdentitat from './SelectorIdentitat.jsx';
import LlistaAjustos from './LlistaAjustos.jsx';
import DetallAjust from './DetallAjust.jsx';
import perfilStyles from './PerfilShell.css?inline';
import AppGridShell from '../../components/layout/AppGridShell';
import { useUIActions } from '../../app/contexts/UIContext';

export default function PerfilShell() {
  const { t } = useUIActions();
  const contentContext = useContent();
  const config = contentContext?.config || {};

  return (
    <>
      <UniversalPage
        title={t('section.perfil.title', 'El meu compte')}
        chrome="none"
        variant="embed"
        noPadding
      >
        <style data-perfil-styles>{perfilStyles}</style>
        <PerfilProvider config={config}>
          <AppGridShell
             leftColumn={<SelectorIdentitat />}
             middleColumn={<LlistaAjustos />}
             rightColumn={<DetallAjust />}
             leftTitle="IDENTITATS"
             middleTitle="AJUSTOS"
             initialPane="left"
             aria-label="Gestor de perfils i identitats"
          />
        </PerfilProvider>
      </UniversalPage>
    </>
  );
}
