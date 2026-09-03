import { APP_SEED, APP_SEED_VERSION, CHAT_THREADS, getDefaultUserId } from './appSeed.js';
import { getVal, setVal, delVal } from '../config/storage.js';
import { entraAmbGoogle, gestionaTornada } from './oauthRelay.js';
import { mergeById, mapSectionSubmissionToItem } from './mapejadorSeccions.js';



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
    noteFolders: (() => {
      const remote = lookup.get('noteFolders') || [];
      const ghostIds = new Set(['f-root', 'f-general', 'f-articles', 'f-histories', 'f-prompts', 'f-captures', 'f-event', 'f-mapa']);
      const ghostNames = new Set(['articles', 'històries del poble', 'captures de recerca', 'receptes']);
      const filteredRemote = remote.filter(f => !ghostIds.has(f.id) && !ghostNames.has((f.name || '').trim().toLowerCase()));
      
      const merged = APP_SEED.noteFolders.map(seedF => filteredRemote.find(f => f.id === seedF.id) || seedF);
      const custom = filteredRemote.filter(f => !APP_SEED.noteFolders.find(s => s.id === f.id));
      
      return [...merged, ...custom];
    })(),
    notes: (() => {
      const remote = lookup.get('notes') || [];
      const seedNotes = APP_SEED.notes.map(seedN => {
        const remoteN = remote.find(n => n.id === seedN.id);
        return { ...(remoteN || seedN), folderId: 'f-mur' };
      });
      const customNotes = remote.filter(n => !APP_SEED.notes.find(s => s.id === n.id));
      return [...seedNotes, ...customNotes];
    })(),
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
    chatMessages: APP_SEED.chatMessages.filter((message) => message.ownerUserId === ownerUserId),
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

  const sectionSubmissions = Array.isArray(sectionSubmissionsResponse?.data) ? sectionSubmissionsResponse.data : [];
  const baseData = mapContentRowsToData(contentRows || []);

  const mergedFeedPosts = mergeById(baseData.feedPosts || [], sectionSubmissions.filter(s => s.section_id === 'mur').map(s => s.payload));
  const mergedMarketItems = mergeById(baseData.marketItems || [], sectionSubmissions.filter(s => s.section_id === 'mercat').map(s => s.payload));
  const mergedEvents = mergeById(baseData.events || [], sectionSubmissions.filter(s => s.section_id === 'events').map(s => s.payload));
  const mergedMediaItems = mergeById(baseData.mediaItems || [], sectionSubmissions.filter(s => s.section_id === 'multimedia').map(s => s.payload));
  const mergedNotes = mergeById(baseData.notes || [], sectionSubmissions.filter(s => s.section_id === 'notes').map(s => s.payload));

  return {
    ...baseData,
    ownerUserId,
    feedPosts: mergedFeedPosts,
    marketItems: mergedMarketItems,
    events: mergedEvents,
    mediaItems: mergedMediaItems,
    notes: mergedNotes,
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
      []
    ),
    sectionSubmissions,
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

export async function loadAppData(ownerUserId = getDefaultUserId(), config = {}) {
  const { runtimeDataMode, hasSupabaseConfig } = getResolvedConfig(config);

  if (runtimeDataMode === 'seed') {
    return buildSeedAppData(ownerUserId);
  }

  if (!hasSupabaseConfig) {
    if (runtimeDataMode === 'remote') throw new Error('Falten VITE_SUPABASE_URL i/o VITE_SUPABASE_ANON_KEY.');
    return buildSeedAppData(ownerUserId);
  }

  return loadStructuredSupabaseData(config, ownerUserId);
}

export async function appendChatMessages(messages, config = {}) {
  const { hasSupabaseConfig, tenantId } = getResolvedConfig(config);
  
  if (!hasSupabaseConfig) {
    throw new Error('No es pot escriure xat sense connexió al servidor.');
  }

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
      Prefer: 'return=representation,resolution=merge-duplicates'
    },
    body: rows
  });

  return messages;
}

export async function appendSectionSubmissionNetworkOnly(submission, config = {}) {
  const { hasSupabaseConfig, tenantId } = getResolvedConfig(config);
  
  if (!hasSupabaseConfig) {
    throw new Error('No es pot escriure publicació sense connexió al servidor.');
  }

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

  await request('/rest/v1/section_submissions?on_conflict=' + encodeURIComponent('id'), config, {
    method: 'POST',
    headers: {
      Prefer: 'return=representation,resolution=merge-duplicates'
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
}

export async function updateNote(id, updates, config = {}) {
  const { hasSupabaseConfig, tenantId } = getResolvedConfig(config);
  
  if (!hasSupabaseConfig) {
    console.warn('Simulant updateNote sense servidor.', { id, updates });
    return { id, ...updates, updated_at: new Date().toISOString() };
  }

  const payload = {
    ...updates,
    updated_at: new Date().toISOString()
  };

  // Lectura prèvia per mantenir la integritat de l'array de notes
  const current = await request(`/rest/v1/app_content?key=eq.notes&tenant_id=eq.${encodeURIComponent(tenantId)}&select=payload`, config);
  let notesArray = [];
  if (Array.isArray(current) && current.length > 0) {
    notesArray = current[0].payload || [];
  }

  const idx = notesArray.findIndex(n => n.id === id);
  if (idx >= 0) {
    notesArray[idx] = { ...notesArray[idx], ...payload };
  } else {
    notesArray.push({ id, ...payload });
  }

  await request(`/rest/v1/app_content?key=eq.notes&tenant_id=eq.${encodeURIComponent(tenantId)}`, config, {
    method: 'PATCH',
    headers: {
      Prefer: 'return=minimal'
    },
    body: { payload: notesArray }
  });
  
  return { id, ...payload };
}

export {
  DATA_SYNC_CHANNEL_NAME,
  getDefaultUserId,
};

export function getBackendConfigurat(config = {}) {
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
  const tenantId = config.tenantId || '11111111-2222-3333-4444-555555555555';
  
  const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
  const dataMode = config.dataMode || 'remote';
  
  return {
    supabaseUrl,
    supabaseAnonKey,
    tenantId,
    dataMode,
    hasSupabaseConfig,
    runtimeDataMode: dataMode
  };
}



export async function registerWithEmail(email, password, name, config = {}) {
  const { tenantId, hasSupabaseConfig } = getResolvedConfig(config);
  
  if (!hasSupabaseConfig) {
    throw new Error('No hi ha connexió configurada amb el servidor Supabase. Registre impossible.');
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
    throw new Error('No hi ha connexió configurada amb el servidor Supabase. Identificació impossible.');
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
  


}

export function getCurrentUser() {
  return getVal('socdepoble-user', null);
}
