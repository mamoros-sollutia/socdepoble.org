# MINI-BUNDLE D'AUDITORIA PER A Z

Aquest és un bundle quirúrgic sol·licitat per a esquivar el límit de tokens del xat, centrat en el Quadrant A (Online-First).

--- SRC/DATA/BACKENDPORT.JS ---
```javascript
// src/data/backendPort.js

let currentImpl = null;
let isLocked = false;

export function setBackendImplementation(impl) {
  if (isLocked) {
    console.warn('[backendPort] 🔒 Backend bloquejat. No s\'admeten injeccions tardanes (prevenció d\'atacs).');
    return;
  }
  if (!currentImpl) currentImpl = {};
  currentImpl = { ...currentImpl, ...impl };
}

export function getBackendImplementation() {
  return currentImpl || {};
}

export function freezeImplementation() {
  isLocked = true;
  if (currentImpl) Object.freeze(currentImpl);
}

export function destroy() {
  if (currentImpl && typeof currentImpl.destroy === 'function') {
    currentImpl.destroy();
  }
}

export const APP_SNAPSHOT_STORAGE_KEY = 'socdepoble-app-snapshot-v1';
export const DATA_SYNC_CHANNEL_NAME = 'socdepoble-data-sync-v1';
export const SECTION_SUBMISSIONS_STORAGE_KEY = 'socdepoble-section-submissions-v1';
export const getDefaultUserId = () => currentImpl && currentImpl.getDefaultUserId ? currentImpl.getDefaultUserId() : 'u1';

const asseguraMetode = (nom) => (...args) => {
  if (!currentImpl || typeof currentImpl[nom] !== 'function') {
    throw new Error(`[backendPort] El mètode "${nom}" no està implementat al backend actual.`);
  }
  return currentImpl[nom](...args);
};

export const loadAppData = asseguraMetode('loadAppData');
export const appendChatMessages = asseguraMetode('appendChatMessages');
export const loadLocalAppSnapshot = asseguraMetode('loadLocalAppSnapshot');
export const applySectionSubmissionsToData = asseguraMetode('applySectionSubmissionsToData');
export const appendSectionSubmissionNetworkOnly = asseguraMetode('appendSectionSubmissionNetworkOnly');
export const registerWithEmail = asseguraMetode('registerWithEmail');
export const loginWithEmail = asseguraMetode('loginWithEmail');
export const loginWithGoogle = asseguraMetode('loginWithGoogle');
export const recullTornadaOAuth = asseguraMetode('recullTornadaOAuth');
export const logout = asseguraMetode('logout');
export const getCurrentUser = asseguraMetode('getCurrentUser');
export const getHasSupabaseConfig = asseguraMetode('getHasSupabaseConfig');
export const getRuntimeDataMode = asseguraMetode('getRuntimeDataMode');
export const normalizeDataMode = asseguraMetode('normalizeDataMode');
export const getResolvedConfig = asseguraMetode('getResolvedConfig');

```

--- SRC/HOST.JS ---
```javascript
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
 * Per a substituir Supabase del tot (l'objectiu offline-first), es passa el
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
  'loadLocalAppSnapshot',
  'applySectionSubmissionsToData',
  'registerWithEmail',
  'loginWithEmail',
  'loginWithGoogle',
  'recullTornadaOAuth',
  'logout',
  'getCurrentUser',
  'getHasSupabaseConfig',
  'getRuntimeDataMode',
  'normalizeDataMode',
  'getResolvedConfig',
]);

/* ═══════════════════════ Fase 1 · Configuració ═══════════════════════ */

/**
 * Injecta una implementació de backend abans del segellat.
 *
 * És una fusió parcial: el que no es passe continua caient a Supabase. Això
 * permet una migració per trossos cap a l'offline-first sense una gran
 * reescriptura — que és exactament la transició conjunta que el projecte
 * preveu amb Sollutia.
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
  const supabaseImpl = await import('./data/supabaseBackend.js');
  
  const merged = { ...supabaseImpl, ...currentInjected };
  setBackendImplementation(merged);

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
    document.addEventListener('DOMContentLoaded', () => queueMicrotask(fes), { once: true });
  } else {
    queueMicrotask(fes);
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

```

--- SRC/DATA/IDENTITAT.JS ---
```javascript
/**
 * identitat.js — Font única de la identitat.
 *
 * REGLA: si hi ha sessió, la identitat és la de la sessió. El convidat
 * només existix mentre no s'ha entrat, i mai substituix un usuari real.
 */
import { getVal, setVal, delVal } from '../config/storage.js';


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

export async function reclamaContingutDelConvidat(idReal) {
  // Mode Online-First: la persistència recau completament en el backend de Sollutia.
  return { migrat: 0 };
}

```

--- SRC/APP/APPDATACONTEXT.JSX ---
```javascript
import { createContext, useContext, useEffect, useMemo, useState, useRef } from 'react';
import {

  APP_SNAPSHOT_STORAGE_KEY,
  getDefaultUserId,
  getHasSupabaseConfig,
  SECTION_SUBMISSIONS_STORAGE_KEY,
  loadAppData,
  getRuntimeDataMode,
  getCurrentUser,
  loadLocalAppSnapshot,
  applySectionSubmissionsToData
} from '../data/backendPort.js';
import { normalizeSearchText, sortPinnedContent } from '../config/contentHelpers';
import { resolveAsset as baseResolveAsset } from '../config/assetResolver';
import { createTranslator, readStoredLanguage, writeStoredLanguage, normalizeLanguage } from '../config/i18n';
import { getVal } from '../config/storage.js';
import { readThemePreference, resolveTheme, writeThemePreference } from '../config/theme';
import { uuid } from '../utils/uuid.js';

const AppStateContext = createContext(null);
const AppActionsContext = createContext(null);
const DATA_SYNC_STORAGE_KEYS = new Set([APP_SNAPSHOT_STORAGE_KEY, SECTION_SUBMISSIONS_STORAGE_KEY]);
const LANGUAGE_LOCALES = {
  ca: 'ca-ES',
  es: 'es-ES',
  en: 'en-GB',
  eu: 'eu-ES',
  gl: 'gl-ES'
};

const groupMediaTimeline = (items, t, locale) => {
  const groups = new Map();
  items.forEach((item) => {
    let key = 'sense-data';
    if (item.created_at) {
      const d = new Date(item.created_at);
      if (!Number.isNaN(d.getTime())) {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      }
    }
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });
  return Array.from(groups.entries()).map(([key, groupItems]) => {
    const date = new Date(groupItems[0]?.created_at);
    return {
      key,
      label: Number.isNaN(date.getTime())
        ? t('common.noDate', 'Sense data')
        : date.toLocaleDateString(locale, { month: 'long', year: 'numeric' }),
      items: groupItems
    };
  });
};

const sortEvents = (items) =>
  [...items].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const timeA = Number.isNaN(dateA.getTime()) ? 0 : dateA.getTime();
    const timeB = Number.isNaN(dateB.getTime()) ? 0 : dateB.getTime();
    return timeB - timeA;
  });

const buildSearchCollections = (data) => [
  ...data.agents,
  ...data.chatThreads,
  ...data.feedPosts,
  ...data.marketItems,
  ...data.events,
  ...data.towns
];

const buildPageCopy = (pages) =>
  Object.fromEntries(pages.map((page) => [page.key, { title: page.title, subtitle: page.subtitle, lead: page.lead, image: page.image, imageAlt: page.imageAlt, html: page.html }]));

const buildMessageMap = (messages) => {
  const map = {};
  for (const message of messages) {
    if (!map[message.threadId]) map[message.threadId] = [];
    map[message.threadId].push(message);
  }
  for (const threadId in map) {
    map[threadId].sort((a, b) => (a.createdAtTs || 0) - (b.createdAtTs || 0));
  }
  return map;
};

const buildFallbackMessages = (thread, t) => [
  {
    id: `${getDefaultUserId()}::${thread.id}::fallback-1`,
    ownerUserId: getDefaultUserId(),
    threadId: thread.id,
    messageId: 'fallback-1',
    createdAtTs: 0,
    text: `${t('chat.fallback.hello', 'Hola, soc')} ${thread.name}.`,
    sender: 'other',
    time: t('chat.fallback.now', 'Ara')
  },
  {
    id: `${getDefaultUserId()}::${thread.id}::fallback-2`,
    ownerUserId: getDefaultUserId(),
    threadId: thread.id,
    messageId: 'fallback-2',
    createdAtTs: 1,
    text: thread.message || thread.role || t('chat.fallback.question', 'Vols parlar una estona?'),
    sender: 'other',
    time: t('chat.fallback.now', 'Ara')
  }
];

const appendUniqueById = (items = [], item) => {
  if (!item) return items;
  const map = new Map(items.map((entry) => [String(entry.id), entry]));
  map.set(String(item.id), item);
  return Array.from(map.values());
};

export function AppDataProvider({ children, externalConfig = {} }) {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [authTick, setAuthTick] = useState(0);
  const [language, setLanguage] = useState(() => {
    if (externalConfig?.language) return normalizeLanguage(externalConfig.language);
    if (typeof document !== 'undefined' && document.documentElement.lang) {
      const htmlLang = document.documentElement.lang.split('-')[0];
      if (['ca', 'es', 'en', 'eu', 'gl'].includes(htmlLang)) {
        return normalizeLanguage(htmlLang);
      }
    }
    return readStoredLanguage();
  });

  const [themePreference, setThemePreference] = useState(() => readThemePreference(externalConfig?.themeMode));
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDark(mq.matches);
    const handler = (e) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);

    const onAuthChange = () => setAuthTick(t => t + 1);
    window.addEventListener('sdp:auth-change', onAuthChange);

    return () => {
      mq.removeEventListener('change', handler);
      window.removeEventListener('sdp:auth-change', onAuthChange);
    };
  }, []);

  const themeMode = resolveTheme(themePreference === 'system' ? (systemDark ? 'dark' : 'light') : themePreference);

  const toggleTheme = () => {
    setThemePreference((prev) => {
      const currentResolved = resolveTheme(prev === 'system' ? (systemDark ? 'dark' : 'light') : prev);
      const next = currentResolved === 'dark' ? 'light' : 'dark';
      writeThemePreference(next);
      return next;
    });
  };

  const tenantId = externalConfig?.tenantId || 'default-tenant';
  const localUser = getVal('socdepoble-user');
  // Identitat (Zeta F-9): La identitat ha de derivar només de la sessió validada (localUser del JWT), no de variables inyectades al DOM
  const userId = localUser?.id || getDefaultUserId();
  const channelNamespace = `sdp:${tenantId}:${userId}:v2`;
  
  const configHash = useMemo(() => {
    try {
      return JSON.stringify(externalConfig, (key, val) => typeof val === 'function' ? undefined : val) + '|' + authTick;
    } catch {
      return String(authTick); // Fallback si hi ha referències circulars
    }
  }, [externalConfig, authTick]);

  const stableExternalConfig = useMemo(() => ({ ...externalConfig }), [configHash]);

  const broadcastChannelRef = useRef(null);
  const loadGenerationRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const myGen = ++loadGenerationRef.current;

    const loadData = async () => {
      let networkFinished = false;
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 15000);

      if (getRuntimeDataMode(stableExternalConfig) !== 'seed') {
        loadLocalAppSnapshot(userId).then(async (snap) => {
          if (!snap || cancelled || myGen !== loadGenerationRef.current || networkFinished) return;
          const merged = await applySectionSubmissionsToData(snap, userId);
          if (cancelled || myGen !== loadGenerationRef.current || networkFinished) return;
          setRawData(merged);
          setStatus('ready');
        }).catch(() => {});
      }

      try {
        const data = await loadAppData(userId, { ...externalConfig, signal: controller.signal });
        networkFinished = true;
        clearTimeout(timeoutId);
        if (cancelled || myGen !== loadGenerationRef.current) return;
        setRawData(data);
        setStatus('ready');
        setError(null);
      } catch (loadError) {
        networkFinished = true;
        clearTimeout(timeoutId);
        if (cancelled) return;
        console.warn('[PedraSeca] Mode degradat extrem. loadAppData ha fallat:', loadError);
        setStatus('error');
        setError(loadError);
      }
    };

    loadData();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [stableExternalConfig]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let cancelled = false;
    let channel = null;
    let refreshTimeout = null;
    const controller = new AbortController();
    
    const refreshData = async () => {
      const myGen = ++loadGenerationRef.current;
      try {
        const data = await loadAppData(userId, { ...stableExternalConfig, signal: controller.signal });
        if (cancelled || myGen !== loadGenerationRef.current) return;
        setRawData(data);
        setStatus('ready');
      } catch {
        if (cancelled) return;
      }
    };

    const isRefreshingRef = { current: false };

    const attemptRefresh = () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      if (document.hidden) return; // Thundering Herd: visibility gate
      if (isRefreshingRef.current) return;
      
      const jitter = Math.floor(Math.random() * 200) + 50;
      refreshTimeout = setTimeout(() => {
        isRefreshingRef.current = true;
        refreshData().finally(() => {
          isRefreshingRef.current = false;
        });
      }, jitter);
    };

    const onStorage = (event) => {
      if (!event?.key || !DATA_SYNC_STORAGE_KEYS.has(event.key)) return;
      attemptRefresh();
    };

    const onVisibilityChange = () => {
      if (!document.hidden) attemptRefresh();
    };

    const onManualRefresh = () => attemptRefresh();
    
    window.addEventListener('storage', onStorage);
    window.addEventListener('sdp:refresh-data', onManualRefresh);
    document.addEventListener('visibilitychange', onVisibilityChange);

    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(channelNamespace);
      broadcastChannelRef.current = channel;
      channel.addEventListener('message', (event) => {
        if (event?.data?.type !== 'content:updated') return;
        if (event?.data?.tenantId && event.data.tenantId !== tenantId) return;
        attemptRefresh();
      });
    }

    return () => {
      cancelled = true;
      controller.abort();
      if (refreshTimeout) clearTimeout(refreshTimeout);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('sdp:refresh-data', onManualRefresh);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      channel?.close();
      broadcastChannelRef.current = null;
    };
  }, [stableExternalConfig, channelNamespace, tenantId, userId]);

  useEffect(() => {
    writeStoredLanguage(language);
  }, [language]);

  const translator = useMemo(() => createTranslator(language), [language]);
  const locale = LANGUAGE_LOCALES[language] || 'ca-ES';

  const sortedFeedPosts = useMemo(() => rawData ? sortPinnedContent(rawData.feedPosts) : [], [rawData?.feedPosts]);
  const sortedMarketItems = useMemo(() => rawData ? sortPinnedContent(rawData.marketItems) : [], [rawData?.marketItems]);
  const sortedEvents = useMemo(() => rawData ? sortEvents(rawData.events) : [], [rawData?.events]);
  const featuredTowns = useMemo(() => rawData ? rawData.towns.slice(0, 6) : [], [rawData?.towns]);
  
  const sortedTowns = useMemo(() => {
    if (!rawData || !rawData.towns) return [];
    
    const townActivity = new Map();
    
    const processItem = (item) => {
      const townName = item.town_name || item.population;
      if (!townName) return;
      
      const itemTime = new Date(item.created_at || item.date).getTime();
      if (isNaN(itemTime)) return;
      
      const currentLatest = townActivity.get(townName) || 0;
      if (itemTime > currentLatest) {
        townActivity.set(townName, itemTime);
      }
    };
    
    (rawData.feedPosts || []).forEach(processItem);
    (rawData.marketItems || []).forEach(processItem);
    (rawData.events || []).forEach(processItem);
    
    const townEntries = rawData.towns.map(town => {
      const latestActivity = townActivity.get(town.title);
      const baseTime = new Date(town.created_at).getTime() || 0;
      const activityTime = latestActivity || baseTime;
      return { town, activityTime, latestActivity, baseTime };
    });

    return townEntries.sort((a, b) => b.activityTime - a.activityTime).map(({ town, latestActivity, baseTime }) => {
      const activityDate = latestActivity && latestActivity > baseTime ? new Date(latestActivity) : new Date(town.created_at);
      
      const dynamicTime = !isNaN(activityDate.getTime()) 
        ? activityDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
        : town.time;
        
      const dynamicDate = !isNaN(activityDate.getTime()) 
        ? activityDate.toLocaleDateString(locale, { day: 'numeric', month: 'numeric', year: 'numeric' })
        : '';
        
      return {
        ...town,
        dynamic_time: dynamicTime,
        dynamic_date: dynamicDate
      };
    });
  }, [rawData, locale]);
  const mediaTimelineGroups = useMemo(() => rawData ? groupMediaTimeline(rawData.mediaItems, translator, locale) : [], [rawData?.mediaItems, translator, locale]);
  const pageCopy = useMemo(() => rawData ? buildPageCopy(rawData.pages) : {}, [rawData?.pages]);
  const pageDetailLookup = useMemo(() => rawData ? new Map(
    rawData.feedPosts.flatMap((item) => {
      const keys = [];
      if (item.slug) keys.push([String(item.slug), item]);
      if (item.id != null) keys.push([String(item.id), item]);
      return keys;
    })
  ) : new Map(), [rawData?.feedPosts]);
  const globalSearchItems = useMemo(() => rawData ? buildSearchCollections(rawData) : [], [
    rawData?.agents, rawData?.chatThreads, rawData?.feedPosts, rawData?.marketItems, rawData?.events, rawData?.towns
  ]);
  const chatMessagesByThread = useMemo(() => rawData ? buildMessageMap(rawData.chatMessages) : {}, [rawData?.chatMessages]);

  const stateValue = useMemo(() => {
    const currentUser = getCurrentUser();
    const isSuperAdmin = currentUser?.user_metadata?.role === 'superadmin';

    if (!rawData) {
      return {
        status,
        error,
        ownerUserId: getDefaultUserId(),
        hasSupabaseConfig: getHasSupabaseConfig(stableExternalConfig),
        dataMode: getRuntimeDataMode(stableExternalConfig),
        language,
        themeMode,
        t: translator,
        externalConfig: stableExternalConfig,
        currentUser,
        isSuperAdmin
      };
    }

    return {
      status,
      error,
      externalConfig: stableExternalConfig,
      ownerUserId: rawData.ownerUserId,
      hasSupabaseConfig: getHasSupabaseConfig(stableExternalConfig),
      dataMode: getRuntimeDataMode(stableExternalConfig),
      language,
      themeMode,
      t: translator,
      agents: rawData.agents,
      chatThreads: rawData.chatThreads,
      feedPosts: rawData.feedPosts,
      marketItems: rawData.marketItems,
      events: rawData.events,
      towns: rawData.towns,
      mediaItems: rawData.mediaItems,
      noteFolders: rawData.noteFolders,
      notes: rawData.notes,
      pages: rawData.pages,
      sectionSubmissions: rawData.sectionSubmissions || [],
      pageCopy,
      sortedFeedPosts,
      sortedMarketItems,
      sortedEvents,
      sortedTowns,
      featuredTowns,
      mediaTimelineGroups,
      globalSearchItems,
      pageDetailLookup,
      currentUser,
      isSuperAdmin
    };
  }, [
    error, language, rawData, status, stableExternalConfig,
    translator, sortedFeedPosts, sortedMarketItems, sortedEvents,
    sortedTowns, featuredTowns, mediaTimelineGroups, pageCopy, pageDetailLookup,
    globalSearchItems, themeMode, authTick
  ]);

  const actionsValue = useMemo(() => {
    const setLanguageFn = (code) => {
      setLanguage(code);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sdp:language-changed', { detail: { language: code } }));
        if (typeof window.sdp_change_language === 'function') {
          window.sdp_change_language(code);
        }
      }
    };
    const normalizeSearchTextFn = normalizeSearchText;
    
    if (!rawData) {
      return {
        setLanguage: setLanguageFn,
        normalizeSearchText: normalizeSearchTextFn,
        getSectionItems: () => [],
        findSectionItem: () => null,
        getThreadMessages: () => [],
        sendChatMessage: async () => [],
        sendSectionSubmission: async () => null,
        resolveAsset: (path) => path,
        toggleTheme
      };
    }

    const getSectionItems = (sectionId) => {
      switch (sectionId) {
        case 'xat': return rawData.chatThreads;
        case 'mur': return rawData.feedPosts;
        case 'mercat': return rawData.marketItems;
        case 'events': return rawData.events;
        case 'pobles': return rawData.towns;
        case 'multimedia': return rawData.mediaItems;
        case 'notes': return rawData.notes;
        default: return [];
      }
    };

    const findSectionItem = (sectionId, itemId) =>
      getSectionItems(sectionId).find((item) => String(item.id) === String(itemId) || String(item.slug) === String(itemId)) || null;

    const sendChatMessage = async (thread, text) => {
      const nowTs = Date.now();
      const messageId = uuid();                       // ← UUID, no Date.now()
      const userMessage = {
        id: `${rawData.ownerUserId}::${thread.id}::${messageId}`,
        ownerUserId: rawData.ownerUserId,
        threadId: thread.id,
        messageId,
        createdAtTs: nowTs,
        text,
        sender: 'me',
        estatEnviament: 'pendent',                    // ← per a la marca visual
        time: new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
      };

      // Ara enviem directament a la xarxa, mode Online-First.
      try {
        await appendChatMessages([userMessage]);
      } catch (e) {
        console.error('[BACKEND] Error enviant xat.', e);
        throw e;
      }

      // 2n la pantalla.
      setRawData((current) => ({
        ...current,
        chatMessages: [...(current.chatMessages || []), userMessage]
      }));

      try {
        broadcastChannelRef.current?.postMessage({ type: 'content:updated', tenantId });
      } catch (e) {
        // ignore
      }

      return [userMessage];
    };

    const getThreadMessages = (threadId, fallbackThread = null) => {
      const messages = chatMessagesByThread[threadId] || [];
      if (messages.length > 0) return messages;
      const thread = fallbackThread || rawData.chatThreads.find((entry) => entry.id === threadId);
      return thread ? buildFallbackMessages(thread, translator) : [];
    };

    const sendSectionSubmission = async (submission) => {
      const nowTs = Date.now();
      const id = submission.id || uuid();
      const preparedSubmission = {
        ...submission,
        id,
        ownerUserId: rawData.ownerUserId,
        createdAt: new Date(nowTs).toISOString()
      };
      
      const item = preparedSubmission.payload || preparedSubmission;
      const sectionId = String(preparedSubmission.sectionId || item.sectionId || '').trim();

      // Mode Online-First: cridem directament el backend
      try {
        await appendSectionSubmissionNetworkOnly(preparedSubmission);
      } catch (e) {
        console.error('[BACKEND] Error enviant submission.', e);
        throw e;
      }

      // 2n a la pantalla local
      setRawData((current) => {
        if (!current) return current;

        const next = {
          ...current,
          sectionSubmissions: appendUniqueById(current.sectionSubmissions || [], preparedSubmission)
        };

        if (sectionId === 'mur') {
          next.feedPosts = appendUniqueById(current.feedPosts || [], item);
        } else if (sectionId === 'mercat') {
          next.marketItems = appendUniqueById(current.marketItems || [], item);
        } else if (sectionId === 'events') {
          next.events = appendUniqueById(current.events || [], item);
        } else if (sectionId === 'multimedia') {
          next.mediaItems = appendUniqueById(current.mediaItems || [], item);
        } else if (sectionId === 'notes') {
          next.notes = appendUniqueById(current.notes || [], item);
        }

        return next;
      });
      
      try {
        broadcastChannelRef.current?.postMessage({ type: 'content:updated', tenantId });
      } catch (e) {
        // ignore
      }

      return preparedSubmission;
    };

    const resolveAsset = (path) => {
      return baseResolveAsset(
        path, 
        stableExternalConfig?.basePath, 
        stableExternalConfig?.pluginUrl, 
        stableExternalConfig?.version
      );
    };

    return {
      setLanguage: setLanguageFn,
      normalizeSearchText: normalizeSearchTextFn,
      getSectionItems,
      findSectionItem,
      getThreadMessages,
      sendChatMessage,
      sendSectionSubmission,
      resolveAsset,
      toggleTheme
    };
  }, [rawData, chatMessagesByThread, locale, stableExternalConfig, channelNamespace]);

  return (
    <AppStateContext.Provider value={stateValue}>
      <AppActionsContext.Provider value={actionsValue}>
        {children}
      </AppActionsContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState dins de AppDataProvider.');
  return context;
}

export function useAppActions() {
  const context = useContext(AppActionsContext);
  if (!context) throw new Error('useAppActions dins de AppDataProvider.');
  return context;
}

export function useAppData() {
  const state = useContext(AppStateContext);
  const actions = useContext(AppActionsContext);
  if (!state || !actions) {
    throw new Error('useAppData dins de AppDataProvider.');
  }
  return { ...state, ...actions };
}

```

--- SRC/DATA/SUPABASEBACKEND.JS ---
```javascript
import { APP_SEED, APP_SEED_VERSION, CHAT_MESSAGE_SEED, CHAT_THREADS, getDefaultUserId } from './appSeed.js';
import { getVal, setVal, delVal } from '../config/storage.js';
import { entraAmbGoogle, gestionaTornada } from './oauthRelay.js';
import { mergeById, mapSectionSubmissionToItem } from './mapejadorSeccions.js';

const getSnapshot = async (key) => getVal(key);
const saveSnapshot = async (key, val) => setVal(key, val);
const esborraTot = async () => {};

/**
 * El mode simulat només ha d'existir en desenvolupament. En un build de
 * producció sense config, l'aplicació ha de dir que no pot entrar — no
 * regalar una sessió d'administrador.
 */
const MODE_SIMULAT_PERMES = true; // Permetem mode simulat per defecte si no hi ha dades remotes, el runtime data mode dictarà la resta

function usuariSimulat(email, name) {
  if (!MODE_SIMULAT_PERMES) {
    throw new Error(
      'No hi ha connexió configurada amb el servidor. ' +
      'Falten VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY, o l\'amfitrió no ha passat la configuració.'
    );
  }
  console.warn('[SDP] MODE SIMULAT: sessió local sense servidor. Mai en producció.');
  return {
    id: 'local-mock-usuari',
    email,
    // Rol mínim, no superadmin. Per a provar l'administració, entra de veres.
    user_metadata: { name: name || 'Usuari de proves', role: 'user' }
  };
}

const DEV_FALLBACK_STORAGE_KEY = 'socdepoble-dev-chat-messages';
const APP_SNAPSHOT_STORAGE_KEY = 'socdepoble-app-snapshot-v1';
const SECTION_SUBMISSIONS_STORAGE_KEY = 'socdepoble-section-submissions-v1';
const DATA_SYNC_CHANNEL_NAME = 'socdepoble-data-sync-v1';

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export class ErrorSupabase extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ErrorSupabase';
    this.status = status;
  }
}

const CONNECTABLE_SECTION_IDS = new Set(['mur', 'mercat', 'events', 'multimedia', 'notes']);













const buildHeaders = (anonKey, extra = {}) => {
  const jwt = getVal('socdepoble-jwt');
  return {
    apikey: anonKey,
    Authorization: `Bearer ${jwt ? jwt : anonKey}`,
    'Content-Type': 'application/json',
    ...extra
  };
};

let renovacioEnCurs = null;

export function refreshSession(config = {}) {
  if (renovacioEnCurs) return renovacioEnCurs;
  renovacioEnCurs = _renova(config).finally(() => { renovacioEnCurs = null; });
  return renovacioEnCurs;
}

async function _renova(config) {
  const refreshToken = getVal('socdepoble-refresh-token');
  if (!refreshToken) return false;
  
  const { supabaseUrl, supabaseAnonKey } = getResolvedConfig(config);
  if (!supabaseUrl) return false;
  
  let response;
  try {
    response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        apikey: supabaseAnonKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });
  } catch (e) {
    console.warn('Error de xarxa renovant sessió', e);
    // Xarxa caiguda != Sessió invàlida
    return false;
  }
  
  if (response.ok) {
    const result = await response.json();
    if (result?.access_token) {
      setVal('socdepoble-jwt', result.access_token);
      setVal('socdepoble-refresh-token', result.refresh_token);
      setVal('socdepoble-user', result.user);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sdp:auth-change', { detail: { user: result.user }}));
      }
      return true;
    }
  }

  if (response.status === 400 || response.status === 401) {
    logout();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sdp:auth-change', { detail: { user: null }}));
    }
  }
  return false;
}

async function request(path, config, { method = 'GET', headers = {}, body, signal, timeoutMs = 12000, _isRetry = false } = {}) {
  const { supabaseUrl, supabaseAnonKey, hasSupabaseConfig } = getResolvedConfig(config);
  if (!hasSupabaseConfig) {
    throw new Error('Falten VITE_SUPABASE_URL i/o VITE_SUPABASE_ANON_KEY.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  const handleAbort = () => controller.abort();
  if (signal) {
    signal.addEventListener('abort', handleAbort);
  }

  try {
    const response = await fetch(`${supabaseUrl}${path}`, {
      method,
      headers: buildHeaders(supabaseAnonKey, headers),
      signal: controller.signal,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      if (response.status === 401 && !_isRetry && !path.startsWith('/auth/')) {
        const refreshed = await refreshSession(config);
        if (refreshed) {
          return await request(path, config, { method, headers, body, signal, timeoutMs, _isRetry: true });
        }
      }
      const text = await response.text();
      throw new ErrorSupabase(`Supabase ${response.status}: ${text || 'Error desconegut.'}`, response.status);
    }

    if (response.status === 204) return null;
    return response.json();
  } finally {
    clearTimeout(timeoutId);
    if (signal) {
      signal.removeEventListener('abort', handleAbort);
    }
  }
}

export async function requestMaybe(path, config, options = {}) {
  try {
    const data = await request(path, config, options);
    return { ok: true, data, status: 200 };
  } catch (error) {
    const match = String(error?.message || '').match(/^Supabase\s+(\d+):\s+(.*)$/s);
    return {
      ok: false,
      status: match ? Number(match[1]) : 500,
      errorMessage: match ? match[2] : String(error?.message || error)
    };
  }
}

function mapContentRowsToData(rows) {
  const lookup = new Map(rows.map((row) => [row.key, row.payload]));
  return {
    ownerUserId: getDefaultUserId(),
    agents: lookup.get('agents') || [],
    chatThreads: CHAT_THREADS,
    feedPosts: lookup.get('feedPosts') || [],
    marketItems: lookup.get('marketItems') || [],
    events: lookup.get('events') || [],
    towns: lookup.get('towns') || [],
    mediaItems: lookup.get('mediaItems') || [],
    noteFolders: lookup.get('noteFolders') || [],
    notes: lookup.get('notes') || [],
    pages: lookup.get('pages') || [],
    sectionSubmissions: [],
    chatMessages: []
  };
}

async function buildSeedAppData(ownerUserId = getDefaultUserId()) {
  return {
    ownerUserId,
    agents: APP_SEED.agents,
    chatThreads: APP_SEED.chatThreads,
    chatMessages: mergeChatMessages(
      APP_SEED.chatMessages.filter((message) => message.ownerUserId === ownerUserId),
      await loadDevFallbackMessages(ownerUserId)
    ),
    feedPosts: APP_SEED.feedPosts,
    marketItems: APP_SEED.marketItems,
    events: APP_SEED.events,
    towns: APP_SEED.towns,
    mediaItems: APP_SEED.mediaItems,
    noteFolders: APP_SEED.noteFolders,
    notes: APP_SEED.notes,
    pages: APP_SEED.pages,
    sectionSubmissions: [],
    seedVersion: APP_SEED_VERSION
  };
}

function sanitizeSnapshotArray(value, fallback) {
  return Array.isArray(value) ? value : fallback;
}

async function saveLocalAppSnapshot(snapshot) {
  if (typeof window === 'undefined') return;
  try {
    await saveSnapshot(APP_SNAPSHOT_STORAGE_KEY + '-' + snapshot.ownerUserId, snapshot);
  } catch (error) {
    console.warn('saveLocalAppSnapshot error:', error);
  }
}

export async function loadLocalAppSnapshot(ownerUserId = getDefaultUserId()) {
  const fallback = await buildSeedAppData(ownerUserId);
  if (typeof window === 'undefined') return fallback;

  try {
    const parsed = await getSnapshot(APP_SNAPSHOT_STORAGE_KEY + '-' + ownerUserId);
    if (!parsed)  {
      await saveLocalAppSnapshot(fallback);
      return fallback;
    }

    
    if (!parsed || typeof parsed !== 'object') {
      await saveLocalAppSnapshot(fallback);
      return fallback;
    }

    const snapshot = {
      ...fallback,
      ...parsed,
      ownerUserId,
      agents: sanitizeSnapshotArray(parsed.agents, fallback.agents),
      chatThreads: sanitizeSnapshotArray(parsed.chatThreads, fallback.chatThreads),
      feedPosts: sanitizeSnapshotArray(parsed.feedPosts, fallback.feedPosts),
      marketItems: sanitizeSnapshotArray(parsed.marketItems, fallback.marketItems),
      events: sanitizeSnapshotArray(parsed.events, fallback.events),
      towns: sanitizeSnapshotArray(parsed.towns, fallback.towns),
      mediaItems: sanitizeSnapshotArray(parsed.mediaItems, fallback.mediaItems),
      noteFolders: sanitizeSnapshotArray(parsed.noteFolders, fallback.noteFolders),
      notes: sanitizeSnapshotArray(parsed.notes, fallback.notes),
      pages: sanitizeSnapshotArray(parsed.pages, fallback.pages),
      sectionSubmissions: sanitizeSnapshotArray(
        parsed.sectionSubmissions,
        await loadLocalSectionSubmissions(ownerUserId)
      ),
      chatMessages: mergeChatMessages(
        sanitizeSnapshotArray(parsed.chatMessages, fallback.chatMessages).filter(
          (message) => message.ownerUserId === ownerUserId
        ),
        await loadDevFallbackMessages(ownerUserId)
      ),
      seedVersion: APP_SEED_VERSION
    };

    return snapshot;
  } catch {
    await saveLocalAppSnapshot(fallback);
    return fallback;
  }
}

async function persistMessagesToLocalSnapshot(messages, ownerUserId = getDefaultUserId()) {
  const current = await loadLocalAppSnapshot(ownerUserId);
  const merged = mergeChatMessages(current.chatMessages, messages);
  const nextSnapshot = {
    ...current,
    ownerUserId,
    chatMessages: merged
  };
  await saveLocalAppSnapshot(nextSnapshot);
  await saveDevFallbackMessages(merged, ownerUserId);
  return merged;
}

async function loadDevFallbackMessages(ownerUserId = getDefaultUserId()) {
  if (typeof window === 'undefined') {
    return CHAT_MESSAGE_SEED;
  }

  try {
    const parsed = await getSnapshot(DEV_FALLBACK_STORAGE_KEY + '-' + ownerUserId);
    if (!parsed)  return CHAT_MESSAGE_SEED;
    
    if (!Array.isArray(parsed)) return CHAT_MESSAGE_SEED;
    return parsed.filter((message) => message.ownerUserId === ownerUserId);
  } catch {
    return CHAT_MESSAGE_SEED;
  }
}

async function saveDevFallbackMessages(messages, ownerUserId = getDefaultUserId()) {
  if (typeof window === 'undefined') return;
  try {
    await saveSnapshot(DEV_FALLBACK_STORAGE_KEY + '-' + ownerUserId, messages);
  } catch (error) {
    console.warn('saveDevFallbackMessages error:', error);
  }
}

async function loadLocalSectionSubmissions(ownerUserId = getDefaultUserId()) {
  if (typeof window === 'undefined') return [];

  try {
    const parsed = await getSnapshot(SECTION_SUBMISSIONS_STORAGE_KEY + '-' + ownerUserId);
    if (!parsed)  return [];
    
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((submission) => submission?.ownerUserId === ownerUserId || !submission?.ownerUserId);
  } catch {
    return [];
  }
}

async function saveLocalSectionSubmissions(submissions, ownerUserId = getDefaultUserId()) {
  if (typeof window === 'undefined') return;
  try {
    await saveSnapshot(SECTION_SUBMISSIONS_STORAGE_KEY + '-' + ownerUserId, submissions);
  } catch (error) {
    console.warn('saveLocalSectionSubmissions error:', error);
  }
}

async function persistSectionSubmissionToLocal(submission, ownerUserId = getDefaultUserId()) {
  const current = await loadLocalSectionSubmissions(ownerUserId);
  const next = mergeById(current, [submission]);
  await saveLocalSectionSubmissions(next, ownerUserId);
  return next;
}



export async function applySectionSubmissionsToData(data, ownerUserId = getDefaultUserId()) {
  const remoteSubmissions = Array.isArray(data.sectionSubmissions) ? data.sectionSubmissions : [];
  const localSubmissions = await loadLocalSectionSubmissions(ownerUserId);
  const mergedSubmissions = mergeById(remoteSubmissions, localSubmissions);

  const sectionItems = mergedSubmissions.reduce((accumulator, submission) => {
    const item = mapSectionSubmissionToItem(submission);
    if (!CONNECTABLE_SECTION_IDS.has(item.sectionId)) return accumulator;
    const items = accumulator[item.sectionId] || [];
    items.push(item);
    accumulator[item.sectionId] = items;
    return accumulator;
  }, {});

  return {
    ...data,
    sectionSubmissions: mergedSubmissions,
    feedPosts: mergeById(data.feedPosts || [], sectionItems.mur || []),
    marketItems: mergeById(data.marketItems || [], sectionItems.mercat || []),
    events: mergeById(data.events || [], sectionItems.events || []),
    mediaItems: mergeById(data.mediaItems || [], sectionItems.multimedia || []),
    notes: mergeById(data.notes || [], sectionItems.notes || [])
  };
}

// Removed chat conversation map per lint

function mergeChatMessages(primary = [], secondary = []) {
  const map = new Map();
  [...primary, ...secondary].forEach((message) => {
    if (!message) return;
    map.set(String(message.id), message);
  });
  return Array.from(map.values()).sort((a, b) => (a.createdAtTs || 0) - (b.createdAtTs || 0));
}













async function loadStructuredSupabaseData(config, ownerUserId) {
  const safeOwnerId = ownerUserId || getDefaultUserId();
  const { tenantId } = getResolvedConfig(config);
  const [contentRows, chatThreads, chatMessages, sectionSubmissionsResponse] = await Promise.all([
    request(`/rest/v1/app_content?select=key,payload,version&tenant_id=eq.${encodeURIComponent(tenantId)}`, config, { signal: config.signal }),
    request(`/rest/v1/chat_threads?select=id,payload&tenant_id=eq.${encodeURIComponent(tenantId)}`, config, { signal: config.signal }),
    request(`/rest/v1/chat_messages?select=id,owner_user_id,thread_id,message_id,text,sender,time_label,created_at&tenant_id=eq.${encodeURIComponent(tenantId)}&owner_user_id=eq.${encodeURIComponent(safeOwnerId)}&order=created_at.asc`, config, { signal: config.signal }),
    requestMaybe(`/rest/v1/section_submissions?select=*&tenant_id=eq.${encodeURIComponent(tenantId)}&owner_user_id=eq.${encodeURIComponent(safeOwnerId)}&order=created_at.asc`, config, { signal: config.signal })
  ]);

  if (!Array.isArray(contentRows) || contentRows.length === 0) {
    throw new Error('La BD remota està buida. Executa supabase/schema.sql i supabase/seed.sql.');
  }

  if (!Array.isArray(chatThreads) || chatThreads.length === 0) {
    throw new Error('Falten fils de xat en la BD remota. Executa supabase/seed.sql.');
  }

  const baseData = mapContentRowsToData(contentRows || []);
  return {
    ...baseData,
    ownerUserId,
    chatThreads: (chatThreads || []).map((thread) => ({ id: thread.id, ...thread.payload })),
    chatMessages: mergeChatMessages(
      (chatMessages || []).map((message) => ({
      id: message.id,
      ownerUserId: message.owner_user_id,
      threadId: message.thread_id,
      messageId: message.message_id,
      text: message.text,
      sender: message.sender,
      time: message.time_label,
      createdAtTs: message.created_at ? new Date(message.created_at).getTime() : 0
      })),
      await loadDevFallbackMessages(ownerUserId)
    ),
    sectionSubmissions: Array.isArray(sectionSubmissionsResponse?.data) ? sectionSubmissionsResponse.data : [],
    seedVersion: APP_SEED_VERSION
  };
}

async function loadRemoteAppData(config, ownerUserId = getDefaultUserId()) {
  const { hasSupabaseConfig } = getResolvedConfig(config);
  if (!hasSupabaseConfig) {
    throw new Error('Falten VITE_SUPABASE_URL i/o VITE_SUPABASE_ANON_KEY.');
  }

  return loadStructuredSupabaseData(config, ownerUserId);
}

/**
 * Desa el remot com a snapshot REAL (`origen: 'remot'`). Sense esta línia
 * la lectura offline era la llavor d'`appSeed.js`: un maniquí, no el poble.
 */
async function loadRemoteAndCache(config, ownerUserId) {
  const data = await loadRemoteAppData(config, ownerUserId);
  await saveLocalAppSnapshot({ ...data, ownerUserId, origen: 'remot', desatTs: Date.now() });
  return data;
}

async function teSnapshotRemot(ownerUserId) {
  try {
    const s = await getSnapshot(APP_SNAPSHOT_STORAGE_KEY + '-' + ownerUserId);
    return Boolean(s && s.origen === 'remot');
  } catch {
    return false;
  }
}

export async function loadAppData(ownerUserId = getDefaultUserId(), config = {}) {
  const loadAndMerge = async (loader) => await applySectionSubmissionsToData(await loader, ownerUserId);
  const { runtimeDataMode, hasSupabaseConfig } = getResolvedConfig(config);

  if (runtimeDataMode === 'seed') {
    return loadAndMerge(await buildSeedAppData(ownerUserId));
  }

  if (runtimeDataMode === 'local') {
    return loadAndMerge(await loadLocalAppSnapshot(ownerUserId));
  }

  /* hybrid i remote: xarxa → desar → servir. Sense xarxa: l'última veritat REAL.
     La llavor només en hybrid (mode de proves). En remote, sense snapshot real,
     l'error és honest: AGENTS.md prohibix el fallback demo silenciós en producció. */
  if (!hasSupabaseConfig) {
    if (runtimeDataMode === 'remote') throw new Error('Falten VITE_SUPABASE_URL i/o VITE_SUPABASE_ANON_KEY.');
    return loadAndMerge(runtimeDataMode === 'hybrid' ? await loadLocalAppSnapshot(ownerUserId) : await buildSeedAppData(ownerUserId));
  }

  try {
    return await loadAndMerge(loadRemoteAndCache(config, ownerUserId));
  } catch (error) {
    if (runtimeDataMode === 'remote' && !(await teSnapshotRemot(ownerUserId))) throw error;
    return loadAndMerge(await loadLocalAppSnapshot(ownerUserId));
  }
}

export async function appendChatMessages(messages, config = {}) {
  const { runtimeDataMode, hasSupabaseConfig } = getResolvedConfig(config);
  const ownerUserId = messages[0]?.ownerUserId || getDefaultUserId();
  if (runtimeDataMode === 'local' || runtimeDataMode === 'hybrid') {
    const localMerged = await persistMessagesToLocalSnapshot(messages, ownerUserId);
    if (runtimeDataMode === 'local') return localMerged;
  }

  if (runtimeDataMode === 'seed' || !hasSupabaseConfig) {
    const current = await loadDevFallbackMessages(ownerUserId);
    const merged = [...current, ...messages];
    await saveDevFallbackMessages(merged);
    return merged;
  }

  try {
    const { tenantId } = getResolvedConfig(config);
    const rows = messages.map((message) => ({
      id: String(message.id),
      tenant_id: tenantId,
      owner_user_id: message.ownerUserId || getDefaultUserId(),
      thread_id: String(message.threadId),
      message_id: String(message.messageId || message.id),
      text: message.text,
      sender: message.sender === 'me' ? 'me' : 'other',
      time_label: message.time || null,
      created_at: new Date(message.createdAtTs || Date.now()).toISOString()
    }));

    await request(`/rest/v1/chat_messages?on_conflict=${encodeURIComponent('id')}`, config, {
      method: 'POST',
      headers: {
        Prefer: 'resolution=merge-duplicates,return=representation'
      },
      body: rows
    });

    const current = await loadDevFallbackMessages(ownerUserId);
    const merged = mergeChatMessages(current, messages);
    await saveDevFallbackMessages(merged, ownerUserId);
    return merged;
  } catch (error) {
    const message = String(error?.message || '');
    const isRlsDenied =
      message.includes('row-level security policy') ||
      message.includes('"42501"') ||
      message.includes('403');

    if (!isRlsDenied) {
      throw error;
    }

    if (runtimeDataMode === 'hybrid') {
      return await persistMessagesToLocalSnapshot(messages, ownerUserId);
    }
    const current = await loadDevFallbackMessages(ownerUserId);
    const merged = mergeChatMessages(current, messages);
    await saveDevFallbackMessages(merged, ownerUserId);
    return merged;
  }
}

export async function appendSectionSubmissionNetworkOnly(submission, config = {}) {
  const { runtimeDataMode, hasSupabaseConfig } = getResolvedConfig(config);
  const ownerUserId = submission?.ownerUserId || getDefaultUserId();
  const sectionId = String(submission?.sectionId || '').trim();
  if (!CONNECTABLE_SECTION_IDS.has(sectionId)) {
    throw new Error('Secció no suportada per a connectar.');
  }

  const id = String(submission?.id || generateUUID());
  const createdAt = submission?.createdAt || new Date().toISOString();
  const basePayload = submission?.payload && typeof submission.payload === 'object' ? submission.payload : {};
  const payload = mapSectionSubmissionToItem({
    ...submission,
    id,
    ownerUserId,
    sectionId,
    createdAt,
    payload: {
      ...basePayload,
      id,
      ownerUserId,
      sectionId,
      created_at: basePayload.created_at || createdAt
    }
  });
  const storedSubmission = {
    id,
    ownerUserId,
    sectionId,
    title: submission?.title || payload.title || '',
    description: submission?.description || payload.description || payload.summary || '',
    createdAt,
    payload
  };

  await persistSectionSubmissionToLocal(storedSubmission, ownerUserId);

  if (runtimeDataMode === 'seed' || runtimeDataMode === 'local' || !hasSupabaseConfig) {
    return storedSubmission;
  }



  try {
    const { tenantId } = getResolvedConfig(config);
    await request('/rest/v1/section_submissions?on_conflict=' + encodeURIComponent('id'), config, {
      method: 'POST',
      headers: {
        Prefer: 'resolution=merge-duplicates,return=representation'
      },
      body: [
        {
          id,
          tenant_id: tenantId,
          owner_user_id: ownerUserId,
          section_id: sectionId,
          title: storedSubmission.title,
          description: storedSubmission.description,
          payload,
          created_at: createdAt
        }
      ]
    });
    return storedSubmission;
  } catch (error) {
    const message = String(error?.message || '');
    const isRemoteUnavailable =
      message.includes('row-level security policy') ||
      message.includes('"42501"') ||
      message.includes('403') ||
      message.includes('404') ||
      message.includes('does not exist');

    if (isRemoteUnavailable) {
      console.warn('[BACKEND] Error remot inrecuperable per submission. Marcant com a rebutjada.', error);
      storedSubmission.syncStatus = 'quarantena-denegada';
      storedSubmission.syncError = message;
      await persistSectionSubmissionToLocal(storedSubmission, ownerUserId);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sdp:submission-rejected', { detail: { id, title: storedSubmission.title, error: message } }));
      }
      
      return storedSubmission;
    }

    // Si és un error de xarxa (timeout, sense connexió, 500), el llancem perquè el sincronitzador ho ajorne!
    throw error;
  }
}

export {
  APP_SNAPSHOT_STORAGE_KEY,
  DATA_SYNC_CHANNEL_NAME,
  getDefaultUserId,
  SECTION_SUBMISSIONS_STORAGE_KEY,
};

export function getHasSupabaseConfig(config = {}) {
  return getResolvedConfig(config).hasSupabaseConfig;
}



export function getRuntimeDataMode(config = {}) {
  return getResolvedConfig(config).runtimeDataMode;
}

export function normalizeDataMode(config = {}) {
  return getResolvedConfig(config).runtimeDataMode;
}

export function getResolvedConfig(config = {}) {
  const supabaseUrl = config.supabaseUrl || '';
  const supabaseAnonKey = config.supabaseAnonKey || '';
  let dataMode = String(config.dataMode || 'local').trim().toLowerCase();
  
  if (!['auto', 'seed', 'local', 'hybrid', 'remote'].includes(dataMode)) {
    dataMode = 'local';
  }

  const tenantId = config.tenantId || '11111111-2222-3333-4444-555555555555';
  
  const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
  const runtimeMode = dataMode === 'local' ? 'local' : (dataMode === 'auto' ? (hasSupabaseConfig ? 'hybrid' : 'seed') : dataMode);
  
  return {
    supabaseUrl,
    supabaseAnonKey,
    tenantId,
    dataMode: runtimeMode,
    hasSupabaseConfig,
    
    runtimeDataMode: runtimeMode
  };
}



export async function registerWithEmail(email, password, name, config = {}) {
  const { tenantId, hasSupabaseConfig } = getResolvedConfig(config);
  
  if (!hasSupabaseConfig) {
    const mockUser = usuariSimulat(email, name);
    setVal('socdepoble-jwt', 'mock-jwt-token');
    setVal('socdepoble-user', mockUser);
    return { access_token: 'mock-jwt-token', user: mockUser };
  }

  const result = await request('/auth/v1/signup', config, {
    method: 'POST',
    body: {
      email,
      password,
      data: { name, tenant_id: tenantId }
    }
  });

  if (result?.access_token) {
    setVal('socdepoble-jwt', result.access_token);
    setVal('socdepoble-refresh-token', result.refresh_token);
    setVal('socdepoble-user', result.user);
  }
  return result;
}

export async function loginWithEmail(email, password, config = {}) {
  const { hasSupabaseConfig } = getResolvedConfig(config);

  if (!hasSupabaseConfig) {
    const mockUser = usuariSimulat(email, undefined);
    setVal('socdepoble-jwt', 'mock-jwt-token');
    setVal('socdepoble-user', mockUser);
    return { access_token: 'mock-jwt-token', user: mockUser };
  }

  const result = await request('/auth/v1/token?grant_type=password', config, {
    method: 'POST',
    body: { email, password }
  });

  if (result?.access_token) {
    setVal('socdepoble-jwt', result.access_token);
    setVal('socdepoble-refresh-token', result.refresh_token);
    setVal('socdepoble-user', result.user);
  }
  return result;
}

/**
 * L'anterior enviava l'usuari a Google amb `redirect_to = origin + pathname`.
 * Com que eixe origen no estava a la llista blanca, GoTrue no fallava: queia
 * al SITE_URL i l'usuari acabava sempre a socdepoble.org. I ningú llegia la
 * tornada, així que ni tan sols des d'allí s'hauria guardat la sessió.
 *
 * Ara: relé fix + PKCE + finestra emergent. Torna una promesa amb la sessió.
 */
export function loginWithGoogle(config = {}) {
  return entraAmbGoogle(config, getResolvedConfig);
}

/** Crida-la una vegada quan l'app es munte. */
export function recullTornadaOAuth(config = {}) {
  return gestionaTornada(config, getResolvedConfig);
}

export async function logout() {
  delVal('socdepoble-jwt');
  delVal('socdepoble-refresh-token');
  delVal('socdepoble-user');
  
  // Apoptosi: destrucció de dades locals (RGPD art.17)
  delVal(APP_SNAPSHOT_STORAGE_KEY);
  delVal(SECTION_SUBMISSIONS_STORAGE_KEY);
  
  try {
    await esborraTot();
  } catch (e) {
    console.warn('[LOGOUT] Error en esborraTot:', e);
  }
}

export function getCurrentUser() {
  return getVal('socdepoble-user', null);
}

```

--- SRC/SECTIONS/NOTES/NOTESSECTION.JSX ---
```javascript
import { useDeferredValue, useMemo, useState } from 'react';
import { sanitizeHtml } from '../../utils/sanitize';
import { ChevronLeft, ChevronDown, ChevronRight, FileText, Folder, List, Heading1, Heading2, Type, ListOrdered, CheckSquare, Image as ImageIcon, Video, Link, Bold, Italic, Strikethrough, Sparkles, Download, Plus, Bookmark, Hash, Globe } from 'lucide-react';
import { UniversalPage, DateTimeControl } from '../../components/universal/UniversalComponents';
import { UniversalSearch } from '../../components/ui/UniversalSearch.jsx';
import { useAppData } from '../../app/AppDataContext';

const CATEGORIES = ['Trellat', 'Patrimoni', 'Dades', 'Social'];
const LANGUAGE_LOCALES = {
  ca: 'ca-ES',
  es: 'es-ES',
  en: 'en-GB',
  eu: 'eu-ES',
  gl: 'gl-ES'
};

export default function NotesSection() {
  const { language, normalizeSearchText, noteFolders, notes: rawNotes, t, sendSectionSubmission } = useAppData();
  const [activeFolderId, setActiveFolderId] = useState('f-root');
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeNoteId, setActiveNoteId] = useState('n1');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [mobileView, setMobileView] = useState('list'); // 'folders', 'list', 'editor'
  const [showPublishMenu, setShowPublishMenu] = useState(false);
  const [isFoldersOpen, setIsFoldersOpen] = useState(true); // sidebar collapse
  const [isFoldersAccordionOpen, setIsFoldersAccordionOpen] = useState(true);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isTagsOpen, setIsTagsOpen] = useState(true);
  const [isNotesOpen, setIsNotesOpen] = useState(true);
  const locale = LANGUAGE_LOCALES[language] || 'ca-ES';

  const notes = useMemo(
    () =>
      rawNotes.map((note) => {
        const plainText = String(note.content || '').replace(/<[^>]*>/g, ' ').trim();
        return {
          ...note,
          plainText,
          searchText: normalizeSearchText(`${note.title} ${plainText}`),
          formattedDate: new Date(note.updatedAt).toLocaleDateString(locale, { day: 'numeric', month: 'short' }),
          formattedTime: new Date(note.updatedAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
          formattedDateShort: `${String(new Date(note.updatedAt).getDate()).padStart(2, '0')}/${String(new Date(note.updatedAt).getMonth() + 1).padStart(2, '0')}/${String(new Date(note.updatedAt).getFullYear()).slice(-2)}`
        };
      }),
    [locale, normalizeSearchText, rawNotes]
  );

  const filteredNotes = useMemo(() => {
    const query = normalizeSearchText(deferredSearchQuery);
    return notes
      .filter((note) => (activeFolderId ? note.folderId === activeFolderId : true))
      .filter((note) => (activeCategory ? note.category === activeCategory : true))
      .filter((note) => (!query ? true : note.searchText.includes(query)));
  }, [activeCategory, activeFolderId, deferredSearchQuery, notes, normalizeSearchText]);

  const activeNote = filteredNotes.find((note) => note.id === activeNoteId) || filteredNotes[0] || notes[0];

  const handleSelectFolder = (id) => {
    setActiveFolderId(id);
    setActiveCategory(null);
    setMobileView('list');
  };

  const handleSelectCategory = (category) => {
    setActiveCategory(category);
    setActiveFolderId(null);
    setMobileView('list');
  };

  const handleBack = () => {
    if (mobileView === 'editor') setMobileView('list');
    else if (mobileView === 'list') setMobileView('folders');
  };

  const handleSaveField = (field, htmlValue) => {
    if (!activeNote || !activeNote.id) return;
    const sanitized = sanitizeHtml(htmlValue);
    
    if (activeNote[field] === sanitized) return;
    
    sendSectionSubmission({
      ...activeNote,
      [field]: sanitized,
      updatedAt: new Date().toISOString()
    }).catch(e => console.error('[NotesSection] Error guardant nota:', e));
  };

  const getCategoryLabel = (category) => t(`section.notes.category.${category}`, category);

  const handleToggleFolders = () => {
    const nextState = !isFoldersOpen;
    setIsFoldersOpen(nextState);
    if (nextState) setIsNotesOpen(true);
  };

  return (
    <UniversalPage chrome="system" hideHeader={true}>
      <article className="notes-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="topbar mobile-only-topbar">
          <div className="topbar__title">
            <strong>{t('section.notes.mobileTitle', 'Bloc de notes')}</strong>
          </div>
          <div className="sdp-switcher mobile-only" role="tablist">
            <button type="button" role="tab" aria-selected={mobileView === 'folders'} className={`pill ${mobileView === 'folders' ? 'pill--active' : ''}`} onClick={() => setMobileView('folders')}>
              <Folder size={16} /> {t('section.notes.mobileFolders', 'Carpetes')}
            </button>
            <button type="button" role="tab" aria-selected={mobileView === 'list'} className={`pill ${mobileView === 'list' ? 'pill--active' : ''}`} onClick={() => setMobileView('list')}>
              <List size={16} /> {t('section.notes.mobileList', 'Llista')}
            </button>
            <button type="button" role="tab" aria-selected={mobileView === 'editor'} className={`pill ${mobileView === 'editor' ? 'pill--active' : ''}`} onClick={() => setMobileView('editor')}>
              <FileText size={16} /> {t('section.notes.mobileEditor', 'Editor')}
            </button>
          </div>
        </div>

        <div className="notes-shell" style={{ marginTop: '24px', flex: 1, overflow: 'hidden' }}>
          <aside role="complementary" aria-label={t('section.notes.folders', 'Carpetes')} className={`notes-column notes-column--folders ${mobileView === 'folders' ? 'notes-column--mobile' : ''} ${!isFoldersOpen ? 'notes-column--collapsed' : ''}`}>
            <div className="notes-column__head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setIsFoldersAccordionOpen(!isFoldersAccordionOpen)}>
                <Folder size={16} />
                <span className="column-title">{t('section.notes.folders', 'Carpetes')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Plus size={16} style={{ cursor: 'pointer' }} onClick={() => {}} aria-label="Afegeix carpeta" />
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => setIsFoldersAccordionOpen(!isFoldersAccordionOpen)}>
                  {isFoldersAccordionOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', paddingLeft: '4px', borderLeft: '1px solid var(--sdp-vora)' }} onClick={handleToggleFolders}>
                  {isFoldersOpen ? <ChevronLeft size={16} className="collapse-icon" /> : <Folder size={16} className="collapse-icon" />}
                </div>
              </div>
            </div>
            <div className="notes-column__body">
              <nav role="navigation" aria-label={t('section.notes.folders', 'Carpetes')} className="folders-list" style={{ display: isFoldersAccordionOpen ? 'block' : 'none' }}>
                {noteFolders.map((folder) => (
                  <button
                    key={folder.id}
                    type="button"
                    className={`folder-button ${folder.id === activeFolderId ? 'folder-button--active' : ''}`}
                    onClick={() => handleSelectFolder(folder.id)}
                  >
                    <Folder size={16} /> {folder.name}
                  </button>
                ))}
              </nav>

              <div className="notes-category-block">
                <div className="notes-column__head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}>
                    <Bookmark size={16} />
                    <span className="column-title">{t('section.notes.categories', 'Categories')}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Plus size={16} style={{ cursor: 'pointer' }} onClick={() => {}} aria-label="Afegeix categoria" />
                    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}>
                      {isCategoriesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </div>
                </div>
                <div role="group" aria-label={t('section.notes.categories', 'Categories')} className="categories-list" style={{ display: isCategoriesOpen ? 'block' : 'none' }}>
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`folder-button ${category === activeCategory ? 'folder-button--active' : ''}`}
                      onClick={() => handleSelectCategory(category)}
                      style={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                      <Bookmark size={14} /> {getCategoryLabel(category)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="notes-tags-block">
                <div className="notes-column__head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setIsTagsOpen(!isTagsOpen)}>
                    <Hash size={16} />
                    <span className="column-title">Etiquetes</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Plus size={16} style={{ cursor: 'pointer' }} onClick={() => {}} aria-label="Afegeix etiqueta" />
                    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => setIsTagsOpen(!isTagsOpen)}>
                      {isTagsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </div>
                </div>
                <div role="group" aria-label="Etiquetes" className="tags-list" style={{ display: isTagsOpen ? 'block' : 'none' }}>
                  {/* Mock tags for now */}
                  {['#important', '#idea', '#esborrany'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="folder-button"
                      style={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                      <Hash size={14} /> {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section role="region" aria-label={t('nav.notes', 'Notes')} className={`notes-column notes-column--list ${mobileView === 'list' ? 'notes-column--mobile' : ''} ${!isNotesOpen ? 'notes-column--collapsed' : ''}`}>
            <div className="notes-column__head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setIsNotesOpen(!isNotesOpen)}>
                <FileText size={16} />
                <span className="column-title">{t('nav.notes', 'Notes')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Plus size={16} style={{ cursor: 'pointer' }} onClick={() => {}} aria-label="Afegeix nota" />
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', paddingLeft: '4px', borderLeft: '1px solid var(--sdp-vora)' }} onClick={() => setIsNotesOpen(!isNotesOpen)}>
                  {isNotesOpen ? <ChevronLeft size={16} className="collapse-icon" /> : <List size={16} className="collapse-icon" />}
                </div>
              </div>
            </div>
            <div className="notes-column__body">
              <UniversalSearch
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('section.notes.searchPlaceholder', 'Cerca al bancal...')}
                ariaLabel={t('section.notes.searchAria', 'Cercador de notes')}
              />

              <div className="note-list">
                {filteredNotes.map((note) => {
                  const isActive = note.id === activeNote?.id;
                  return (
                    <button
                      key={note.id}
                      type="button"
                      onClick={() => {
                        setActiveNoteId(note.id);
                        setMobileView('editor');
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '16px',
                        background: isActive ? 'var(--sdp-fons-subtil)' : 'transparent',
                        border: 'none',
                        borderBottom: '1px solid var(--sdp-vora)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'baseline' }}>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--sdp-text-principal)' }}>{note.title}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--sdp-text-secundari)' }}>{note.formattedDateShort}</span>
                      </div>
                      {note.subtitle && (
                        <div style={{ fontSize: '0.95rem', color: 'var(--sdp-text-principal)', marginBottom: '8px', fontWeight: 600 }}>
                          {note.subtitle}
                        </div>
                      )}
                      <div style={{ fontSize: '0.85rem', color: 'var(--sdp-text-secundari)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {note.plainText.slice(0, 100) || t('section.notes.emptyPreview', 'Sense contingut...')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <main className={`notes-column notes-column--editor ${mobileView === 'editor' ? 'notes-column--mobile' : ''}`}>
              <div className="notes-column__head notes-column__head--editor" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', padding: 0 }}>
                {/* Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '52px', padding: '0 16px' }}>
                  <button type="button" className="pill mobile-only" onClick={handleBack}>
                  <ChevronLeft size={16} /> {t('section.notes.back', 'Tornar')}
                  </button>
                  <div className="editor-toolbar" style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
                    <Sparkles size={20} style={{ cursor: 'pointer' }} />
                    <Download size={20} style={{ cursor: 'pointer' }} />
                    <Heading2 size={20} style={{ cursor: 'pointer' }} />
                    <Type size={20} style={{ cursor: 'pointer' }} />
                    <List size={20} style={{ cursor: 'pointer' }} />
                    <ListOrdered size={20} style={{ cursor: 'pointer' }} />
                    <CheckSquare size={20} style={{ cursor: 'pointer' }} />
                    <ImageIcon size={20} style={{ cursor: 'pointer' }} />
                    <Video size={20} style={{ cursor: 'pointer' }} />
                    <Link size={20} style={{ cursor: 'pointer' }} />
                    <Bold size={20} style={{ cursor: 'pointer' }} />
                    <Italic size={20} style={{ cursor: 'pointer' }} />
                    <Strikethrough size={20} style={{ cursor: 'pointer' }} />
                  </div>
                  <div className="editor-toolbar-actions" style={{ marginLeft: '16px' }}>
                    <div 
                      onClick={() => setShowPublishMenu(!showPublishMenu)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        cursor: 'pointer',
                        color: 'var(--sdp-text-principal)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '0.85rem'
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <Globe size={20} />
                      PUBLICAR
                    </div>
                  </div>
                </div>

                {/* Inline Expandable Menu */}
                {showPublishMenu && (
                  <div style={{ 
                    borderTop: '1px solid var(--sdp-vora)', 
                    background: 'var(--sdp-fons-subtil)', 
                    padding: '8px 16px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '4px' 
                  }}>
                    <button className="folder-button" style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px' }}>
                      Públicament al Mur
                    </button>
                    <button className="folder-button" style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px' }}>
                      Al teu Grup de Treball
                    </button>
                    <button className="folder-button" style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px' }}>
                      Només usuaris seleccionats
                    </button>
                  </div>
                )}
              </div>
            <div className="notes-column__body notes-editor" style={{ padding: 0 }}>
              {activeNote ? (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
                    
                    {/* Media Insertion */}
                    {activeNote.heroImage ? (
                      <div className="editor-hero-image" style={{ width: '100%', flexShrink: 0 }}>
                        <img 
                          src={activeNote.heroImage} 
                          alt="Imatge de capçalera" 
                          style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }} 
                        />
                      </div>
                    ) : (
                      <div style={{ padding: '32px', paddingBottom: '16px' }}>
                        <button type="button" className="pill" style={{ borderStyle: 'dashed', background: 'transparent' }}>
                          <ImageIcon size={16} /> Inserir Imatge o Multimèdia
                        </button>
                      </div>
                    )}

                    <div style={{ flexShrink: 0 }}>
                      {/* Orange Bar */}
                      <section className="bar-orange" aria-label="Autoria i data" style={{ margin: 0, borderRadius: 0 }}>
                        <div className="sp-card-author">
                          <img className="sp-card-avatar" src="/assets/system/ui/logo-socdepoble-cuadrat-verd.svg" alt="Sóc de Poble" width="48" height="48" />
                          <div className="sp-card-author-info">
                            <div className="sp-card-author-name">Sóc de Poble</div>
                            <div className="sp-card-author-location">La Torre de les Maçanes</div>
                          </div>
                        </div>
                        <div className="bar-actions">
                          <DateTimeControl 
                            time={activeNote.formattedTime}
                            date={new Date(activeNote.createdAt).toLocaleDateString('ca-ES')} 
                            onClick={() => {
                              // Obrirà el contextual del calendari
                            }}
                          />
                        </div>
                      </section>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: '32px' }}>
                      {/* Inner Universal Card */}
                      <article className="card universal-page" style={{ margin: '0 32px 32px 32px', padding: '0 32px 32px 32px', flex: 1, display: 'flex', flexDirection: 'column', borderTopLeftRadius: 0, borderTopRightRadius: 0, borderLeft: 'none', borderRight: 'none', boxShadow: 'var(--sdp-ombra-suau)' }}>
                        
                        <header className="page-title" style={{ margin: '0 0 24px 0', borderBottom: 'none' }}>
                          <img alt="Logotip Sóc de Poble" className="page-title-logo light-only" src="/assets/system/ui/logo-socdepoble-rect-negre.svg" />
                          <img alt="Logotip Sóc de Poble" className="page-title-logo dark-only" src="/assets/system/ui/logo-socdepoble-rect-blanc.svg" />

                          {/* H1 Title */}
                          <h1 
                            className="editor-title-input"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleSaveField('title', e.currentTarget.innerHTML)}
                            style={{ outline: 'none', cursor: 'text' }}
                            data-placeholder="Escriu el títol de l'article (H1)..."
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeNote.title || '') }}
                          />

                          {/* Meta Labels (Categories/Tags) */}
                          <ul className="sp-card-labels page-title-labels" style={{ marginTop: '16px', marginBottom: '16px', justifyContent: 'center' }}>
                            {activeNote.category ? (
                              <li className={`sp-card-label ${activeNote.category.toLowerCase() === 'sistema' ? 'sdp-badge-system' : 'sdp-badge-category'}`} style={{ cursor: 'pointer', border: 'none' }}>{activeNote.category}</li>
                            ) : (
                              <li className="sp-card-label sdp-badge-category" style={{ borderStyle: 'dashed', background: 'transparent', cursor: 'pointer' }}>+ Categoria</li>
                            )}
                            {activeNote.tags && activeNote.tags.length > 0 ? (
                              activeNote.tags.map(tag => (
                                <li key={tag} className="sp-card-label sdp-badge-tag" style={{ cursor: 'pointer' }}>{tag}</li>
                              ))
                            ) : (
                              <li className="sp-card-label sdp-badge-tag" style={{ borderStyle: 'dashed', background: 'transparent', cursor: 'pointer' }}>+ Etiqueta</li>
                            )}
                          </ul>

                          {/* Copyright */}
                          <p className="sp-card-copyright page-title-copyright">© Sóc de Poble / Fet per la IAIA i Nano Banana</p>
                        </header>

                        <div className="page-intro" style={{ marginBottom: '24px' }}>
                          {/* H2 Subtitle */}
                          <h2 
                            className="editor-subtitle-input"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleSaveField('subtitle', e.currentTarget.innerHTML)}
                            style={{ outline: 'none', cursor: 'text' }}
                            data-placeholder="Escriu el subtítol (H2)..."
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeNote.subtitle || '') }}
                          />

                          {/* Lead (Entradilla) */}
                          <p 
                            className="lead editor-lead-input"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleSaveField('lead', e.currentTarget.innerHTML)}
                            style={{ outline: 'none', cursor: 'text' }}
                            data-placeholder="Escriu l'entradilla..."
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeNote.lead || '') }}
                          />
                        </div>
                        
                        <div 
                          className="editor-content page-content"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleSaveField('content', e.currentTarget.innerHTML)}
                          style={{ outline: 'none', flex: 1 }}
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeNote.content) }}
                        />
                      </article>
                    </div>
                  </div>
                </>
              ) : (
                <div className="chat-empty">
                  <FileText size={64} />
                  <h2 className="section-title">{t('section.notes.open', 'Obre un solc')}</h2>
                </div>
              )}
            </div>
          </main>
        </div>
      </article>
    </UniversalPage>
  );
}

```

--- SRC/MAIN.JSX ---
```javascript
/**
 * main.jsx — Punt d'entrada del build de desenvolupament i del standalone.
 *
 * CANVI 260830: abans cridava `defineCustomElement()` directament, cosa que
 * segellava el backend a l'instant i no deixava cap finestra perquè un host
 * (Sollutia) injectara la seua implementació. Ara l'arrencada passa per
 * `host.js`, que separa configuració i segellat en dues fases.
 *
 * Ordre resultant:
 *   1 · es carrega el bundle i s'exposa `window.SocDePoble`
 *   2 · un <script> del host pot cridar `window.SocDePoble.configura({...})`
 *   3 · `arrencaAuto()` segella i defineix l'element al següent tick
 *
 * Si ningú configura res, el comportament és idèntic al d'abans: Supabase.
 */

import { arrencaAuto, exposaGlobal } from './host.js';

// El build standalone de WordPress no és ESM: sense aquest global, un host que
// el carregue amb un <script> pla no té cap manera d'arribar al port.
exposaGlobal();

const init = () => {
  // Programa el segellat per al següent tick. Un <script> col·locat després
  // del bundle encara arriba a temps de cridar configura().
  arrencaAuto();

  // Desenvolupament local amb Vite: instanciem l'element com faria WordPress.
  const arrel = document.getElementById('root');
  if (arrel && !arrel.innerHTML) {
    const element = document.createElement('soc-de-poble');
    element.setAttribute('fonts-href', '/src/assets/fonts/noto-sans.css');
    element.setAttribute('config', JSON.stringify({
      pluginUrl: '/',
      supabaseUrl: (typeof import.meta !== 'undefined' && import.meta.env)
        ? import.meta.env.VITE_SUPABASE_URL
        : '',
    }));
    arrel.appendChild(element);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

```

--- SRC/UTILS/SANITIZE.JS ---
```javascript
import DOMPurify from 'dompurify';

/**
 * Sanejador d'HTML. ÚNIC punt d'entrada d'HTML a l'arbre.
 *
 * PER QUÈ NO EL FEM A MÀ: un sanejador d'HTML propi és el camí més curt cap a
 * un XSS. Ací la Pedra Seca cedix: el dolor de mantindre DOMPurify és menor que
 * el dolor de reinventar-lo malament. És l'única excepció d'aquest fitxer.
 *
 * Imposat per tooling/gates/tractor-innerhtml.mjs.
 */

let ganxosPosats = false;

function posaGanxos() {
  if (ganxosPosats) return;
  ganxosPosats = true;

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    // 1. Cap far de tercers. Només imatges del nostre origen o data: URI.
    if (node.tagName === 'IMG') {
      const src = node.getAttribute('src') || '';
      const esLocal =
        src.startsWith('/') ||
        src.startsWith('./') ||
        src.startsWith('data:image/') ||
        (typeof window !== 'undefined' && src.startsWith(window.location.origin));
      if (!esLocal) {
        node.removeAttribute('src');
        node.setAttribute('alt', node.getAttribute('alt') || 'Imatge externa bloquejada');
        node.setAttribute('data-sdp-bloquejada', '1');
      }
      node.setAttribute('loading', 'lazy');
      node.setAttribute('decoding', 'async');
      node.setAttribute('referrerpolicy', 'no-referrer');
    }

    // 2. Cap segrest de pestanya, i cap fuita de referent.
    if (node.tagName === 'A' && node.hasAttribute('href')) {
      node.setAttribute('rel', 'noopener noreferrer nofollow');
      if (node.getAttribute('target') === '_blank') {
        node.setAttribute('target', '_blank');
      }
    }
  });
}

export function sanitizeHtml(html) {
  if (!html) return '';
  posaGanxos();
  return DOMPurify.sanitize(String(html), {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'span', 'div', 'img', 'hr', 'code', 'pre'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'class', 'src', 'alt',
      'width', 'height', 'loading', 'decoding', 'referrerpolicy',
      'data-sdp-bloquejada'
    ],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'form', 'input', 'svg', 'math'],
    FORBID_ATTR: ['style', 'srcset', 'formaction', 'ping']
  });
}

/**
 * Netejador de TEXT PLA. NO és un sanejador d'HTML i no ha de ser-ho:
 * React ja escapa el text. Passar text pla per DOMPurify el destrueix
 * («l'aigua < 5 litres & la pedra» → «l'aigua &lt; 5 litres &amp; la pedra»)
 * i el dany és permanent, perquè es guarda escapat a l'Outbox i a Supabase.
 */
export function netejaText(valor, maxim = 4000) {
  return String(valor ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\r\n?/g, '\n')
    .normalize('NFC')
    .trim()
    .slice(0, maxim);
}

```

