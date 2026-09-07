import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
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
