import {
  AGENT_LIST,
  CHAT_MESSAGES,
  CHAT_THREADS,
  EVENTS,
  FEED_POSTS,
  MARKET_ITEMS,
  MEDIA_ITEMS,
  PAGE_COPY,
  TOWNS
} from './sectionContent.js';
import { getVal, setVal } from '../config/storage.js';

export const APP_SEED_VERSION = 250026;
import { getDefaultUserId, idConvidat } from './identitat.js';
export { getDefaultUserId, idConvidat };

export const NOTE_FOLDERS_SEED = [
  { id: 'f-root', name: 'General', parentId: null },
  { id: 'f-art', name: 'Articles', parentId: null },
  { id: 'f-poble', name: 'Histories del Poble', parentId: null },
  { id: 'f-prompts', name: 'Prompts de Recerca', parentId: null },
  { id: 'f-captures', name: 'Captures', parentId: null }
];

export const NOTES_SEED = [
  {
    id: 'n1',
    isPublished: true,
    title: 'Bloc de notes',
    subtitle: 'El teu estudi d\'escriptura privat i lliure de distraccions',
    lead: 'Benvingut al teu nou espai editorial. Aquest és un espai on pots escriure, esborrar i organitzar-te com vulgues sense que ningú ho veja. A continuació t\'expliquem com funciona la màquina d\'escriure de Sóc de Poble.',
    categoryId: 'c-sistema',
    type: 'rich-text',
    content: `
      <h3>1. La Identitat Visual: Com escrius, com es llig</h3>
      <p>L'editor està dissenyat perquè allò que veus a la pantalla siga exactament allò que llegiran les usuàries quan ho publiques. Sense sorpreses. La imatge de capçalera s'estén d'extrem a extrem, just per damunt de la teua targeta d'autoria. L'estructura de l'article sempre comença amb un gran Títol (H1), un subtítol (H2) que acompanya la lectura, i una entradilla o resum que convida a entrar en matèria.</p>
      
      <h3>2. Les Eines de Text (La Barra Superior)</h3>
      <p>A la part superior tens la barra de ferramentes d'escriptura. Està pensada per a ser ràpida i intuïtiva:</p>
      <ul>
        <li><strong>Estructura:</strong> Pots inserir encapçalaments (Títols i Subtítols d'apartat) per dividir el text en seccions lògiques i donar ritme a la lectura.</li>
        <li><strong>Llistes:</strong> Utilitza les llistes de punts o llistes numerades per enumerar fets, receptes, materials o arguments.</li>
        <li><strong>Estil:</strong> Tens a la teua disposició la negreta per donar èmfasi, la cursiva per a citacions o localismes, i el text ratllat.</li>
        <li><strong>Enllaços i Multimèdia:</strong> Pots incrustar enllaços a altres pàgines web i inserir vídeos directament dins del text.</li>
      </ul>
      
      <h3>3. Organització al Bancal (La Barra Lateral)</h3>
      <p>A l'esquerra tens el teu arxivador privat. Està dividit en diverses seccions perquè no et perdes mai:</p>
      <ul>
        <li><strong>Carpetes:</strong> Pots crear tantes carpetes com necessites per agrupar articles. Per exemple: "Històries del Poble", "Receptes" o "Captures de recerca".</li>
        <li><strong>Categories i Etiquetes:</strong> Abans de publicar, assegura't de classificar bé la teua nota. Aquestes etiquetes apareixeran tant ací a l'editor com en la publicació final al Mur.</li>
      </ul>

      <h3>4. El Procés de Publicació</h3>
      <p>Tot allò que escrius ací es guarda automàticament i és estrictament <strong>privat</strong>. Ningú ho pot veure fins que tu ho decidisques. Quan tingues un article polit, revisat i llest per vore la llum, simplement hauràs de fer servir el botó de publicar (la bola del món superior) per enviar-lo directament al Mur del teu poble o al teu grup de treball.</p>
      
      <p>Ara, torna a la barra lateral esquerra i clica sobre la "Nota Buida" per començar a escriure la teua pròpia història. El llenç és teu!</p>
    `,
    folderId: 'f-root',
    category: 'Sistema',
    tags: ['Productivitat'],
    heroImage: '/assets/notes/bloc_notes_vintage.jpg',
    createdAt: '2026-04-25T09:00:00.000Z',
    updatedAt: '2026-04-25T09:00:00.000Z'
  },
  {
    id: 'n2',
    isPublished: false,
    title: '',
    subtitle: '',
    lead: '',
    categoryId: null,
    type: 'rich-text',
    content: '',
    folderId: 'f-root',
    category: null,
    tags: [],
    createdAt: '2026-06-25T10:00:00.000Z',
    updatedAt: '2026-06-25T10:00:00.000Z'
  }
];

export const PAGES_SEED = Object.entries(PAGE_COPY).map(([key, page]) => ({
  id: key,
  key,
  ...page
}));

const CHAT_THREAD_ID_SET = new Set(CHAT_THREADS.map((thread) => thread.id));



export { CHAT_THREADS };

export const APP_SEED = {
  agents: AGENT_LIST,
  chatThreads: CHAT_THREADS,
  get chatMessages() {
    return Object.entries(CHAT_MESSAGES)
      .filter(([threadId]) => CHAT_THREAD_ID_SET.has(threadId))
      .flatMap(([threadId, messages]) =>
        messages.map((message, index) => ({
          ...message,
          id: `${getDefaultUserId()}::${threadId}::${message.id ?? index + 1}`,
          ownerUserId: getDefaultUserId(),
          threadId,
          messageId: String(message.id ?? index + 1),
          createdAtTs: index
        }))
      );
  },
  feedPosts: FEED_POSTS,
  marketItems: MARKET_ITEMS,
  events: EVENTS,
  towns: TOWNS,
  mediaItems: MEDIA_ITEMS,
  noteFolders: NOTE_FOLDERS_SEED,
  notes: NOTES_SEED,
  pages: PAGES_SEED
};

export const APP_CONTENT_ROWS = [
  { key: 'agents', payload: AGENT_LIST },
  { key: 'feedPosts', payload: FEED_POSTS },
  { key: 'marketItems', payload: MARKET_ITEMS },
  { key: 'events', payload: EVENTS },
  { key: 'towns', payload: TOWNS },
  { key: 'mediaItems', payload: MEDIA_ITEMS },
  { key: 'noteFolders', payload: NOTE_FOLDERS_SEED },
  { key: 'notes', payload: NOTES_SEED },
  { key: 'pages', payload: PAGES_SEED }
].map((row) => ({
  ...row,
  version: APP_SEED_VERSION
}));
