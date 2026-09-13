import { useMemo } from 'react';
import { useContent } from '../../components/universal/UniversalElements';
import { PerfilProvider, usePerfil, ajustosPersona, ajustosOrganitzacio } from './PerfilContext.jsx';
import DetallAjust from './DetallAjust.jsx';
import perfilStyles from './PerfilShell.css?inline';
import { useUI } from '../../app/contexts/UIContext';
import { UniversalManager } from '../../components/universal/manager/UniversalManager';
import { UserRound, Building2, Lock } from 'lucide-react';

function PerfilManagerInner() {
  const { 
    identitats,
    guardarAjust,
    guardarCampPerfil
  } = usePerfil();

  const totsElsAjustos = useMemo(() => {
    return identitats.flatMap(identitat => {
      const ajustosIdentitat = identitat.mena === 'persona' 
        ? ajustosPersona(identitat.dades || {}) 
        : ajustosOrganitzacio(identitat.dades || {});
      return ajustosIdentitat.map(a => ({
        ...a,
        uniqueId: `${identitat.id}-${a.id}`,
        identitatId: identitat.id,
        identitatMena: identitat.mena,
        identitatNom: identitat.nom
      }));
    });
  }, [identitats]);

  const facets = useMemo(() => [
    {
      id: 'identitat',
      label: 'Identitat',
      options: identitats.map(i => ({
        value: i.id,
        label: i.nom
      })),
      getValue: item => item?.identitatId
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
            identitat={identitats.find(i => i.id === item?.identitatId)} 
            guardarAjust={guardarAjust} 
            guardarCampPerfil={guardarCampPerfil}
          />
        )}
        onActionCreate={null}
      />
    </div>
  );
}

export default function PerfilShell() {
  const { externalConfig } = useUI();
  const contentContext = useContent();
  const config = contentContext?.config || externalConfig || {};

  return (
    <>
      <style data-perfil-styles>{perfilStyles}</style>
      <PerfilProvider config={config}>
        <PerfilManagerInner />
      </PerfilProvider>
    </>
  );
}
