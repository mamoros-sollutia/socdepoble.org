import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, listMyOrganizations } from '../../data/backendPort.js';

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

function ajustosPersona() {
  return [
    { id: 'nom', titol: 'Nom', camp: 'full_name', obert: true },
    { id: 'correu', titol: 'Correu electrònic', obert: false,
      motiu: 'El correu identifica el compte. Es canvia des d’Accedir.' },
    { id: 'privacitat', titol: 'Privacitat', valor: 'Privat', obert: false,
      motiu: 'El perfil d’una persona és sempre privat. No es pot fer públic.' },
    { id: 'sessio', titol: 'Tancar sessió', obert: true, accio: 'logout' }
  ];
}

function ajustosOrganitzacio(org) {
  const mana = org.role === 'owner' || org.role === 'admin';
  const tancat = 'Només qui administra aquesta organització ho pot canviar.';
  return [
    { id: 'nom', titol: 'Nom', camp: 'name', valor: org.name, obert: mana, motiu: tancat },
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

export function PerfilProvider({ children }) {
  const [usuari, setUsuari] = useState(null);
  const [organitzacions, setOrganitzacions] = useState([]);
  const [carregant, setCarregant] = useState(true);
  const [error, setError] = useState(null);

  const [identitatId, setIdentitatId] = useState('jo');
  const [ajustId, setAjustId] = useState(null);
  /* 'identitats' | 'ajustos' | 'detall' — només mana en pantalla estreta.
     En ample les tres columnes es veuen alhora i açò no s'usa. */
  const [panellObert, setPanellObert] = useState('ajustos');

  useEffect(() => {
    let viu = true;
    setUsuari(getCurrentUser());
    listMyOrganizations()
      .then((files) => { if (viu) setOrganitzacions(Array.isArray(files) ? files : []); })
      .catch((e) => { if (viu) setError(e?.message || 'No s’han pogut carregar les organitzacions.'); })
      .finally(() => { if (viu) setCarregant(false); });
    return () => { viu = false; };
  }, []);

  const identitats = useMemo(() => ([
    {
      id: 'jo',
      mena: 'persona',
      nom: usuari?.user_metadata?.name || usuari?.user_metadata?.full_name || 'El meu compte',
      rol: 'Persona'
    },
    ...organitzacions.map((o) => ({
      id: o.id,
      mena: o.kind === 'group' ? 'grup' : 'empresa',
      nom: o.name,
      rol: o.role === 'owner' ? 'Propietari' : o.role === 'admin' ? 'Administra' : 'Membre',
      dades: o
    }))
  ]), [usuari, organitzacions]);

  const identitat = identitats.find((i) => i.id === identitatId) || identitats[0];
  const ajustos = identitat?.mena === 'persona'
    ? ajustosPersona()
    : ajustosOrganitzacio(identitat?.dades || {});
  const ajust = ajustos.find((a) => a.id === ajustId) || null;

  /* Canviar d'identitat no navega: filtra. Una persona gran no ha
     d'aprendre dues jerarquies per fer una cosa. */
  function triaIdentitat(id) {
    setIdentitatId(id);
    setAjustId(null);
    setPanellObert('ajustos');
  }

  function triaAjust(id) {
    setAjustId(id);
    setPanellObert('detall');
  }

  const valor = {
    usuari, identitats, identitat, ajustos, ajust,
    carregant, error,
    panellObert, setPanellObert,
    triaIdentitat, triaAjust
  };

  return <PerfilContext.Provider value={valor}>{children}</PerfilContext.Provider>;
}
