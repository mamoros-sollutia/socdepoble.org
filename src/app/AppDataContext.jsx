import { createContext, useContext, useEffect, useMemo, useState, useRef } from 'react';
import {

  APP_SNAPSHOT_STORAGE_KEY,
  getDefaultUserId,
  getHasSupabaseConfig,
  SECTION_SUBMISSIONS_STORAGE_KEY,
  loadAppData,
  getRuntimeDataMode,
  getCurrentUser
} from '../data/backendPort.js';
import { normalizeSearchText, sortPinnedContent } from '../config/contentHelpers';
import { resolveAsset as baseResolveAsset } from '../config/assetResolver';
import { createTranslator, readStoredLanguage, writeStoredLanguage, normalizeLanguage } from '../config/i18n';
import { getVal } from '../config/storage.js';
import { readThemePreference, resolveTheme, writeThemePreference } from '../config/theme';
import { uuid, encua } from '../data/outbox.js';
import { buida, arrancaSincronitzador } from '../data/sincronitzador.js';

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
    const key = item.created_at ? String(item.created_at).slice(0, 7) : 'sense-data';
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

const buildFallbackMessages = (thread) => [
  {
    id: `${getDefaultUserId()}::${thread.id}::fallback-1`,
    ownerUserId: getDefaultUserId(),
    threadId: thread.id,
    messageId: 'fallback-1',
    createdAtTs: 0,
    text: `Hola, soc ${thread.name}.`,
    sender: 'other',
    time: 'Ara'
  },
  {
    id: `${getDefaultUserId()}::${thread.id}::fallback-2`,
    ownerUserId: getDefaultUserId(),
    threadId: thread.id,
    messageId: 'fallback-2',
    createdAtTs: 1,
    text: thread.message || thread.role || 'Vols parlar una estona?',
    sender: 'other',
    time: 'Ara'
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
      return JSON.stringify(externalConfig, (key, val) => typeof val === 'function' ? undefined : val);
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
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 15000);
      try {
        const data = await loadAppData(userId, { ...externalConfig, signal: controller.signal });
        clearTimeout(timeoutId);
        if (cancelled || myGen !== loadGenerationRef.current) return;
        setRawData(data);
        setStatus('ready');
        setError(null);
      } catch (loadError) {
        clearTimeout(timeoutId);
        if (cancelled) return;
        console.warn('[PedraSeca] Mode degradat extrem. loadAppData ha fallat:', loadError);
        // Injectem dades per defecte si cau per complet per a no trencar la UI
        setRawData({
          ownerUserId: userId,
          agents: [], chatThreads: [], chatMessages: [], feedPosts: [], marketItems: [], 
          events: [], towns: [], mediaItems: [], noteFolders: [], 
          notes: [], pages: [], sectionSubmissions: []
        });
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
    
    const onOutboxStatus = (event) => {
      if (event.detail?.status === 'confirmed') {
        attemptRefresh();
      }
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('sdp:refresh-data', onManualRefresh);
    window.addEventListener('sdp:outbox-status', onOutboxStatus);
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
      window.removeEventListener('sdp:outbox-status', onOutboxStatus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      channel?.close();
      broadcastChannelRef.current = null;
    };
  }, [stableExternalConfig, channelNamespace, tenantId, userId]);

  /* P0-3: sense esta crida, `outbox.js` és una cua d'escriptura només:
     guarda els missatges i no els envia mai quan torna la cobertura. */
  useEffect(() => {
    const atura = arrancaSincronitzador(stableExternalConfig);
    return () => {
      if (typeof atura === 'function') atura();
    };
  }, [stableExternalConfig]);

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

      // 1r el disc (Outbox), amb el seu propi tallafocs.
      // Z-Audit: Si el disc falla, NO ho ensenyem a la pantalla per no donar falsos positius d'enviament.
      try {
        await encua({ id: userMessage.id, tipus: 'chat', carrega: userMessage });
      } catch (e) {
        console.error('[OUTBOX] escriptura fallida. Avortant enviament de xat.', e);
        throw e;
      }

      // 2n la pantalla.
      setRawData((current) => ({
        ...current,
        chatMessages: [...(current.chatMessages || []), userMessage]
      }));

      // 3r la xarxa, que ja no pot bloquejar res.
      buida(stableExternalConfig);

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
      return thread ? buildFallbackMessages(thread) : [];
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

      // Z-Audit: 1r el disc (Outbox) amb el seu propi tallafocs
      try {
        await encua({ id, tipus: 'submission', payload: preparedSubmission });
      } catch (e) {
        console.error('[OUTBOX] escriptura fallida per a submission. Avortant.', e);
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
        }

        return next;
      });

      // 3r la xarxa
      buida(stableExternalConfig);
      
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
