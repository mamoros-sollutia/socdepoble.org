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
 *   2 · El build standalone declara explícitament que NO és un mòdul ESM.
 *       Sense ESM i sense global, no hi ha cap superfície de crida.
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
 * Per a entorns que necessiten arrencada sense configuració, `arrencaAuto()`
 * fa la fase 2 sola en el següent tick. Un `<script>` del host col·locat
 * després del bundle encara arriba a temps per a la fase 1, perquè el tick
 * no s'ha consumit.
 *
 * COM L'USA SOLLUTIA
 * ──────────────────
 * Si s'empra `type="module"`, el host carrega de forma diferida. Per evitar
 * curses, Sollutia ha d'esperar l'esdeveniment `socdepoble-ready` o
 * comprovar si ja està llest:
 *
 *   function bootSollutia() {
 *     window.SocDePoble.configura({ backend: { ... } });
 *     window.SocDePoble.arrenca();
 *   }
 *
 *   if (window.SocDePoble && window.SocDePoble.isReady) {
 *     bootSollutia();
 *   } else {
 *     window.addEventListener('socdepoble-ready', bootSollutia);
 *   }
 *
 * Per a substituir Supabase del tot (l'objectiu d'integració amb Sollutia), es passa el
 * contracte sencer i `supabaseBackend.js` deixa de tocar-se en temps d'execució.
 *
 * COM S'USA EN ENTORN ESTÀNDARD
 * ─────────────────────────────
 *   El build standalone acaba cridant `arrencaAuto()`. Si ningú ha configurat
 *   res, s'arrenca amb Supabase de forma autònoma.
 *
 * NOTA D'HONESTEDAT
 * ─────────────────
 * El cicle de vida dels Custom Elements no s'ha pogut provar en aquest entorn
 * (no hi ha navegador ni node_modules). L'estructura del mòdul i l'ordre de
 * crides sí que estan raonats contra el codi real de `PedraSecaEmbed.jsx`,
 * però la fase 2 s'ha de verificar en un navegador abans de donar-la per bona.
 * Vegeu `tooling/gates/tractor-enxufe.mjs` per a la comprovació estàtica.
 */

if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    console.error('[host] Error de xarxa en la càrrega diferida de mòduls Vite:', event);
    // El catch de l'arrenca pintarà això si passa durant l'arrencada, 
    // però això ens cobreix canvis de ruta asíncrons.
  });
}

import { setBackendImplementation, freezeImplementation, getBackendImplementation } from './data/backendPort.js';
import { defineCustomElement } from './PedraSecaEmbed.jsx';

/* ═══════════════════════ Estat de l'arrencada ═══════════════════════ */

const FASE = { CONFIGURABLE: 'configurable', SEGELLAT: 'segellat' };
let fase = FASE.CONFIGURABLE;
let autoProgramada = false;
let arrencada = null;

/** Mètodes que un backend complet ha d'oferir. Documenta el contracte. */
export const CONTRACTE_BACKEND = Object.freeze([
  'loadCoreContent',
  'loadMur',
  'loadXat',
  'loadMultimedia',
  'loadNotes',
  'appendChatMessages',
  'appendSectionSubmissionNetworkOnly',
  'updateNote',
  'loginWithMagicLink',
  'loginWithGoogle',
  'listMyOrganizations',
  'createOrganization',
  'updateOrganization',
  'updateProfile',
  'updateUserPassword',
  'getProfile',
  'recullTornadaOAuth',
  'logout',
  'getCurrentUser',
  'getBackendConfigurat',
  'getRuntimeDataMode',

  'getDefaultUserId',

  /* Xat v2 i Pont amb Notes (260908).
     Han d'estar ací o passen dues coses, no una:
       · tractor-enxufe.mjs (E2) anota un error per cada mètode que el port
         delega i el contracte no declara;
       · configura() els classifica com a "desconeguts" i NO els injecta, així
         que un host que els implemente es trobarà createNote apuntant al buit.
     El port i el contracte són la mateixa llista escrita dos voltes. Si en
     toques una, toca l'altra. */
  'createNote',
  'loadFils',
  'loadMissatges',
  'enviaMissatge',
  'marcaLlegit',

  /* Afegit 260908 amb el pegat correctiu del Xat v2.
     `crea_fil_directe` és l'única porta d'entrada a una conversa: la política
     "xat_participants_insercio" original no deixava inserir el primer
     participant (peix que es mossega la cua), i el seed només omple l'antiga
     `chat_threads`. Sense este mètode, `xat_fils` es queda buida per sempre. */
  'creaFilDirecte',

  /* Afegit 260908 amb el directori del poble.
     `crea_fil_directe` necessita l'uuid de l'altra persona i no hi havia cap
     manera d'obtindre'l: "profiles read own" només deixa llegir el teu perfil i
     `town_memberships` no té política de lectura per a tercers. Sense aquest
     mètode, el botó «Nova conversa» és impossible d'implementar. */
  'carregaMembres'
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
 * CURSA CORREGIDA (260903): `fase` es marcava DESPRÉS de l'`await import()`.
 * Durant eixa finestra:
 *   · un segon `arrenca()` travessava el guard i cridava `defineCustomElement()`
 *     dos voltes → NotSupportedError;
 *   · un `configura()` tardà passava net i després quedava sobreescrit en
 *   silenci pel backend de Supabase.
 * Ara el segellat es marca SÍNCRONAMENT i la faena asíncrona viu en una
 * promesa memoritzada.
 *
 * @returns {Promise<{fase: string, backend: string[]}>}
 */
export function arrenca() {
  if (arrencada) return arrencada;

  fase = FASE.SEGELLAT;

  arrencada = (async () => {
    const injectats = Object.keys(getBackendImplementation());

    if (injectats.length > 0) {
      // Mode estricte: si s'ha injectat, ha de ser el contracte sencer.
      const pendents = CONTRACTE_BACKEND.filter((k) => !injectats.includes(k));
      if (pendents.length > 0) {
        throw new Error(
          `[host] Injecció incompleta. No es permet fusió amb Supabase. Falten mètodes: ${pendents.join(', ')}`,
        );
      }
    } else {
      // Fail-closed: si el backend per defecte no carrega, NO congelem una
      // implementació buida ni pintem l'element. Abans es feia console.error
      // i es continuava: l'app es muntava sencera amb totes les crides de
      // dades fallant, que és pitjor que no muntar-se.
      const supabaseImpl = await import('./data/supabaseBackend.js');
      setBackendImplementation(supabaseImpl);
    }

    freezeImplementation();
    defineCustomElement();
    return { fase, backend: Object.keys(getBackendImplementation()) };
  })();

  return arrencada;
}

/**
 * Arrencada automàtica per als entorns que no configuren res.
 *
 * `setTimeout(…, 0)` és una MACROtasca, no una microtasca: la finestra
 * d'injecció és més ampla del que deia el comentari anterior. Tot i així
 * només arriba a temps un `<script>` SÍNCRON del host. Amb `defer`, `async`
 * o `type="module"` el host arriba tard i `configura()` llançarà.
 */
export function arrencaAuto() {
  if (autoProgramada || fase === FASE.SEGELLAT) return;
  autoProgramada = true;
  const fes = () => {
    if (fase === FASE.SEGELLAT) return;
    arrenca().catch((e) => {
      console.error('[host] Arrencada fallida. El component no es muntarà:', e);
      if (typeof document !== 'undefined') {
        const sdpTags = document.querySelectorAll('soc-de-poble');
        sdpTags.forEach(tag => {
          tag.innerHTML = `<div style="padding: 1.5rem; color: #b91c1c; background: #fee2e2; border: 1px solid #ef4444; margin: 1rem; border-radius: 6px; font-family: sans-serif;">
            <h3 style="margin-top: 0; font-size: 1.25rem;">Error crític d'arrencada</h3>
            <p style="margin-bottom: 0.5rem;">Sóc de Poble no ha pogut connectar amb el backend.</p>
            <pre style="white-space: pre-wrap; font-size: 0.875rem; background: rgba(255,255,255,0.5); padding: 0.5rem; border-radius: 4px;">${e.message || e}</pre>
          </div>`;
        });
      }
    });
  };
  if (typeof document !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(fes, 0), { once: true });
  } else {
    setTimeout(fes, 0);
  }
}

/**
 * Cedeix el control del segellat a l'amfitrió, aturant l'arrencada automàtica.
 * S'ha de cridar immediatament després de carregar el bundle.
 */
export function deferArrenca() {
  autoProgramada = true;
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
 * IDEMPOTENT (260903): amb `configurable:false` i `writable:false`, una
 * segona crida —bloc i shortcode alhora en la mateixa pàgina, o dos
 * muntatges del bundle— llançava TypeError i matava el segon muntatge
 * sencer. Ara la segona crida torna l'API ja exposada.
 */
export function exposaGlobal(objectiu = (typeof window !== 'undefined' ? window : undefined)) {
  if (!objectiu) return null;

  const existent = Object.getOwnPropertyDescriptor(objectiu, 'SocDePoble');
  if (existent) return existent.value ?? null;

  const api = Object.freeze({ configura, arrenca, arrencaAuto, deferArrenca, estat, CONTRACTE_BACKEND, isReady: true });
  Object.defineProperty(objectiu, 'SocDePoble', { value: api, writable: false, configurable: false });
  
  // Avisar a Sollutia o qualsevol integrador que l'API ja està llesta
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('socdepoble-ready', { detail: api }));
  }
  
  return api;
}
