/**
 * identitat.js — Font única de la identitat.
 *
 * REGLA: si hi ha sessió, la identitat és la de la sessió. El convidat només
 * existix mentre no s'ha entrat, i mai substituix un usuari real.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * CORRECCIÓ P0 (260908) · EL CISMA DE LA SESSIÓ
 *
 * Hi havia dues meitats d'un mateix sistema d'autenticació que no es parlaven.
 * La capa efímera es va afegir a l'auditoria 260829 per al verificador PKCE;
 * després algú hi va moure també els tokens, però ni el `user`, ni la lectura
 * d'`identitat()`, ni el `logout()` van fer el mateix viatge:
 *
 *   ESCRIPTURA   _renova() i bescanvia()
 *                  jwt           → setEfimer  (sessionStorage)
 *                  refresh-token → setEfimer  (sessionStorage)
 *                  user          → setVal     (emmagatzematge local)   ← desaparellat
 *
 *   LECTURA      buildHeaders()  → getEfimer  ✓
 *                identitat()     → getVal     ✗  no el trobava MAI
 *
 *   ESBORRAT     logout()        → delVal × 3 ✗  no esborrava cap token
 *
 * Tres conseqüències reals, no teòriques:
 *
 *   1 · `getDefaultUserId()` tornava SEMPRE l'uuid de convidat, encara que la
 *       sessió estiguera oberta. `identitat()` buscava el jwt a emmagatzematge local,
 *       on no ha estat mai.
 *
 *   2 · `logout()` no tancava res. Esborrava tres claus de emmagatzematge local; el jwt
 *       i el refresh-token es quedaven vius a sessionStorage i la petició
 *       següent els tornava a usar. El botó d'eixir era decoratiu.
 *
 *   3 · SESSIÓ FANTASMA, la pitjor de les tres. En tancar la pestanya moria el
 *       sessionStorage però el `user` de emmagatzematge local sobrevivia. En tornar:
 *       `getCurrentUser()` tornava una persona, la interfície es pintava com si
 *       hagueres entrat, `buildHeaders()` enviava la clau anònima i CADA
 *       escriptura moria amb un 42501 de RLS. L'usuari veu que està dins i no
 *       pot fer res, sense cap missatge que explique per què.
 *
 * DECISIÓ: les tres peces de la sessió viuen a la MATEIXA capa, l'efímera.
 * Un token que mor amb la pestanya i un usuari que sobreviu no són una sessió:
 * són dues sessions distintes fingint que són una. El preu és tornar a entrar
 * en obrir el navegador; l'alternativa era baixar els tokens a emmagatzematge local, i
 * a un origen de WordPress compartit amb Sollutia i qualsevol altre connector
 * això és regalar la sessió a qui vullga llegir-la.
 * ══════════════════════════════════════════════════════════════════════════
 */
import { getVal, setVal, delVal, getEfimer, setEfimer, delEfimer } from '../config/storage.js';

/**
 * LES CLAUS VIUEN ACÍ I NOMÉS ACÍ.
 *
 * Estaven escrites a mà en quatre fitxers. Per això va ser possible moure'n
 * dues de capa i deixar-se'n una: no hi havia cap lloc on es veren juntes.
 */
export const CLAU_JWT = 'socdepoble-jwt';
export const CLAU_REFRESC = 'socdepoble-refresh-token';
export const CLAU_USUARI = 'socdepoble-user';

const CLAU_CONVIDAT = 'socdepoble-guest-session-id';
const UUID_NUL = '00000000-0000-0000-0000-000000000000';
const RE_UUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export function idConvidat() {
  if (typeof window === 'undefined') return UUID_NUL;
  try {
    let id = getVal(CLAU_CONVIDAT);
    if (!id || !RE_UUID.test(String(id).replace('guest-', ''))) {
      id = crypto?.randomUUID?.() || UUID_NUL;
      setVal(CLAU_CONVIDAT, id);
    } else if (String(id).startsWith('guest-')) {
      id = String(id).replace('guest-', '');
      setVal(CLAU_CONVIDAT, id);
    }
    return id;
  } catch {
    return UUID_NUL;
  }
}

/**
 * Purga el `user` que va quedar a emmagatzematge local abans d'aquesta correcció.
 *
 * SIDE EFFECT DINS D'UNA LECTURA, I ÉS INTENCIONAT. Els testers que ja tenen
 * la Beta instal·lada porten el blob del GoTrue (amb el seu correu) a
 * emmagatzematge local. Si només canviàrem la capa de lectura, eixe blob es quedaria
 * allí per sempre, perquè només `logout()` el tocava i `logout()` ja no mira
 * emmagatzematge local. S'esborra la primera volta que algú òbriga l'app.
 */
function purgaLlegat() {
  if (typeof window === 'undefined') return;
  try {
    if (getVal(CLAU_USUARI, null)) {
      delVal(CLAU_USUARI);
      delVal(CLAU_JWT);
      delVal(CLAU_REFRESC);
    }
  } catch {
    /* Un navegador que no deixa escriure tampoc deixarà llegir res perillós. */
  }
}

/**
 * L'usuari de la sessió, o null.
 *
 * FAIL-CLOSED: sense jwt no hi ha usuari, encara que el blob hi siga. És el que
 * impedix la sessió fantasma. `getCurrentUser()` de supabaseBackend delega ací
 * perquè hi haja un sol lector i no es torne a obrir el cisma.
 */
export function usuariDeSessio() {
  purgaLlegat();
  const jwt = getEfimer(CLAU_JWT, null);
  if (!jwt) return null;
  const usuari = getEfimer(CLAU_USUARI, null);
  return usuari && usuari.id ? usuari : null;
}

/** Guarda la sessió sencera d'una sola volta. Les tres peces o cap. */
export function desaSessio(sessio) {
  if (!sessio?.access_token) return false;
  setEfimer(CLAU_JWT, sessio.access_token);
  setEfimer(CLAU_REFRESC, sessio.refresh_token);
  setEfimer(CLAU_USUARI, sessio.user);
  return true;
}

/** Esborra la sessió sencera. Les dues capes: la nova i el llegat. */
export function esborraSessio() {
  delEfimer(CLAU_JWT);
  delEfimer(CLAU_REFRESC);
  delEfimer(CLAU_USUARI);
  /* El llegat també, perquè qui tanque sessió no s'emporte el fantasma. */
  delVal(CLAU_JWT);
  delVal(CLAU_REFRESC);
  delVal(CLAU_USUARI);
}

/** Torna { id, autenticat, usuari }. Mai llança. */
export function identitat() {
  const usuari = usuariDeSessio();
  if (usuari) return { id: String(usuari.id), autenticat: true, usuari };
  return { id: idConvidat(), autenticat: false, usuari: null };
}

export const getDefaultUserId = () => identitat().id;

/** Oblida el convidat quan ja no fa falta (part del protocol d'Apoptosi). */
export function oblidaConvidat() {
  delVal(CLAU_CONVIDAT);
}

export async function reclamaContingutDelConvidat() {
  // Mode Online-First: la persistència recau completament en el backend.
  return { migrat: 0 };
}
