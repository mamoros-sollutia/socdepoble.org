/**
 * tooling/mocks/sollutiaBackend.js
 * 
 * Mock d'exemple per demostrar i validar el contracte de la Llei de l'Enxufabilitat
 * (Fase 1 de configuració + Fase 2 de segellat).
 * Sollutia usarà un patró similar per a injectar el seu backend.
 */

export const mockSollutiaBackend = {
  loadAppData: async (...args) => {
    console.log('[Sollutia Backend] loadAppData cridat amb:', args);
    return {
      ownerUserId: 'sollutia-user-1',
      chatMessages: [],
      chatThreads: [],
      sectionSubmissions: [],
      feedPosts: [],
      marketItems: [],
      events: [],
      towns: [],
      mediaItems: [],
      noteFolders: [],
      notes: [],
      pages: [],
      agents: []
    };
  },
  
  appendChatMessages: async (messages) => {
    console.log('[Sollutia Backend] appendChatMessages:', messages);
    return messages;
  },
  
  appendSectionSubmissionNetworkOnly: async (submission) => {
    console.log('[Sollutia Backend] appendSectionSubmissionNetworkOnly:', submission);
    return submission;
  },

  getCurrentUser: () => {
    return { id: 'sollutia-user-1', user_metadata: { name: 'Sollutia Admin', role: 'admin' } };
  },

  logout: async () => {
    console.log('[Sollutia Backend] logout');
  }
};

// Validació de l'ordre de càrrega:
// 1. window.SocDePoble hauria d'existir al host abans de fer res (o import { configura } from 'socdepoble')
// 2. Es crida configura()
// 3. Quan l'element es munta, s'activa el segellat

export function simulaInjeccioSollutia() {
  if (typeof window === 'undefined' || !window.SocDePoble) {
    console.error('L\'API global SocDePoble no està exposada!');
    return false;
  }
  
  const { configura, arrenca, estat } = window.SocDePoble;
  
  console.log('Estat abans d\'injectar:', estat());
  
  const resultat = configura({ backend: mockSollutiaBackend });
  console.log('Resultat configuració:', resultat);
  
  console.log('Estat després de configurar (abans del segellat):', estat());
  
  // Opcionalment, el host podria forçar el segellat cridant arrenca()
  // Però normalment s'auto-segella al carregar
  return true;
}
