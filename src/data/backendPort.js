// src/data/backendPort.js
import * as supabaseImpl from './supabaseBackend.js';

// Implementació per defecte: l'antic Supabase
let currentImpl = {
  loadAppData: supabaseImpl.loadAppData,
  appendChatMessages: supabaseImpl.appendChatMessages,
  appendSectionSubmissionNetworkOnly: supabaseImpl.appendSectionSubmissionNetworkOnly,
  
  loadLocalAppSnapshot: supabaseImpl.loadLocalAppSnapshot,
  applySectionSubmissionsToData: supabaseImpl.applySectionSubmissionsToData,
  
  // Auth
  registerWithEmail: supabaseImpl.registerWithEmail,
  loginWithEmail: supabaseImpl.loginWithEmail,
  loginWithGoogle: supabaseImpl.loginWithGoogle,
  recullTornadaOAuth: supabaseImpl.recullTornadaOAuth,
  logout: supabaseImpl.logout,
  getCurrentUser: supabaseImpl.getCurrentUser,
  
  // Config
  getHasSupabaseConfig: supabaseImpl.getHasSupabaseConfig,
  getRuntimeDataMode: supabaseImpl.getRuntimeDataMode,
  normalizeDataMode: supabaseImpl.normalizeDataMode,
  getResolvedConfig: supabaseImpl.getResolvedConfig,
};

let isLocked = false;

/**
 * Permet a un host (com Sollutia) injectar la seua pròpia implementació
 * de backend, aïllant completament l'App de Supabase.
 */
export function setBackendImplementation(impl) {
  if (isLocked) {
    console.warn('[backendPort] 🔒 Backend bloquejat. No s\'admeten injeccions tardanes (prevenció d\'atacs).');
    return;
  }
  currentImpl = { ...currentImpl, ...impl };
}

export function getBackendImplementation() {
  return currentImpl;
}

export function freezeImplementation() {
  isLocked = true;
  Object.freeze(currentImpl);
}

export function destroy() {
  if (typeof currentImpl.destroy === 'function') {
    currentImpl.destroy();
  }
}

// Re-exportem constants i funcions que no depenen de xarxa
export const APP_SNAPSHOT_STORAGE_KEY = supabaseImpl.APP_SNAPSHOT_STORAGE_KEY;
export const DATA_SYNC_CHANNEL_NAME = supabaseImpl.DATA_SYNC_CHANNEL_NAME;
export const getDefaultUserId = supabaseImpl.getDefaultUserId;
export const SECTION_SUBMISSIONS_STORAGE_KEY = supabaseImpl.SECTION_SUBMISSIONS_STORAGE_KEY;

// Re-exportem la interfície perquè la resta de l'App (AppDataContext, sincronitzador)
// consumisca això en compte de supabaseBackend.js
export const loadAppData = (...args) => currentImpl.loadAppData(...args);
export const appendChatMessages = (...args) => currentImpl.appendChatMessages(...args);
export const loadLocalAppSnapshot = (...args) => currentImpl.loadLocalAppSnapshot(...args);
export const applySectionSubmissionsToData = (...args) => currentImpl.applySectionSubmissionsToData(...args);
export const appendSectionSubmissionNetworkOnly = (...args) => currentImpl.appendSectionSubmissionNetworkOnly(...args);
export const registerWithEmail = (...args) => currentImpl.registerWithEmail(...args);
export const loginWithEmail = (...args) => currentImpl.loginWithEmail(...args);
export const loginWithGoogle = (...args) => currentImpl.loginWithGoogle(...args);
export const recullTornadaOAuth = (...args) => currentImpl.recullTornadaOAuth(...args);
export const logout = (...args) => currentImpl.logout(...args);
export const getCurrentUser = (...args) => currentImpl.getCurrentUser(...args);
export const getHasSupabaseConfig = (...args) => currentImpl.getHasSupabaseConfig(...args);
export const getRuntimeDataMode = (...args) => currentImpl.getRuntimeDataMode(...args);
export const normalizeDataMode = (...args) => currentImpl.normalizeDataMode(...args);
export const getResolvedConfig = (...args) => currentImpl.getResolvedConfig(...args);
