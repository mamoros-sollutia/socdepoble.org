/**
 * src/config/theme.js — preferència de tema
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * DEFECTE CORREGIT
 *
 * La versió anterior feia:
 *
 *     root = document.querySelector('.sdp-root') || document.documentElement;
 *
 * `.sdp-root` viu DINS del shadow root, i `document.querySelector` no
 * travessa el Shadow DOM. Eixa consulta retornava `null` SEMPRE en
 * producció. El codi queia a `document.documentElement` i llegia el
 * `data-theme` de la pàgina de WordPress: si Sollutia posa el seu lloc en
 * fosc, el component se n'anava en fosc i ignorava la preferència de
 * l'usuari, perquè l'atribut de l'HTML tenia prioritat sobre localStorage.
 *
 * Ara la font de veritat és l'arrel que ens passen. Qui té el node és qui
 * sap on està; el mòdul no ho endevina consultant el document sencer.
 *
 * També s'han llevat `decode()` i `LEGACY_KEYS`: declarats i mai usats.
 */

export const THEME_KEY = 'sdp-theme';

const VALIDS = new Set(['light', 'dark', 'system']);

/**
 * Normalitza qualsevol node (Element, ShadowRoot, Document) a l'element que
 * porta l'atribut `data-theme`.
 */
function elementDeTema(arrel) {
  if (!arrel) return null;
  if (typeof ShadowRoot !== 'undefined' && arrel instanceof ShadowRoot) return arrel.host;
  if (arrel.nodeType === 9 /* Document */) return arrel.documentElement;
  if (arrel.nodeType === 1 /* Element */) return arrel;
  return null;
}

/**
 * Resol l'arrel de tema a partir d'un node qualsevol de dins del component.
 * Ús típic: `arrelDeTema(mainRef.current)`.
 */
export function arrelDeTema(node) {
  if (!node || typeof node.getRootNode !== 'function') return null;
  return elementDeTema(node.getRootNode());
}

/**
 * @param {string}  [configurat] valor explícit de la configuració (guanya sempre).
 * @param {Node}    [arrel]      shadow root, host o element contenidor.
 */
export function readThemePreference(configurat, arrel) {
  if (VALIDS.has(configurat)) return configurat;

  if (typeof window === 'undefined' || typeof document === 'undefined') return 'light';

  // 1. Atribut de la NOSTRA arrel — mai del document de l'amfitrió.
  const el = elementDeTema(arrel);
  const temaAtribut = el ? el.getAttribute('data-theme') : null;
  if (temaAtribut && VALIDS.has(temaAtribut)) return temaAtribut;

  // 2. Preferència persistida de l'usuari.
  try {
    const cru = window.localStorage.getItem(THEME_KEY);
    if (cru && VALIDS.has(cru)) return cru;
  } catch {
    // localStorage bloquejat (mode privat, iframe sense permisos): seguim.
  }

  // 3. Sense senyal propi: 'system' deixa decidir el sistema operatiu, no
  //    la pàgina de WordPress.
  return 'system';
}

export function resolveTheme(preferencia) {
  if (preferencia !== 'system') return VALIDS.has(preferencia) ? preferencia : 'light';
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function writeThemePreference(preferencia) {
  if (!VALIDS.has(preferencia)) return;
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(THEME_KEY, preferencia);
  } catch {
    // Sense persistència: el tema val només per a esta sessió.
  }
}

/** Escriu el tema resolt a l'arrel del component. Mai al document amfitrió. */
export function applyTheme(arrel, preferencia) {
  const el = elementDeTema(arrel);
  if (!el) return null;
  const resolt = resolveTheme(preferencia);
  el.setAttribute('data-theme', resolt);
  return resolt;
}
