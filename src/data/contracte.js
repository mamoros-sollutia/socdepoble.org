export const CONTRACTE_NUCLI = Object.freeze([
  'loadCoreContent',
  'loadMur',
  'loadXat',
  'loadMultimedia',
  'loadNotes',
  'appendChatMessages',
  'appendSectionSubmissionNetworkOnly',
  'updateNote',
  'loginWithMagicLink',
  'registerWithPassword',
  'loginWithPassword',
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
  'createNote',
  'loadFils',
  'loadMissatges',
  'enviaMissatge',
  'marcaLlegit',
  'creaFilDirecte',
  'carregaMembres',
  'subscribeToXat',
  'unsubscribeFromXat'
]);

export const CAPACITATS = Object.freeze({
  admin: Object.freeze([
    'adminListUsers',
    'adminListOrganizations'
  ])
});

export const CONTRACTE_BACKEND = Object.freeze([
  ...CONTRACTE_NUCLI,
  ...Object.values(CAPACITATS).flat()
]);
