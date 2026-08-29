/**
 * identitat.js — Font única de la identitat.
 *
 * REGLA: si hi ha sessió, la identitat és la de la sessió. El convidat
 * només existix mentre no s'ha entrat, i mai substituix un usuari real.
 */
import { getVal, setVal, delVal } from '../config/storage.js';
import { getSnapshot, saveSnapshot, canviaPropietari } from './outbox.js';

const CLAU_CONVIDAT = 'socdepoble-guest-session-id';

export function idConvidat() {
  if (typeof window === 'undefined') return 'foraster';
  try {
    let id = getVal(CLAU_CONVIDAT);
    if (!id) {
      id = 'guest-' + (crypto?.randomUUID?.() ??
        Date.now().toString(36) + Math.random().toString(36).slice(2));
      setVal(CLAU_CONVIDAT, id);
    }
    return id;
  } catch {
    return 'foraster';
  }
}

/** Torna { id, autenticat }. Mai llança. */
export function identitat() {
  const usuari = getVal('socdepoble-user', null);
  const jwt = getVal('socdepoble-jwt', null);
  const id = usuari && usuari.id ? String(usuari.id) : null;
  if (id && jwt) return { id, autenticat: true, usuari };
  return { id: idConvidat(), autenticat: false, usuari: null };
}

export const getDefaultUserId = () => identitat().id;

/** Oblida el convidat quan ja no fa falta (part del protocol d'Apoptosi). */
export function oblidaConvidat() {
  delVal(CLAU_CONVIDAT);
}

const CLAUS_MIGRABLES = [
  'socdepoble-app-snapshot-v1',
  'socdepoble-dev-chat-messages',
  'socdepoble-section-submissions-v1'
];

/**
 * Trasllada el contingut del bagul del convidat al de l'usuari real.
 * Idempotent: si el destí ja existix, no toca res.
 */
export async function reclamaContingutDelConvidat(idReal) {
  const idVell = getVal(CLAU_CONVIDAT);
  if (!idVell || idVell === idReal) return { migrat: 0 };
  let migrat = 0;
  for (const base of CLAUS_MIGRABLES) {
    try {
      const desti = await getSnapshot(`${base}-${idReal}`);
      if (desti) continue;
      const origen = await getSnapshot(`${base}-${idVell}`);
      if (!origen) continue;
      await saveSnapshot(`${base}-${idReal}`, origen);
      migrat += 1;
    } catch (e) {
      console.warn('[IDENTITAT] Migració fallida per a', base, e);
    }
  }
  try {
    const tramesCanviades = await canviaPropietari(idVell, idReal);
    if (tramesCanviades > 0) migrat += tramesCanviades;
  } catch (e) {
    console.warn('[IDENTITAT] Fallada reescrivint propietari a l\'outbox', e);
  }
  return { migrat };
}
