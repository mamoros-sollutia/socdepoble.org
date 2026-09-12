import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, 'src');

// 1. Create CoreContentContext
const coreContentContextPath = path.join(srcDir, 'app/contexts/CoreContentContext.jsx');
const coreContentContextCode = `import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import { loadCoreContent } from '../../data/backendPort.js';
import { useIdentitat } from './IdentitatContext.jsx';

const CoreContentContext = createContext(null);

export function CoreContentProvider({ children, config }) {
  const { actorId, actorKey } = useIdentitat();
  const [data, setData] = useState({ status: 'loading', error: null, payload: null });
  const loadGen = useRef(0);

  useEffect(() => {
    let active = true;
    const myGen = ++loadGen.current;
    
    async function load() {
      try {
        const payload = await loadCoreContent(actorId, config);
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
    if (data.status !== 'ready' || !data.payload) return { status: data.status, error: data.error, towns: [], pages: [], pageCopy: {}, agents: [] };
    return {
      status: data.status,
      error: data.error,
      towns: data.payload.towns || [],
      pages: data.payload.pages || [],
      pageCopy: data.payload.pageCopy || {},
      agents: data.payload.agents || [],
      ownerUserId: data.payload.ownerUserId,
      refresh: () => setData(prev => ({ ...prev, status: 'loading' }))
    };
  }, [data]);

  return <CoreContentContext.Provider value={value}>{children}</CoreContentContext.Provider>;
}

export function useCoreContent() {
  return useContext(CoreContentContext) || { status: 'loading', towns: [], pages: [], pageCopy: {}, agents: [] };
}
`;

// 2. Create MurContext
const murContextPath = path.join(srcDir, 'sections/mur/MurContext.jsx');
const murContextCode = `import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import { loadMur, appendSectionSubmissionNetworkOnly } from '../../data/backendPort.js';
import { useIdentitat } from '../../app/contexts/IdentitatContext.jsx';
import { useCoreContent } from '../../app/contexts/CoreContentContext.jsx';

const MurContext = createContext(null);

export function MurProvider({ children, config }) {
  const { actorId, actorKey } = useIdentitat();
  const [data, setData] = useState({ status: 'loading', error: null, payload: null });
  const loadGen = useRef(0);

  useEffect(() => {
    let active = true;
    const myGen = ++loadGen.current;
    
    async function load() {
      try {
        const payload = await loadMur(actorId, config);
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
    if (data.status !== 'ready' || !data.payload) return { status: data.status, error: data.error, feedPosts: [], events: [], marketItems: [], sendSectionSubmission: async () => {} };
    return {
      status: data.status,
      error: data.error,
      feedPosts: data.payload.feedPosts || [],
      events: data.payload.events || [],
      marketItems: data.payload.marketItems || [],
      sendSectionSubmission: async (sub) => {
        return await appendSectionSubmissionNetworkOnly(sub, config);
      }
    };
  }, [data, config]);

  return <MurContext.Provider value={value}>{children}</MurContext.Provider>;
}

export function useMur() {
  return useContext(MurContext) || { status: 'loading', feedPosts: [], events: [], marketItems: [], sendSectionSubmission: async () => {} };
}
`;

// 3. Create XatContext
const xatContextPath = path.join(srcDir, 'sections/xat/XatContext.jsx');
const xatContextCode = `import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import { loadXat, appendChatMessages } from '../../data/backendPort.js';
import { useIdentitat } from '../../app/contexts/IdentitatContext.jsx';
import { uuid } from '../../utils/uuid.js';

const XatContext = createContext(null);

export function XatProvider({ children, config }) {
  const { actorId, actorKey } = useIdentitat();
  const [data, setData] = useState({ status: 'loading', error: null, payload: null });
  const loadGen = useRef(0);

  useEffect(() => {
    let active = true;
    const myGen = ++loadGen.current;
    
    async function load() {
      try {
        const payload = await loadXat(actorId, config);
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
    if (data.status !== 'ready' || !data.payload) return { status: data.status, error: data.error, chatThreads: [], chatMessages: [], getThreadMessages: () => [], sendChatMessage: async () => {} };
    
    const { chatThreads, chatMessages } = data.payload;
    const messagesByThread = {};
    (chatMessages || []).forEach(msg => {
      if (!messagesByThread[msg.threadId]) messagesByThread[msg.threadId] = [];
      messagesByThread[msg.threadId].push(msg);
    });

    return {
      status: data.status,
      error: data.error,
      chatThreads: chatThreads || [],
      chatMessages: chatMessages || [],
      getThreadMessages: (threadId) => messagesByThread[threadId] || [],
      sendChatMessage: async (thread, text) => {
         const nowTs = Date.now();
         const messageId = uuid();
         const userMessage = {
           id: \`\${actorId}::\${thread.id}::\${messageId}\`,
           ownerUserId: actorId,
           threadId: thread.id,
           messageId,
           createdAtTs: nowTs,
           text,
           sender: 'me',
           estatEnviament: 'pendent'
         };
         setData(prev => {
            if(!prev.payload) return prev;
            return {
              ...prev,
              payload: {
                ...prev.payload,
                chatMessages: [...(prev.payload.chatMessages || []), userMessage]
              }
            };
         });
         try {
           await appendChatMessages([userMessage], config);
         } catch(e) {
           setData(prev => {
             if(!prev.payload) return prev;
             return {
               ...prev,
               payload: {
                 ...prev.payload,
                 chatMessages: (prev.payload.chatMessages || []).filter(m => m.id !== userMessage.id)
               }
             };
           });
           throw e;
         }
         return [userMessage];
      }
    };
  }, [data, actorId, config]);

  return <XatContext.Provider value={value}>{children}</XatContext.Provider>;
}

export function useXat() {
  return useContext(XatContext) || { status: 'loading', chatThreads: [], chatMessages: [], getThreadMessages: () => [], sendChatMessage: async () => {} };
}
`;

// 4. Create MultimediaContext
const multimediaContextPath = path.join(srcDir, 'sections/multimedia/MultimediaContext.jsx');
const multimediaContextCode = `import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import { loadMultimedia } from '../../data/backendPort.js';
import { useIdentitat } from '../../app/contexts/IdentitatContext.jsx';

const MultimediaContext = createContext(null);

export function MultimediaProvider({ children, config }) {
  const { actorId, actorKey } = useIdentitat();
  const [data, setData] = useState({ status: 'loading', error: null, payload: null });
  const loadGen = useRef(0);

  useEffect(() => {
    let active = true;
    const myGen = ++loadGen.current;
    
    async function load() {
      try {
        const payload = await loadMultimedia(actorId, config);
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
    if (data.status !== 'ready' || !data.payload) return { status: data.status, error: data.error, mediaItems: [] };
    return {
      status: data.status,
      error: data.error,
      mediaItems: data.payload.mediaItems || []
    };
  }, [data]);

  return <MultimediaContext.Provider value={value}>{children}</MultimediaContext.Provider>;
}

export function useMultimedia() {
  return useContext(MultimediaContext) || { status: 'loading', mediaItems: [] };
}
`;

// 5. Update NotesContext
const notesContextPath = path.join(srcDir, 'sections/notes/NotesContext.jsx');
const notesContextCode = `import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import { loadNotes, updateNote as apiUpdateNote } from '../../data/backendPort.js';
import { useIdentitat } from '../../app/contexts/IdentitatContext.jsx';

const NotesContext = createContext(null);

export function NotesProvider({ children, config }) {
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

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  return useContext(NotesContext) || { status: 'loading', notes: [], noteFolders: [], updateNote: async () => {} };
}
`;

function write(p, code) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, code, 'utf8');
  console.log('Created:', p);
}

write(coreContentContextPath, coreContentContextCode);
write(murContextPath, murContextCode);
write(xatContextPath, xatContextCode);
write(multimediaContextPath, multimediaContextCode);
write(notesContextPath, notesContextCode);

console.log('All context files created successfully.');
