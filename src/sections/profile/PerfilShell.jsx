import { useMemo } from 'react';
import { UniversalPage } from '../../components/universal/UniversalPage';
import { useContent } from '../../components/universal/UniversalElements';
import { PerfilProvider, usePerfil, ajustosPersona, ajustosOrganitzacio } from './PerfilContext.jsx';
import DetallAjust from './DetallAjust.jsx';
import perfilStyles from './PerfilShell.css?inline';
import { useUI } from '../../app/contexts/UIContext';
import { UniversalManager } from '../../components/universal/manager/UniversalManager';
import { UserRound, Building2, Lock } from 'lucide-react';

function PerfilManagerInner() {
  const { identitats, guardarAjust } = usePerfil();

  const totsElsAjustos = useMemo(() => {
    return identitats.flatMap(id => {
      const aj = id.mena === 'persona' ? ajustosPersona(id.dades || {}) : ajustosOrganitzacio(id.dades || {});
      return aj.map(a => ({ ...a, uniqueId: `${id.id}-${a.id}`, identitatId: id.id, identitatMena: id.mena }));
    });
  }, [identitats]);

  const facets = useMemo(() => [
    {
      id: 'identitat',
      label: 'IDENTITATS',
      type: 'flat',
      options: identitats.map(i => ({
        id: i.id,
        label: i.nom,
        icon: i.mena === 'persona' ? UserRound : Building2
      })),
      getValue: item => item.identitatId
    }
  ], [identitats]);

  return (
    <div className="sdp-gestor-pagina">
      <UniversalManager
        items={totsElsAjustos}
        facets={facets}
        facetsTitle="IDENTITATS"
        getItemId={item => item.uniqueId}
        getItemSearchText={item => item.titol}
        initialActiveFacets={{ identitat: 'jo' }}
        getItemCard={(ajust) => ({
          titol: ajust.titol,
          subtitol: ajust.id === 'avatar' ? '' : (ajust.valor || (ajust.obert ? '' : ajust.motiu)),
          imatge: ajust.id === 'avatar' ? ajust.valor : undefined,
          icona: !ajust.obert ? Lock : ajust.identitatMena === 'persona' ? UserRound : Building2,
        })}
        renderDetail={(item) => (
          <DetallAjust 
            ajust={item} 
            identitat={identitats.find(i => i.id === item.identitatId)} 
            guardarAjust={guardarAjust} 
          />
        )}
        onActionCreate={null}
      />
    </div>
  );
}

export default function PerfilShell() {
  const { t, externalConfig } = useUI();
  const contentContext = useContent();
  const config = contentContext?.config || externalConfig || {};

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
          <PerfilManagerInner />
        </PerfilProvider>
      </UniversalPage>
    </>
  );
}
