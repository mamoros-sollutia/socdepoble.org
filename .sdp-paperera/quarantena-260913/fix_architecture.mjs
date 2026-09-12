import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('src');

// 1. Rename NotesContext (my data context) to NotesDataContext if it exists, but wait, I overwrote NotesContext with git show.
// I will just re-create NotesDataContext.jsx with the data fetching logic!
const notesDataContextPath = path.join(srcDir, 'sections/notes/NotesDataContext.jsx');
const notesDataContextCode = `import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import { loadNotes, updateNote as apiUpdateNote } from '../../data/backendPort.js';
import { useIdentitat } from '../../app/contexts/IdentitatContext.jsx';

const NotesDataContext = createContext(null);

export function NotesDataProvider({ children, config }) {
  const { actorId, actorKey } = useIdentitat();
  const [data, setData] = useState({ status: 'loading', error: null, payload: null });
  const loadGen = useRef(0);

  useEffect(() => {
    let active = true;
    const myGen = ++loadGen.current;
    
    async function load() {
      try {
        const payload = await loadNotes(actorId, config);
        if (!active || myGen !== loadGen.current) return;
        setData({ status: 'ready', error: null, payload });
      } catch (error) {
        if (!active) return;
        setData({ status: 'error', error, payload: null });
      }
    }
    
    load();
    return () => { active = false; };
  }, [actorKey, config]);

  const value = useMemo(() => {
    if (data.status !== 'ready' || !data.payload) return { status: data.status, error: data.error, notes: [], noteFolders: [], updateNote: async () => {} };
    return {
      status: data.status,
      error: data.error,
      notes: data.payload.notes || [],
      noteFolders: data.payload.noteFolders || [],
      updateNote: async (id, updates, rev) => {
        return await apiUpdateNote(id, updates, rev, config);
      }
    };
  }, [data, config]);

  return <NotesDataContext.Provider value={value}>{children}</NotesDataContext.Provider>;
}

export function useNotesData() {
  return useContext(NotesDataContext) || { status: 'loading', notes: [], noteFolders: [], updateNote: async () => {} };
}
`;
fs.writeFileSync(notesDataContextPath, notesDataContextCode, 'utf8');

// 2. Re-create AppDataContext.jsx to wrap the decoupled providers!
const appDataContextPath = path.join(srcDir, 'app/AppDataContext.jsx');
const appDataContextCode = `import React, { createContext, useContext, useMemo } from 'react';
import { useUIState, useUIActions } from './contexts/UIContext.jsx';
import { CoreContentProvider, useCoreContent } from './contexts/CoreContentContext.jsx';
import { MurProvider, useMur } from '../sections/mur/MurContext.jsx';
import { NotesDataProvider, useNotesData } from '../sections/notes/NotesDataContext.jsx';
import { XatProvider, useXat } from '../sections/xat/XatContext.jsx';
import { MultimediaProvider, useMultimedia } from '../sections/multimedia/MultimediaContext.jsx';
import { useSession } from './contexts/SessionContext.jsx';
import { normalizeSearchText, sortPinnedContent } from '../config/contentHelpers';
import { resolveAsset as baseResolveAsset } from '../config/assetResolver';
import { useIdentitat } from './contexts/IdentitatContext.jsx';

const AppStateContext = createContext(null);
const AppActionsContext = createContext(null);

const sortEvents = (items) =>
  [...items].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const timeA = Number.isNaN(dateA.getTime()) ? 0 : dateA.getTime();
    const timeB = Number.isNaN(dateB.getTime()) ? 0 : dateB.getTime();
    return timeB - timeA;
  });

function AppDataFacade({ children, config }) {
  const uiState = useUIState();
  const uiActions = useUIActions();
  const core = useCoreContent();
  const mur = useMur();
  const notesData = useNotesData();
  const xat = useXat();
  const multimedia = useMultimedia();
  const { currentUser } = useSession();
  const { actorId } = useIdentitat();

  const statuses = [core.status, mur.status, notesData.status, xat.status, multimedia.status];
  const isError = statuses.some(s => s === 'error');
  const isLoading = statuses.some(s => s === 'loading');
  const status = isError ? 'error' : (isLoading ? 'loading' : 'ready');
  const error = core.error || mur.error || notesData.error || xat.error || multimedia.error;

  const sortedFeedPosts = useMemo(() => sortPinnedContent(mur.feedPosts || []), [mur.feedPosts]);
  const sortedMarketItems = useMemo(() => sortPinnedContent(mur.marketItems || []), [mur.marketItems]);
  const sortedEvents = useMemo(() => sortEvents(mur.events || []), [mur.events]);
  const featuredTowns = useMemo(() => (core.towns || []).slice(0, 6), [core.towns]);

  const globalSearchItems = useMemo(() => [
    ...(core.agents || []),
    ...(xat.chatThreads || []),
    ...(mur.feedPosts || []),
    ...(mur.marketItems || []),
    ...(mur.events || []),
    ...(core.towns || [])
  ], [core.agents, xat.chatThreads, mur.feedPosts, mur.marketItems, mur.events, core.towns]);

  const stateValue = useMemo(() => ({
    status,
    error,
    ownerUserId: actorId,
    externalConfig: config,
    isSuperAdmin: currentUser?.user_metadata?.role === 'superadmin',
    currentUser,
    
    // Core
    towns: core.towns,
    pages: core.pages,
    pageCopy: core.pageCopy,
    agents: core.agents,
    featuredTowns,
    
    // Mur
    feedPosts: mur.feedPosts,
    events: mur.events,
    marketItems: mur.marketItems,
    sortedFeedPosts,
    sortedMarketItems,
    sortedEvents,

    // Notes
    notes: notesData.notes,
    noteFolders: notesData.noteFolders,

    // Xat
    chatThreads: xat.chatThreads,
    chatMessages: xat.chatMessages,

    // Multimedia
    mediaItems: multimedia.mediaItems,

    // UI State
    ...uiState,
    globalSearchItems
  }), [
    status, error, actorId, config, currentUser, core, mur, notesData, xat, multimedia,
    featuredTowns, sortedFeedPosts, sortedMarketItems, sortedEvents, uiState, globalSearchItems
  ]);

  const actionsValue = useMemo(() => ({
    ...uiActions,
    normalizeSearchText,
    getThreadMessages: xat.getThreadMessages,
    sendChatMessage: xat.sendChatMessage,
    sendSectionSubmission: mur.sendSectionSubmission,
    resolveAsset: (path) => baseResolveAsset(path, config?.basePath, config?.pluginUrl, config?.version),
    updateNote: notesData.updateNote
  }), [uiActions, xat, mur, notesData, config]);

  return (
    <AppStateContext.Provider value={stateValue}>
      <AppActionsContext.Provider value={actionsValue}>
        {children}
      </AppActionsContext.Provider>
    </AppStateContext.Provider>
  );
}

export function AppDataProvider({ children, config = {} }) {
  return (
    <CoreContentProvider config={config}>
      <MurProvider config={config}>
        <NotesDataProvider config={config}>
          <XatProvider config={config}>
            <MultimediaProvider config={config}>
              <AppDataFacade config={config}>
                {children}
              </AppDataFacade>
            </MultimediaProvider>
          </XatProvider>
        </NotesDataProvider>
      </MurProvider>
    </CoreContentProvider>
  );
}

export function useAppData() {
  const state = useContext(AppStateContext);
  const actions = useContext(AppActionsContext);
  if (!state || !actions) {
    throw new Error('useAppData dins de AppDataProvider.');
  }
  return { ...state, ...actions };
}
`;
fs.writeFileSync(appDataContextPath, appDataContextCode, 'utf8');
console.log('Fixed AppDataContext');
