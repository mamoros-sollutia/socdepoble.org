import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { getCurrentUser, listMyOrganizations, updateOrganization, updateProfile, updateUserPassword, getProfile, createOrganization } from '../../data/backendPort.js';

const PerfilContext = createContext(null);

export function usePerfil() {
  const ctx = useContext(PerfilContext);
  if (!ctx) throw new Error('usePerfil fora de PerfilProvider');
  return ctx;
}

/* ═══════════════════════════════════════════════════════════════════
   CATÀLEG D'AJUSTOS

   Cada fila declara si està oberta i, si no ho està, per què. La
   interfície no pot prometre res que el contracte del servidor no
   complisca: un botó que fa `permission denied` en silenci és pitjor
   que una fila desactivada amb el motiu escrit.

   `obert` es deriva del rol i del que les polítiques RLS permeten
   de veres, no del que voldríem que permeteren.
   ═══════════════════════════════════════════════════════════════════ */

function ajustosPersona(perfil = {}) {
  return [
    { id: 'nom', titol: 'Nom', camp: 'full_name', valor: perfil.full_name || '', obert: true },
    { id: 'avatar', titol: 'Foto de perfil', camp: 'avatar_url', valor: perfil.avatar_url || '', obert: true },
    { id: 'correu', titol: 'Correu electrònic', obert: false,
      motiu: 'El correu identifica el compte. Es canvia des d’Accedir.' },
    { id: 'privacitat', titol: 'Estat del perfil', valor: perfil.is_public ? 'Públic' : 'Privat', obert: true,
      motiu: 'Tria si vols ser visible a la gent del poble o mantindre el compte privat.' },
    { id: 'contrasenya', titol: 'Contrasenya', valor: '******', obert: true },
    { id: 'sessio', titol: 'Tancar sessió', obert: true, accio: 'logout' }
  ];
}

function ajustosOrganitzacio(org) {
  const mana = org.role === 'owner' || org.role === 'admin';
  const tancat = 'Només qui administra aquesta organització ho pot canviar.';
  return [
    { id: 'nom', titol: 'Nom', camp: 'name', valor: org.name, obert: mana, motiu: tancat },
    { id: 'avatar', titol: 'Foto / Logotip', camp: 'logo_url', valor: org.logo_url, obert: mana, motiu: tancat },
    { id: 'lema', titol: 'Lema', camp: 'lema', valor: org.lema, obert: mana, motiu: tancat },
    { id: 'descripcio', titol: 'Descripció', camp: 'description', valor: org.description, obert: mana, motiu: tancat },
    { id: 'membres', titol: 'Membres', obert: mana, motiu: tancat },
    { id: 'identificador', titol: 'Identificador', valor: org.slug, obert: false,
      motiu: 'L’identificador és permanent: hi ha enllaços publicats que hi apunten.' },
    { id: 'fitxa', titol: 'Fitxa pública', valor: `/${org.kind === 'group' ? 'grup' : 'empresa'}/${org.slug}`, obert: true, accio: 'obrir-fitxa' },
    { id: 'eixir', titol: 'Eixir de l’organització', obert: org.role !== 'owner',
      motiu: 'Qui és propietari no pot eixir-se’n: primer ha de traspassar la propietat.', accio: 'eixir' }
  ];
}

export function PerfilProvider({ children, config = {} }) {
  const [usuari, setUsuari] = useState(null);
  const [dadesPerfil, setDadesPerfil] = useState(null);
  const [organitzacions, setOrganitzacions] = useState([]);
  const [carregant, setCarregant] = useState(true);
  const [error, setError] = useState(null);

  const [identitatId, setIdentitatId] = useState('jo');
  const [ajustId, setAjustId] = useState(null);

  useEffect(() => {
    let viu = true;
    setUsuari(getCurrentUser());
    
    Promise.all([
      listMyOrganizations(config),
      getProfile(config)
    ])
      .then(([files, perfil]) => { 
        if (viu) {
          setOrganitzacions(Array.isArray(files) ? files : []); 
          setDadesPerfil(perfil);
        }
      })
      .catch((e) => { if (viu) setError(e?.message || 'No s’han pogut carregar les organitzacions.'); })
      .finally(() => { if (viu) setCarregant(false); });
    return () => { viu = false; };
  }, []);

  const identitats = useMemo(() => ([
    {
      id: 'jo',
      mena: 'persona',
      nom: dadesPerfil?.full_name || usuari?.user_metadata?.name || usuari?.user_metadata?.full_name || 'El meu compte',
      avatar: dadesPerfil?.avatar_url || usuari?.user_metadata?.avatar_url,
      rol: 'Persona',
      dades: dadesPerfil
    },
    ...organitzacions.map((o) => ({
      id: o.id,
      mena: o.kind === 'group' ? 'grup' : 'empresa',
      nom: o.name,
      avatar: o.logo_url,
      rol: o.role === 'owner' ? 'Propietari' : o.role === 'admin' ? 'Administra' : 'Membre',
      dades: o
    }))
  ]), [usuari, organitzacions, dadesPerfil]);

  const identitat = identitats.find((i) => i.id === identitatId) || identitats[0];

  /* Memoitzat a posta. Si `ajustos` es reconstruïx a cada render, `ajust`
     canvia d'identitat i el useEffect de DetallAjust es dispara sol: buida
     el camp i esborra el missatge de "Desat correctament". */
  const ajustos = useMemo(() => (
    identitat?.mena === 'persona'
      ? ajustosPersona(identitat?.dades || {})
      : ajustosOrganitzacio(identitat?.dades || {})
  ), [identitat?.mena, identitat?.dades]);

  const ajust = useMemo(
    () => ajustos.find((a) => a.id === ajustId) || null,
    [ajustos, ajustId]
  );

  /* Canviar d'identitat no navega: filtra. Una persona gran no ha
     d'aprendre dues jerarquies per fer una cosa. */
  function triaIdentitat(id) {
    setIdentitatId(id);
    setAjustId(null);
  }

  const triaAjust = useCallback((id) => {
    setAjustId(id);
  }, []);

  async function guardarAjust(camp, valor) {
    if (!identitat) throw new Error('Cap identitat seleccionada');
    
    const ajustEfectiu = ajust || ajustos.find((a) => a.camp === camp || a.id === camp);
    if (!ajustEfectiu || !ajustEfectiu.obert) throw new Error('Aquest ajust no es pot modificar');

    const campEfectiu = ajustEfectiu.camp || camp;

    if (identitat.mena === 'persona') {
      if (ajustEfectiu.id === 'contrasenya') {
        await updateUserPassword(valor, config);
      } else {
        const dadesNovamentRebudes = await updateProfile({ [campEfectiu]: valor }, config);
        /* `identitats` prioritza dadesPerfil sobre user_metadata. Si només
           refresquem user_metadata, la llista continua mostrant el nom vell
           i el desat sembla que no ha fet res. */
        setDadesPerfil(prev => ({ ...prev, ...(dadesNovamentRebudes || {}), [campEfectiu]: valor }));
        setUsuari(prev => ({
          ...prev,
          user_metadata: { ...prev?.user_metadata, [campEfectiu]: valor, name: dadesNovamentRebudes?.full_name }
        }));
      }
    } else {
      const novesDades = await updateOrganization(identitat.id, { [campEfectiu]: valor }, config);
      setOrganitzacions(prev => prev.map(o => o.id === identitat.id ? { ...o, ...novesDades } : o));
    }
  }

  /* El botó "+" de la columna d'identitats. Existix perquè
     createOrganization sí que està implementat de punta a punta
     (backendPort → supabaseBackend → rpc create_organization).
     Si no ho estiguera, este botó no s'hauria d'haver pintat. */
  const creaOrganitzacio = useCallback(async (dades) => {
    const nova = await createOrganization(dades || { name: 'Organització nova', kind: 'group' }, config);
    setOrganitzacions((prev) => [...prev, nova]);
    setIdentitatId(nova.id);
    setAjustId(null);
    return nova;
  }, [config]);

  const valor = {
    usuari, identitats, identitat, ajustos, ajust,
    carregant, error,
    triaIdentitat, triaAjust, guardarAjust, creaOrganitzacio
  };

  return <PerfilContext.Provider value={valor}>{children}</PerfilContext.Provider>;
}
