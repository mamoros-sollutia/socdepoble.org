import { APP_SEED, APP_SEED_VERSION, CHAT_MESSAGE_SEED, CHAT_THREADS, getDefaultUserId } from './appSeed.js';
import { getVal, setVal, delVal } from '../config/storage.js';
import { getSnapshot, saveSnapshot, esborraTot } from './outbox.js';
import { entraAmbGoogle, gestionaTornada } from './oauthRelay.js';
import { mergeById, mapSectionSubmissionToItem } from './mapejadorSeccions.js';

/**
 * El mode simulat només ha d'existir en desenvolupament. En un build de
 * producció sense config, l'aplicació ha de dir que no pot entrar — no
 * regalar una sessió d'administrador.
 */
const MODE_SIMULAT_PERMES =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.DEV === true
    : false;

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

async function loadLocalAppSnapshot(ownerUserId = getDefaultUserId()) {
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



async function applySectionSubmissionsToData(data, ownerUserId = getDefaultUserId()) {
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
  const supabaseUrl = config.supabaseUrl || (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL?.trim() : '') || '';
  const supabaseAnonKey = config.supabaseAnonKey || (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() : '') || '';
  let dataMode = String(config.dataMode || (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_DATA_MODE : 'local') || 'local').trim().toLowerCase();
  
  if (!['auto', 'seed', 'local', 'hybrid', 'remote'].includes(dataMode)) {
    dataMode = 'local';
  }

  const tenantId = config.tenantId || (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_TENANT_ID?.trim() : '') || '11111111-2222-3333-4444-555555555555';
  
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

