import { createContext, useContext, useEffect, useMemo, useState, useRef } from 'react';
import {
  appendChatMessages,
  appendSectionSubmission,
  APP_SNAPSHOT_STORAGE_KEY,
  DATA_SYNC_CHANNEL_NAME,
  DEFAULT_USER_ID,
  getHasSupabaseConfig,
  SECTION_SUBMISSIONS_STORAGE_KEY,
  loadAppData,
  getRuntimeDataMode
} from '../data/supabaseBackend';
import { normalizeSearchText, sortPinnedContent } from '../config/contentHelpers';
import { resolveAsset as baseResolveAsset } from '../config/assetResolver';
import { createTranslator, readStoredLanguage, writeStoredLanguage, normalizeLanguage } from '../config/i18n';
import { getVal, setVal } from '../config/storage.js';
import { makeChatReply } from '../sections/xat/chatRuntime';
import { readThemePreference, resolveTheme, writeThemePreference } from '../config/theme';

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

const buildMessageMap = (messages) =>
  messages.reduce((accumulator, message) => {
    const current = accumulator[message.threadId] || [];
    current.push(message);
    current.sort((a, b) => (a.createdAtTs || 0) - (b.createdAtTs || 0));
    accumulator[message.threadId] = current;
    return accumulator;
  }, {});

const buildFallbackMessages = (thread) => [
  {
    id: `${DEFAULT_USER_ID}::${thread.id}::fallback-1`,
    ownerUserId: DEFAULT_USER_ID,
    threadId: thread.id,
    messageId: 'fallback-1',
    createdAtTs: 0,
    text: `Hola, soc ${thread.name}.`,
    sender: 'other',
    time: 'Ara'
  },
  {
    id: `${DEFAULT_USER_ID}::${thread.id}::fallback-2`,
    ownerUserId: DEFAULT_USER_ID,
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
    return () => mq.removeEventListener('change', handler);
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
  const userId = externalConfig?.user?.id || externalConfig?.userId || DEFAULT_USER_ID;
  const channelNamespace = `sdp:${tenantId}:${userId}:v2`;
  
  // Stabilize externalConfig per evitar infinite re-renders sense usar JSON.stringify sencer que peta amb referències circulars
  const stableExternalConfig = useMemo(() => ({ ...externalConfig }), [
    externalConfig?.language,
    externalConfig?.themeMode,
    externalConfig?.tenantId,
    externalConfig?.userId,
    externalConfig?.basePath,
    externalConfig?.pluginUrl,
    externalConfig?.version,
    externalConfig?.manageDocumentHead,
    externalConfig?.supabaseUrl,
    externalConfig?.supabaseAnonKey
  ]);

  const broadcastChannelRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const loadData = async () => {
      try {
        const data = await loadAppData(userId, { ...externalConfig, signal: controller.signal });
        if (cancelled) return;
        setRawData(data);
        setStatus('ready');
        setError(null);
      } catch (loadError) {
        if (cancelled) return;
        setError(loadError);
        setStatus('error');
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
      try {
        const data = await loadAppData(userId, { ...stableExternalConfig, signal: controller.signal });
        if (cancelled) return;
        setRawData(data);
        setStatus('ready');
      } catch {
        if (cancelled) return;
      }
    };

    const attemptRefresh = () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      if (document.hidden) return; // Thundering Herd: visibility gate
      
      const jitter = Math.floor(Math.random() * 200) + 50;
      refreshTimeout = setTimeout(() => {
        refreshData();
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
    
    return [...rawData.towns].sort((a, b) => {
      const timeA = Math.max(townActivity.get(a.title) || 0, new Date(a.created_at).getTime() || 0);
      const timeB = Math.max(townActivity.get(b.title) || 0, new Date(b.created_at).getTime() || 0);
      return timeB - timeA;
    }).map(town => {
      const latestActivity = townActivity.get(town.title);
      const baseTime = new Date(town.created_at).getTime() || 0;
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
    if (!rawData) {
      return {
        status,
        error,
        ownerUserId: DEFAULT_USER_ID,
        hasSupabaseConfig: getHasSupabaseConfig(stableExternalConfig),
        dataMode: getRuntimeDataMode(stableExternalConfig),
        language,
        themeMode,
        t: translator,
        externalConfig: stableExternalConfig
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
      pageDetailLookup
    };
  }, [
    error, language, rawData, status, stableExternalConfig,
    translator, sortedFeedPosts, sortedMarketItems, sortedEvents,
    sortedTowns, featuredTowns, mediaTimelineGroups, pageCopy, pageDetailLookup,
    globalSearchItems, themeMode
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
      const messageId = `${nowTs}`;
      const userMessage = {
        id: `${rawData.ownerUserId}::${thread.id}::${messageId}-me`,
        ownerUserId: rawData.ownerUserId,
        threadId: thread.id,
        messageId: `${messageId}-me`,
        createdAtTs: nowTs,
        text,
        sender: 'me',
        time: new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
      };
      const replyBase = makeChatReply(thread, text);
      const replyMessage = {
        id: `${rawData.ownerUserId}::${thread.id}::${replyBase.id}`,
        ownerUserId: rawData.ownerUserId,
        threadId: thread.id,
        messageId: replyBase.id,
        createdAtTs: nowTs + 1,
        ...replyBase
      };

      await appendChatMessages([userMessage, replyMessage], stableExternalConfig);

      setRawData((current) => ({
        ...current,
        chatMessages: [...current.chatMessages, userMessage, replyMessage]
      }));
      
      try {
        broadcastChannelRef.current?.postMessage({ type: 'content:updated', tenantId });
      } catch (e) {
        // ignore
      }

      return [userMessage, replyMessage];
    };

    const getThreadMessages = (threadId, fallbackThread = null) => {
      const messages = chatMessagesByThread[threadId] || [];
      if (messages.length > 0) return messages;
      const thread = fallbackThread || rawData.chatThreads.find((entry) => entry.id === threadId);
      return thread ? buildFallbackMessages(thread) : [];
    };

    const sendSectionSubmission = async (submission) => {
      const preparedSubmission = {
        ...submission,
        ownerUserId: rawData.ownerUserId
      };
      const persistedSubmission = await appendSectionSubmission(preparedSubmission, stableExternalConfig);
      const item = persistedSubmission.payload || preparedSubmission.payload || preparedSubmission;
      const sectionId = String(persistedSubmission.sectionId || item.sectionId || '').trim();

      setRawData((current) => {
        if (!current) return current;

        const next = {
          ...current,
          sectionSubmissions: appendUniqueById(current.sectionSubmissions || [], persistedSubmission)
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
      
      try {
        broadcastChannelRef.current?.postMessage({ type: 'content:updated', tenantId });
      } catch (e) {
        // ignore
      }

      return persistedSubmission;
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
