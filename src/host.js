/**
 * host.js — LA PRESA DE CORRENT DE SÓC DE POBLE
 *
 * EL PROBLEMA QUE RESOL (auditoria 260830)
 * ────────────────────────────────────────
 * `backendPort.js` està ben fet: cap mòdul importa `supabaseBackend.js`
 * directament, tot passa pel port, i el pany s'arma. Però la Llei de
 * l'Enxufabilitat (AGENTS.md §8) era **inassolible a la pràctica**, per tres
 * barreres acumulades:
 *
 *   1 · `setBackendImplementation` no s'exposava a cap global. Zero
 *       assignacions `window.*` en tot `src/`.
 *   2 · El build de WordPress és `soc-de-poble.standalone.js`, i el plugin
 *       declara explícitament que NO és un mòdul ESM. Sense ESM i sense
 *       global, no hi ha cap superfície de crida des de fora.
 *   3 · Encara que n'hi haguera: `freezeImplementation()` es crida dins de
 *       `connectedCallback`, que dispara SÍNCRONAMENT durant
 *       `customElements.define()` quan l'etiqueta ja és al DOM — que és
 *       exactament el cas del plugin. La finestra d'injecció era de zero
 *       mil·lisegons.
 *
 * El port existia, era correcte, i estava soldat per dins.
 *
 * L'ARQUITECTURA NOVA: ARRENCADA EN DUES FASES
 * ────────────────────────────────────────────
 * El pany segueix sent innegociable — un backend injectable després del
 * muntatge seria un vector d'atac. El que canvia és QUAN es tanca:
 *
 *   Fase 1 · CONFIGURACIÓ   El host pot cridar `configura({ backend })`.
 *                           L'element encara no està definit.
 *   Fase 2 · SEGELLAT       `arrenca()` congela el backend i defineix
 *                           l'element. A partir d'ací, res es pot injectar.
 *
 * Per a WordPress, que necessita arrencada sense configuració, `arrencaAuto()`
 * fa la fase 2 sola en el següent tick. Un `<script>` del host col·locat
 * després del bundle encara arriba a temps per a la fase 1, perquè el tick
 * no s'ha consumit.
 *
 * COM L'USA SOLLUTIA
 * ──────────────────
 *   import { configura, arrenca } from 'socdepoble';
 *
 *   configura({
 *     backend: {
 *       loadAppData:      (...a) => elMeuBackend.carrega(...a),
 *       appendChatMessages: (...a) => elMeuBackend.xat(...a),
 *       getCurrentUser:   () => elMeuBackend.usuari(),
 *       // …la resta del contracte; el que no es passe cau a Supabase.
 *     },
 *   });
 *   arrenca();
 *
 * Per a substituir Supabase del tot (l'objectiu d'integració amb Sollutia), es passa el
 * contracte sencer i `supabaseBackend.js` deixa de tocar-se en temps d'execució.
 *
 * COM L'USA WORDPRESS (cap canvi al plugin)
 * ─────────────────────────────────────────
 *   El build standalone acaba cridant `arrencaAuto()`. Si ningú ha configurat
 *   res, s'arrenca amb Supabase, exactament com fins ara.
 *
 * NOTA D'HONESTEDAT
 * ─────────────────
 * El cicle de vida dels Custom Elements no s'ha pogut provar en aquest entorn
 * (no hi ha navegador ni node_modules). L'estructura del mòdul i l'ordre de
 * crides sí que estan raonats contra el codi real de `PedraSecaEmbed.jsx`,
 * però la fase 2 s'ha de verificar en un navegador abans de donar-la per bona.
 * Vegeu `tooling/gates/tractor-enxufe.mjs` per a la comprovació estàtica.
 */

import { setBackendImplementation, freezeImplementation, getBackendImplementation } from './data/backendPort.js';
import { defineCustomElement } from './PedraSecaEmbed.jsx';

/* ═══════════════════════ Estat de l'arrencada ═══════════════════════ */

const FASE = { CONFIGURABLE: 'configurable', SEGELLAT: 'segellat' };
let fase = FASE.CONFIGURABLE;
let autoProgramada = false;

/** Mètodes que un backend complet ha d'oferir. Documenta el contracte. */
export const CONTRACTE_BACKEND = Object.freeze([
  'loadAppData',
  'appendChatMessages',
  'appendSectionSubmissionNetworkOnly',
  'updateNote',
  'registerWithEmail',
  'loginWithEmail',
  'loginWithGoogle',
  'recullTornadaOAuth',
  'logout',
  'getCurrentUser',
  'getBackendConfigurat',
  'getRuntimeDataMode',
  'normalizeDataMode',
  'getDefaultUserId'
]);

/* ═══════════════════════ Fase 1 · Configuració ═══════════════════════ */

/**
 * Injecta una implementació de backend abans del segellat.
 *
 * Mode estricte: la injecció ha de proveir el contracte sencer per a
 * evitar barreges perilloses entre Supabase i el nou backend de Sollutia.
 *
 * @param {{backend?: Record<string, Function>}} opcions
 * @returns {{acceptats: string[], desconeguts: string[], pendents: string[]}}
 * @throws {Error} si ja s'ha segellat
 */
export function configura({ backend } = {}) {
  if (fase === FASE.SEGELLAT) {
    throw new Error(
      "[host] Ja s'ha cridat arrenca(): el backend està segellat. "
      + 'Crida configura() abans d\'arrenca(), o abans que el bundle programe l\'arrencada automàtica.',
    );
  }
  if (!backend || typeof backend !== 'object') {
    return { acceptats: [], desconeguts: [], pendents: [...CONTRACTE_BACKEND] };
  }

  const claus = Object.keys(backend);
  const desconeguts = claus.filter((k) => !CONTRACTE_BACKEND.includes(k));
  const acceptats = claus.filter((k) => CONTRACTE_BACKEND.includes(k) && typeof backend[k] === 'function');

  // Els mètodes desconeguts no s'injecten en silenci: un error d'escriptura
  // en un nom de mètode és una fallada muda que costa hores de trobar.
  if (desconeguts.length) {
    console.warn(`[host] Mètodes fora del contracte, ignorats: ${desconeguts.join(', ')}.`
      + ` Contracte vàlid: ${CONTRACTE_BACKEND.join(', ')}`);
  }
  const noFuncions = claus.filter((k) => CONTRACTE_BACKEND.includes(k) && typeof backend[k] !== 'function');
  if (noFuncions.length) {
    throw new Error(`[host] Aquests membres del contracte no són funcions: ${noFuncions.join(', ')}`);
  }

  setBackendImplementation(Object.fromEntries(acceptats.map((k) => [k, backend[k]])));
  return { acceptats, desconeguts, pendents: CONTRACTE_BACKEND.filter((k) => !acceptats.includes(k)) };
}

/* ═══════════════════════ Fase 2 · Segellat ═══════════════════════ */

/**
 * Congela el backend i defineix `<soc-de-poble>`. Idempotent.
 *
 * A partir d'ací `configura()` llança. Aquest és el punt on abans es feia el
 * `freezeImplementation()` — dins de `connectedCallback` — i per això no hi
 * havia finestra d'injecció.
 *
 * @returns {{fase: string, backend: string[]}}
 */
export async function arrenca() {
  if (fase === FASE.SEGELLAT) return { fase, backend: Object.keys(getBackendImplementation()) };
  
  const currentInjected = getBackendImplementation();
  const injectedKeys = Object.keys(currentInjected);
  
  if (injectedKeys.length > 0) {
    // Si s'ha injectat un backend, exigim que siga complet (mode estricte)
    const pendents = CONTRACTE_BACKEND.filter(k => !injectedKeys.includes(k));
    if (pendents.length > 0) {
      throw new Error(`[host] Injecció incompleta. No es permet fusió amb Supabase. Falten mètodes: ${pendents.join(', ')}`);
    }
  } else {
    // Si no hi ha cap injecció, carreguem el backend per defecte
    try {
      const supabaseImpl = await import('./data/supabaseBackend.js');
      setBackendImplementation(supabaseImpl);
    } catch (e) {
      console.error('[host] Error fatal carregant el backend per defecte:', e);
    }
  }

  freezeImplementation();
  fase = FASE.SEGELLAT;
  defineCustomElement();
  return { fase, backend: Object.keys(getBackendImplementation()) };
}

/**
 * Arrencada automàtica per als entorns que no configuren res (WordPress).
 *
 * Es programa per al següent tick de microtasques en compte de fer-se de
 * seguida: així un `<script>` del host col·locat DESPRÉS del bundle encara
 * arriba a temps de cridar `configura()`. És la diferència entre una finestra
 * d'injecció de zero mil·lisegons i una d'utilitzable.
 */
export function arrencaAuto() {
  if (autoProgramada || fase === FASE.SEGELLAT) return;
  autoProgramada = true;
  const fes = () => { if (fase !== FASE.SEGELLAT) arrenca(); };
  if (typeof document !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(fes, 0), { once: true });
  } else {
    setTimeout(fes, 0);
  }
}

/** Estat actual, per a diagnòstic des de la consola del host. */
export function estat() {
  return {
    fase,
    configurable: fase === FASE.CONFIGURABLE,
    contracte: CONTRACTE_BACKEND,
    implementat: Object.keys(getBackendImplementation()),
  };
}

/* ═══════════════════════ Superfície global ═══════════════════════ */

/**
 * El build standalone no és ESM, així que un host que el carregue amb un
 * `<script>` pla necessita un global. És l'ÚNICA assignació a `window` del
 * projecte i està declarada ací, no escampada.
 *
 * `tooling/gates/tractor-enxufe.mjs` verifica que aquest objecte exposa
 * exactament l'API pública i res més.
 */
export function exposaGlobal(objectiu = (typeof window !== 'undefined' ? window : undefined)) {
  if (!objectiu) return null;
  const api = Object.freeze({ configura, arrenca, estat, CONTRACTE_BACKEND });
  Object.defineProperty(objectiu, 'SocDePoble', { value: api, writable: false, configurable: false });
  return api;
}
