/**
 * contentBackendAdapter.js
 * 
 * Abstracció de l'origen de les dades (Sollutia-First).
 * Permet a l'aplicació React consumir dades sense acoblar-se a un únic backend.
 */

// Mocks o imports futurs
async function fetchFromSollutia(endpoint, params) {
  // Lògica per a cridar a l'API de Sollutia
  return fetch(`/api/sollutia/${endpoint}`, { method: 'POST', body: JSON.stringify(params) }).then(res => res.json());
}

async function fetchFromLocalGraph(endpoint, params) {
  // Lògica per a llegir del graf local de la Wiki
  return import('../../_wiki_de_poble/.graph.json').then(graph => graph.default);
}

async function fetchFromSupabase(endpoint, params) {
  // Lògica per a Supabase (backend actual)
  return fetch(`/api/supabase/${endpoint}`, { method: 'POST', body: JSON.stringify(params) }).then(res => res.json());
}

export const contentBackendAdapter = {
  getTownInfo: async () => {
    if (window.SOLLUTIA_ENV) {
      return fetchFromSollutia('town-info');
    }
    if (window.WIKI_DEV) {
      return fetchFromLocalGraph('town-info');
    }
    return fetchFromSupabase('town-info');
  },
  
  getEntities: async (type) => {
    if (window.SOLLUTIA_ENV) {
      return fetchFromSollutia('entities', { type });
    }
    if (window.WIKI_DEV) {
      return fetchFromLocalGraph('entities', { type });
    }
    return fetchFromSupabase('entities', { type });
  }
};
