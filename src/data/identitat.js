/**
 * identitat.js — Font única de la identitat.
 *
 * REGLA: si hi ha sessió, la identitat és la de la sessió. El convidat
 * només existix mentre no s'ha entrat, i mai substituix un usuari real.
 */
import { getVal, setVal, delVal } from '../config/storage.js';


const CLAU_CONVIDAT = 'socdepoble-guest-session-id';

export function idConvidat() {
  if (typeof window === 'undefined') return '00000000-0000-0000-0000-000000000000';
  try {
    let id = getVal(CLAU_CONVIDAT);
    if (!id) {
      id = crypto?.randomUUID?.() || '00000000-0000-0000-0000-000000000000'; // Fallback per entorns estranys
      setVal(CLAU_CONVIDAT, id);
    }
    return id;
  } catch {
    return '00000000-0000-0000-0000-000000000000';
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

export async function reclamaContingutDelConvidat(idReal) {
  // Mode Online-First: la persistència recau completament en el backend de Sollutia.
  return { migrat: 0 };
}
