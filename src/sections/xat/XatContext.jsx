import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
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
           id: `${actorId}::${thread.id}::${messageId}`,
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
