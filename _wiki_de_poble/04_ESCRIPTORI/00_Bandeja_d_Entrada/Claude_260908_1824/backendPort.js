// src/data/backendPort.js

let currentImpl = null;
let isLocked = false;

export function setBackendImplementation(impl) {
  if (isLocked) {
    throw new Error('[backendPort] 🔒 Backend bloquejat. Injecció tardana detectada.');
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


const asseguraMetode = (nom) => (...args) => {
  if (!currentImpl || typeof currentImpl[nom] !== 'function') {
    throw new Error(`[backendPort] El mètode "${nom}" no està implementat al backend actual.`);
  }
  return currentImpl[nom](...args);
};

export const getDefaultUserId = asseguraMetode('getDefaultUserId');

export const loadAppData = asseguraMetode('loadAppData');
export const loadCoreContent = asseguraMetode('loadCoreContent');
export const loadMur = asseguraMetode('loadMur');
export const loadXat = asseguraMetode('loadXat');
export const loadMultimedia = asseguraMetode('loadMultimedia');
export const loadNotes = asseguraMetode('loadNotes');
export const appendChatMessages = asseguraMetode('appendChatMessages');

export const appendSectionSubmissionNetworkOnly = asseguraMetode('appendSectionSubmissionNetworkOnly');
export const updateNote = asseguraMetode('updateNote');
export const loginWithMagicLink = asseguraMetode('loginWithMagicLink');
export const loginWithGoogle = asseguraMetode('loginWithGoogle');
export const listMyOrganizations = asseguraMetode('listMyOrganizations');
export const createOrganization = asseguraMetode('createOrganization');
export const updateOrganization = asseguraMetode('updateOrganization');
export const updateProfile = asseguraMetode('updateProfile');
export const updateUserPassword = asseguraMetode('updateUserPassword');
export const getProfile = asseguraMetode('getProfile');
export const recullTornadaOAuth = asseguraMetode('recullTornadaOAuth');
export const logout = asseguraMetode('logout');
export const getCurrentUser = asseguraMetode('getCurrentUser');
export const getBackendConfigurat = asseguraMetode('getBackendConfigurat');
export const getRuntimeDataMode = asseguraMetode('getRuntimeDataMode');
export const normalizeDataMode = asseguraMetode('normalizeDataMode');

// Nous mètodes per al Xat v2 i el pont amb Notes
export const createNote = asseguraMetode('createNote');
export const loadFils = asseguraMetode('loadFils');
export const loadMissatges = asseguraMetode('loadMissatges');
export const enviaMissatge = asseguraMetode('enviaMissatge');
export const marcaLlegit = asseguraMetode('marcaLlegit');
export const creaFilDirecte = asseguraMetode('creaFilDirecte');
export const carregaMembres = asseguraMetode('carregaMembres');
