import { useSearchParams } from '../../app/contexts/RouterContext';
import { createContext, useContext, useState, useMemo, useDeferredValue, useCallback, useEffect, useRef } from 'react';
import { updateNote } from '../../data/backendPort';
import { showToast } from '../../components/universal/AvisadorEfimer.jsx';
import { sanitizeHtml, netejaText, esFontImatgeSegura } from '../../utils/sanitize.js';
import { useUIState } from '../../app/contexts/UIContext';
import { useUIActions } from '../../app/contexts/UIContext';
import { useNotesData } from './NotesDataContext';
import { useMur } from '../mur/MurContext';

const CAMPS_HTML = new Set(['title', 'subtitle', 'lead', 'content']);

function netejaCamp(field, value) {
  if (CAMPS_HTML.has(field)) return sanitizeHtml(value);
  if (field === 'heroImage') return esFontImatgeSegura(value) ? String(value).trim() : '';
  return netejaText(value);
}

/** Font única de les píndoles d'una nota. Sense accions → serialitzable (payload). */
export function etiquetesDeNota(note, noteFolders, accions = {}) {
  const carpeta = noteFolders.find((f) => f.id === note.folderId)?.name || null;
  const eixida = [];
  if (carpeta) {
    eixida.push({ text: carpeta, className: 'sdp-badge-system',
      onClick: accions.carpeta ? () => accions.carpeta(note.folderId) : undefined });
  }
  // Regla de no-duplicació de la SKILL §4, mecànica i no comentada.
  if (note.category && note.category !== carpeta) {
    eixida.push({ text: note.category, className: 'sdp-badge-category',
      onClick: accions.categoria ? () => accions.categoria(note.category) : undefined });
  }
  for (const etiqueta of note.tags || []) {
    eixida.push({ text: etiqueta, className: 'sdp-badge-tag',
      onClick: accions.etiqueta ? () => accions.etiqueta(etiqueta) : undefined });
  }
  return eixida;
}

const NotesContext = createContext(null);

export function NotesProvider({ children, notaInicialId = null }) {
  const { language, externalConfig } = useUIState();
  const { normalizeSearchText, t } = useUIActions();
  const { noteFolders, notes: rawNotes, creaNota } = useNotesData();
  const { sendSectionSubmission } = useMur();
  
  const knownRevisions = useRef(new Map());

  const [activeFolderId, setActiveFolderId] = useState('f-tot');
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  // useSearchParams eliminat ja que no s'usa
  const [activeNoteId, setActiveNoteId] = useState(notaInicialId || 'n1');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const locale = language === 'ca' ? 'ca-ES' : 'es-ES';

  const [colFoldersCollapsed, setColFoldersCollapsed] = useState(false);
  const [colNotesCollapsed, setColNotesCollapsed] = useState(false);
  const [accCategoriesOpen, setAccCategoriesOpen] = useState(true);
  const [accTagsOpen, setAccTagsOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const [localNoteOverrides, setLocalNoteOverrides] = useState(() => {
    try {
      const stored = sessionStorage.getItem('sdp_notes_drafts');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.warn('sdp_notes_drafts parse error', e);
      return {};
    }
  });
  const setLocalNoteField = useCallback((id, field, value) => {
    setLocalNoteOverrides(prev => {
      const next = {
        ...prev,
        [id]: { ...prev[id], [field]: value }
      };
      try { sessionStorage.setItem('sdp_notes_drafts', JSON.stringify(next)); } catch (e) { console.warn('Error saving drafts', e); }
      return next;
    });
  }, []);

  const notes = useMemo(() => {
    return rawNotes.map((rawNote) => {
      const overrides = localNoteOverrides[rawNote.id] || {};
      const note = { ...rawNote, ...overrides };
      const plainText = String(note.content || '').replace(/<[^>]*>/g, ' ').trim();
      return {
        ...note,
        plainText,
        coverImage: note.heroImage || undefined,
        searchText: normalizeSearchText(`${note.title} ${plainText}`),
        formattedDate: new Date(note.updatedAt || Date.now()).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: '2-digit' }),
        formattedTime: new Date(note.updatedAt || Date.now()).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
      };
    });
  }, [locale, normalizeSearchText, rawNotes, localNoteOverrides]);

  const filteredNotes = useMemo(() => {
    const query = normalizeSearchText(deferredSearchQuery);
    return notes
      .filter((note) => (activeFolderId && activeFolderId !== 'f-tot' ? note.folderId === activeFolderId : true))
      .filter((note) => (activeCategory ? note.category === activeCategory : true))
      .filter((note) => (activeTag ? (note.tags || []).includes(activeTag) : true))
      .filter((note) => (!query ? true : note.searchText.includes(query)));
  }, [activeCategory, activeFolderId, activeTag, deferredSearchQuery, notes, normalizeSearchText]);

  const activeNote = filteredNotes.find((note) => note.id === activeNoteId) || filteredNotes[0] || notes[0];

  const handleSelectFolder = useCallback((id) => {
    setActiveFolderId(id);
    setActiveCategory(null);
    setActiveTag(null);
    if (colNotesCollapsed) setColNotesCollapsed(false);
  }, [colNotesCollapsed]);

  const handleSelectCategory = useCallback((category) => {
    setActiveCategory(category);
    setActiveFolderId(null);
    setActiveTag(null);
    if (colNotesCollapsed) setColNotesCollapsed(false);
  }, [colNotesCollapsed]);

  const handleSelectTag = useCallback((tag) => {
    setActiveTag(tag);
    setActiveFolderId(null);
    setActiveCategory(null);
    if (colNotesCollapsed) setColNotesCollapsed(false);
  }, [colNotesCollapsed]);
  
  const handleSelectNote = useCallback((id) => {
    setActiveNoteId(id);
  }, []);

  /* Si l'usuari navega d'un ?nota=A a un ?nota=B sense desmuntar la secció,
     el proveïdor no es torna a crear i l'estat inicial ja no val. */
  useEffect(() => {
    if (notaInicialId) setActiveNoteId(notaInicialId);
  }, [notaInicialId]);

  const saveNoteField = useCallback(async (noteId, field, value) => {
    if (!noteId) return false;
    const netejat = netejaCamp(field, value);
    
    // Establim l'override local (draft visual) per evitar salts de render.
    setLocalNoteField(noteId, field, netejat);
    
    const baseNote = rawNotes.find(n => n.id === noteId);
    const expectedRevision = knownRevisions.current.has(noteId) 
      ? knownRevisions.current.get(noteId) 
      : (baseNote ? baseNote.revision : undefined);
    
    try {
      const savedNote = await updateNote(noteId, { [field]: netejat }, expectedRevision, externalConfig);
      
      knownRevisions.current.set(noteId, savedNote.revision);
      // En ACK netejem el dirtyField per a confirmar sincronització i guardem la revisió.
      setLocalNoteOverrides(prev => {
        const next = { ...prev };
        if (!next[noteId]) next[noteId] = {};
        
        if (next[noteId][field] === netejat) {
           delete next[noteId][field];
        }
        
        // Sempre apliquem la revisió fresca per evitar errors CAS.
        next[noteId].revision = savedNote.revision;
        
        try { sessionStorage.setItem('sdp_notes_drafts', JSON.stringify(next)); } catch (e) { console.warn('Error saving drafts', e); }
        return next;
      });
      
      return true;
    } catch (e) {
      console.warn("No s'ha pogut guardar la nota en remot:", e);
      if (e.status === 409) {
        showToast('Conflicte: la nota s\'ha actualitzat en un altre dispositiu.', 'error');
      } else {
        showToast('El canvi no ha arribat al servidor. Reintenta-ho.', 'error');
      }
      return false;
    }
  }, [rawNotes, setLocalNoteField, externalConfig]);

  const publishNote = useCallback(async () => {
    if (!activeNote) return;
    
    const labels = etiquetesDeNota(activeNote, noteFolders)
      .map(({ text, className }) => ({ text, className })); // només text i class

    const payload = {
      sectionId: 'mur',
      type: 'feed',
      title: netejaCamp('title', activeNote.title) || 'Sense Títol',
      subtitle: netejaCamp('subtitle', activeNote.subtitle),
      description: netejaCamp('lead', activeNote.lead),
      content: netejaCamp('content', activeNote.content),
      image: netejaCamp('heroImage', activeNote.coverImage) || '/assets/system/ui/logo-socdepoble-cuadrat-verd.svg',
      labels,
      author_name: 'Sóc de Poble',
      author_location: 'La Torre de les Maçanes',
      publish_date: new Date().toISOString()
    };
    
    try {
      await sendSectionSubmission({ sectionId: 'mur', payload });
      await saveNoteField(activeNote.id, 'isPublished', true);
      showToast('Nota publicada correctament al mur!', 'success');
    } catch (err) {
      console.error('Error enviant publicació:', err);
      showToast('Error publicant al mur. Verifica la connexió o l\'entorn.', 'error');
    }
  }, [activeNote, noteFolders, sendSectionSubmission]);

  return (
    <NotesContext.Provider value={{
      notes, filteredNotes, activeNote, activeNoteId, setActiveNoteId: handleSelectNote,
      activeFolderId, handleSelectFolder,
      activeCategory, handleSelectCategory,
      activeTag, handleSelectTag,
      searchQuery, setSearchQuery,
      colFoldersCollapsed, setColFoldersCollapsed,
      colNotesCollapsed, setColNotesCollapsed,
      accCategoriesOpen, setAccCategoriesOpen,
      accTagsOpen, setAccTagsOpen,
      settingsOpen, setSettingsOpen,
      timerActive, setTimerActive,
      timerSeconds, setTimerSeconds,
      saveNoteField, setLocalNoteField, publishNote, creaNota,
      t, noteFolders
    }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  return useContext(NotesContext);
}
