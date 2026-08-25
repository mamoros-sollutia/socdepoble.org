import { APP_SEED, APP_SEED_VERSION, CHAT_MESSAGE_SEED, CHAT_THREADS, DEFAULT_USER_ID } from './appSeed.js';
import DOMPurify from 'dompurify';
import { getVal, setVal } from '../config/storage.js';


const DEV_FALLBACK_STORAGE_KEY = 'socdepoble-dev-chat-messages';
const APP_SNAPSHOT_STORAGE_KEY = 'socdepoble-app-snapshot-v1';
const CHAT_CONVERSATION_MAP_KEY = 'socdepoble-chat-conversation-map';
const getChatRemoteWriteDisabledKey = (config) => `socdepoble-chat-remote-write-disabled::${getResolvedConfig(config).supabaseUrl || 'none'}`;
const SECTION_SUBMISSIONS_STORAGE_KEY = 'socdepoble-section-submissions-v1';
const getSectionRemoteWriteDisabledKey = (config) => `socdepoble-section-remote-write-disabled::${getResolvedConfig(config).supabaseUrl || 'none'}`;
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

const normalizeText = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();


const firstAsset = (value) => (Array.isArray(value) ? value[0] || null : value || null);
const buildSearchText = (parts) => normalizeText(parts.filter(Boolean).join(' '));

const CONNECTABLE_SECTION_IDS = new Set(['mur', 'mercat', 'events']);













const buildHeaders = (anonKey, extra = {}) => {
  const jwt = getVal('socdepoble-jwt');
  return {
    apikey: anonKey,
    Authorization: `Bearer ${jwt ? jwt : anonKey}`,
    'Content-Type': 'application/json',
    ...extra
  };
};

async function request(path, config, { method = 'GET', headers = {}, body, signal, timeoutMs = 12000 } = {}) {
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
      const text = await response.text();
      throw new Error(`Supabase ${response.status}: ${text || 'Error desconegut.'}`);
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
    ownerUserId: DEFAULT_USER_ID,
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

async function buildSeedAppData(ownerUserId = DEFAULT_USER_ID) {
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
    await setVal(APP_SNAPSHOT_STORAGE_KEY + '-' + snapshot.ownerUserId, snapshot);
  } catch (error) {
    console.warn('saveLocalAppSnapshot error:', error);
  }
}

async function loadLocalAppSnapshot(ownerUserId = DEFAULT_USER_ID) {
  const fallback = await buildSeedAppData(ownerUserId);
  if (typeof window === 'undefined') return fallback;

  try {
    const parsed = await getVal(APP_SNAPSHOT_STORAGE_KEY + '-' + ownerUserId);
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

async function persistMessagesToLocalSnapshot(messages, ownerUserId = DEFAULT_USER_ID) {
  const current = await loadLocalAppSnapshot(ownerUserId);
  const merged = mergeChatMessages(current.chatMessages, messages);
  const nextSnapshot = {
    ...current,
    ownerUserId,
    chatMessages: merged
  };
  await saveLocalAppSnapshot(nextSnapshot);
  await saveDevFallbackMessages(merged);
  return merged;
}

async function loadDevFallbackMessages(ownerUserId = DEFAULT_USER_ID) {
  if (typeof window === 'undefined') {
    return CHAT_MESSAGE_SEED;
  }

  try {
    const parsed = await getVal(DEV_FALLBACK_STORAGE_KEY + '-' + ownerUserId);
    if (!parsed)  return CHAT_MESSAGE_SEED;
    
    if (!Array.isArray(parsed)) return CHAT_MESSAGE_SEED;
    return parsed.filter((message) => message.ownerUserId === ownerUserId);
  } catch {
    return CHAT_MESSAGE_SEED;
  }
}

async function saveDevFallbackMessages(messages) {
  if (typeof window === 'undefined') return;
  try {
    await setVal(DEV_FALLBACK_STORAGE_KEY + '-' + (messages[0]?.ownerUserId || DEFAULT_USER_ID), messages);
  } catch (error) {
    console.warn('saveDevFallbackMessages error:', error);
  }
}

async function loadLocalSectionSubmissions(ownerUserId = DEFAULT_USER_ID) {
  if (typeof window === 'undefined') return [];

  try {
    const parsed = await getVal(SECTION_SUBMISSIONS_STORAGE_KEY + '-' + ownerUserId);
    if (!parsed)  return [];
    
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((submission) => submission?.ownerUserId === ownerUserId || !submission?.ownerUserId);
  } catch {
    return [];
  }
}

async function saveLocalSectionSubmissions(submissions) {
  if (typeof window === 'undefined') return;
  try {
    await setVal(SECTION_SUBMISSIONS_STORAGE_KEY + '-' + (submissions[0]?.ownerUserId || DEFAULT_USER_ID), submissions);
  } catch (error) {
    console.warn('saveLocalSectionSubmissions error:', error);
  }
}

async function persistSectionSubmissionToLocal(submission, ownerUserId = DEFAULT_USER_ID) {
  const current = await loadLocalSectionSubmissions(ownerUserId);
  const next = mergeById(current, [submission]);
  await saveLocalSectionSubmissions(next);
  return next;
}

function persistRemoteSectionWriteDisabled(config) {
  if (typeof window === 'undefined') return;
  try {
    setVal(getSectionRemoteWriteDisabledKey(config), true);
  } catch (error) {
    console.warn('persistRemoteSectionWriteDisabled error:', error);
  }
}

function isRemoteSectionWriteAvailable(config) {
  if (typeof window === 'undefined') return true;
  return getVal(getSectionRemoteWriteDisabledKey(config), false) !== true;
}

function mergeById(primary = [], secondary = []) {
  const map = new Map();
  [...primary, ...secondary].forEach((item) => {
    if (!item) return;
    map.set(String(item.id), item);
  });
  return Array.from(map.values());
}

function mapSectionSubmissionToItem(submission) {
  const payload = submission?.payload && typeof submission.payload === 'object' ? submission.payload : {};
  const sectionId = DOMPurify.sanitize(String(submission?.sectionId || payload.sectionId || '').trim());
  const createdAt = DOMPurify.sanitize(submission?.createdAt || payload.created_at || new Date().toISOString());
  
  // Sanititzar tots els valors string de baseItem
  const sanitizedPayload = Object.fromEntries(
    Object.entries(payload).map(([k, v]) => [k, typeof v === 'string' ? DOMPurify.sanitize(v) : v])
  );

  const baseItem = {
    ...sanitizedPayload,
    id: sanitizedPayload.id || submission.id || generateUUID(),
    sectionId,
    created_at: sanitizedPayload.created_at || createdAt
  };

  if (sectionId === 'mur') {
    return {
      ...baseItem,
      type: baseItem.type || 'post',
      title: baseItem.title || 'Publicació',
      summary: baseItem.summary || baseItem.post_subtitle || baseItem.description || '',
      content: baseItem.content || baseItem.description || baseItem.post_subtitle || '',
      post_subtitle: baseItem.post_subtitle || baseItem.description || '',
      author: baseItem.author || baseItem.author_name || 'Foraster',
      author_name: baseItem.author_name || baseItem.author || 'Foraster',
      author_avatar: baseItem.author_avatar || baseItem.avatar_url || null,
      town_name: baseItem.town_name || 'La Torre de les Maçanes',
      imageSrc: baseItem.imageSrc || firstAsset(baseItem.image_url || baseItem.image || baseItem.avatar_url) || null,
      image_url: baseItem.image_url || baseItem.image || baseItem.imageSrc || null,
      searchText: baseItem.searchText || buildSearchText([
        baseItem.title,
        baseItem.post_subtitle,
        baseItem.description,
        baseItem.content,
        baseItem.author,
        baseItem.author_name,
        baseItem.town_name,
        baseItem.tag,
        baseItem.sectionId
      ])
    };
  }

  if (sectionId === 'mercat') {
    const imageSrc = baseItem.imageSrc || firstAsset(baseItem.image_url || baseItem.image || baseItem.avatar_url) || null;
    return {
      ...baseItem,
      type: baseItem.type || 'product',
      title: baseItem.title || 'Producte',
      description: baseItem.description || baseItem.summary || '',
      summary: baseItem.summary || baseItem.description || '',
      seller: baseItem.seller || baseItem.author_name || 'Foraster',
      avatar_url: baseItem.avatar_url || null,
      imageSrc,
      image_url: baseItem.image_url || baseItem.image || imageSrc || null,
      image: baseItem.image || imageSrc || null,
      category_slug: baseItem.category_slug || 'connectat',
      tag: baseItem.tag || 'Connectat',
      variations: Array.isArray(baseItem.variations) ? baseItem.variations : [],
      searchText: baseItem.searchText || buildSearchText([
        baseItem.title,
        baseItem.description,
        baseItem.summary,
        baseItem.seller,
        baseItem.tag,
        baseItem.category_slug,
        baseItem.sectionId
      ])
    };
  }

  if (sectionId === 'events') {
    return {
      ...baseItem,
      type: baseItem.type || 'event',
      title: baseItem.title || 'Esdeveniment',
      description: baseItem.description || baseItem.summary || '',
      summary: baseItem.summary || baseItem.description || '',
      author_name: baseItem.author_name || baseItem.author || 'Foraster',
      date: baseItem.date || createdAt.slice(0, 10),
      image_url: baseItem.image_url || null,
      searchText: baseItem.searchText || buildSearchText([
        baseItem.title,
        baseItem.description,
        baseItem.summary,
        baseItem.author_name,
        baseItem.type,
        baseItem.sectionId
      ])
    };
  }

  return baseItem;
}

async function applySectionSubmissionsToData(data, ownerUserId = DEFAULT_USER_ID) {
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
    events: mergeById(data.events || [], sectionItems.events || [])
  };
}

async function loadChatConversationMap() {
  if (typeof window === 'undefined') return {};
  try {
    const parsed = await getVal(CHAT_CONVERSATION_MAP_KEY);
    if (!parsed)  return {};
    
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

async function saveChatConversationMap(map) {
  if (typeof window === 'undefined') return;
  try {
    await setVal(CHAT_CONVERSATION_MAP_KEY, map);
  } catch (error) {
    console.warn('saveChatConversationMap error:', error);
  }
}

function persistRemoteChatWriteDisabled(config) {
  if (typeof window === 'undefined') return;
  try {
    setVal(getChatRemoteWriteDisabledKey(config), true);
  } catch (error) {
    console.warn('persistRemoteChatWriteDisabled error:', error);
  }
}



function mergeChatMessages(primary = [], secondary = []) {
  const map = new Map();
  [...primary, ...secondary].forEach((message) => {
    if (!message) return;
    map.set(String(message.id), message);
  });
  return Array.from(map.values()).sort((a, b) => (a.createdAtTs || 0) - (b.createdAtTs || 0));
}













async function loadStructuredSupabaseData(config, ownerUserId) {
  const safeOwnerId = ownerUserId || DEFAULT_USER_ID;
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

async function loadRemoteAppData(config, ownerUserId = DEFAULT_USER_ID) {
  const { hasSupabaseConfig } = getResolvedConfig(config);
  if (!hasSupabaseConfig) {
    throw new Error('Falten VITE_SUPABASE_URL i/o VITE_SUPABASE_ANON_KEY.');
  }

  return loadStructuredSupabaseData(config, ownerUserId);
}

export async function loadAppData(ownerUserId = DEFAULT_USER_ID, config = {}) {
  const loadAndMerge = async (loader) => await applySectionSubmissionsToData(await loader, ownerUserId);
  const { runtimeDataMode, hasSupabaseConfig } = getResolvedConfig(config);

  if (runtimeDataMode === 'seed') {
    return loadAndMerge(await buildSeedAppData(ownerUserId));
  }

  if (runtimeDataMode === 'local') {
    return loadAndMerge(await loadLocalAppSnapshot(ownerUserId));
  }

  if (runtimeDataMode === 'hybrid') {
    if (!hasSupabaseConfig) {
      return loadAndMerge(await loadLocalAppSnapshot(ownerUserId));
    }

    try {
      return await loadAndMerge(loadRemoteAppData(config, ownerUserId));
    } catch {
      return loadAndMerge(await loadLocalAppSnapshot(ownerUserId));
    }
  }

  if (!hasSupabaseConfig) {
    return loadAndMerge(await buildSeedAppData(ownerUserId));
  }

  return loadAndMerge(loadRemoteAppData(config, ownerUserId));
}

export async function appendChatMessages(messages, config = {}) {
  const { runtimeDataMode, hasSupabaseConfig } = getResolvedConfig(config);
  if (runtimeDataMode === 'local' || runtimeDataMode === 'hybrid') {
    const localMerged = await persistMessagesToLocalSnapshot(messages, DEFAULT_USER_ID);
    if (runtimeDataMode === 'local') return localMerged;
  }

  if (runtimeDataMode === 'seed' || !hasSupabaseConfig) {
    const current = await loadDevFallbackMessages(DEFAULT_USER_ID);
    const merged = [...current, ...messages];
    await saveDevFallbackMessages(merged);
    return merged;
  }

  try {
    const { tenantId } = getResolvedConfig(config);
    const rows = messages.map((message) => ({
      id: String(message.id),
      tenant_id: tenantId,
      owner_user_id: message.ownerUserId || DEFAULT_USER_ID,
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

    const current = await loadDevFallbackMessages(DEFAULT_USER_ID);
    const merged = mergeChatMessages(current, messages);
    await saveDevFallbackMessages(merged);
    return merged;
  } catch (error) {
    const message = String(error?.message || '');
    const isRlsDenied =
      message.includes('row-level security policy') ||
      message.includes('"42501"') ||
      message.includes('401') ||
      message.includes('403');

    if (!isRlsDenied) {
      throw error;
    }

    if (runtimeDataMode === 'hybrid') {
      return await persistMessagesToLocalSnapshot(messages, DEFAULT_USER_ID);
    }
    const current = await loadDevFallbackMessages(DEFAULT_USER_ID);
    const merged = mergeChatMessages(current, messages);
    await saveDevFallbackMessages(merged);
    return merged;
  }
}

export async function appendSectionSubmission(submission, config = {}) {
  const { runtimeDataMode, hasSupabaseConfig } = getResolvedConfig(config);
  const ownerUserId = submission?.ownerUserId || DEFAULT_USER_ID;
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

  if (!isRemoteSectionWriteAvailable(config)) {
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
      message.includes('401') ||
      message.includes('403') ||
      message.includes('404') ||
      message.includes('does not exist');

    if (isRemoteUnavailable) {
      setVal(getSectionRemoteWriteDisabledKey(config), true);
      persistRemoteSectionWriteDisabled(config);
    }

    return storedSubmission;
  }
}

export {
  APP_SNAPSHOT_STORAGE_KEY,
  DATA_SYNC_CHANNEL_NAME,
  DEFAULT_USER_ID,
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
  const supabaseUrl = config.supabaseUrl || (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL?.trim() : '') || '';
  const supabaseAnonKey = config.supabaseAnonKey || (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() : '') || '';
  let dataMode = String(config.dataMode || (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_DATA_MODE : 'auto') || 'auto').trim().toLowerCase();
  
  if (!['auto', 'seed', 'local', 'hybrid'].includes(dataMode)) {
    dataMode = 'auto';
  }

  const tenantId = config.tenantId || (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_TENANT_ID?.trim() : '') || '11111111-2222-3333-4444-555555555555';
  
  const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
  const runtimeMode = dataMode === 'auto' ? (hasSupabaseConfig ? 'hybrid' : 'seed') : dataMode;
  
  return {
    supabaseUrl,
    supabaseAnonKey,
    tenantId,
    dataMode: runtimeMode,
    hasSupabaseConfig,
    
    runtimeDataMode: runtimeMode
  };
}


