import { createContext, useContext, useState, useMemo, useDeferredValue } from 'react';
import { useAppData } from '../../app/AppDataContext';
import { updateNote } from '../../data/backendPort';
import { showToast } from '../../components/universal/AvisadorEfimer.jsx';
import { sanitizeHtml } from '../../utils/sanitize.js';

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const { language, normalizeSearchText, noteFolders, notes: rawNotes, t, sendSectionSubmission, externalConfig } = useAppData();
  
  const [activeFolderId, setActiveFolderId] = useState('f-root');
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeNoteId, setActiveNoteId] = useState('n1');
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
  const [isCompact, setIsCompact] = useState(false);
  const [mobilePanel, setMobilePanel] = useState('folders'); // 'folders' | 'notes' | 'editor'

  const notes = useMemo(() => {
    return rawNotes.map((note) => {
      const plainText = String(note.content || '').replace(/<[^>]*>/g, ' ').trim();
      return {
        ...note,
        plainText,
        searchText: normalizeSearchText(`${note.title} ${plainText}`),
        formattedDate: new Date(note.updatedAt || Date.now()).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: '2-digit' }),
        formattedTime: new Date(note.updatedAt || Date.now()).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
      };
    });
  }, [locale, normalizeSearchText, rawNotes]);

  const filteredNotes = useMemo(() => {
    const query = normalizeSearchText(deferredSearchQuery);
    return notes
      .filter((note) => (activeFolderId ? note.folderId === activeFolderId : true))
      .filter((note) => (activeCategory ? note.category === activeCategory : true))
      .filter((note) => (!query ? true : note.searchText.includes(query)));
  }, [activeCategory, activeFolderId, deferredSearchQuery, notes, normalizeSearchText]);

  const activeNote = filteredNotes.find((note) => note.id === activeNoteId) || filteredNotes[0] || notes[0];

  const handleSelectFolder = (id) => {
    setActiveFolderId(id);
    setActiveCategory(null);
    if (colNotesCollapsed) setColNotesCollapsed(false);
    setMobilePanel('notes');
  };

  const handleSelectCategory = (category) => {
    setActiveCategory(category);
    setActiveFolderId(null);
    if (colNotesCollapsed) setColNotesCollapsed(false);
    setMobilePanel('notes');
  };
  
  const handleSelectNote = (id) => {
    setActiveNoteId(id);
    setMobilePanel('editor');
  };

  const saveNoteField = async (noteId, field, value) => {
    if (!noteId) return;
    const netejat = sanitizeHtml(value);
    
    // Optimístic update a nivell local seria ideal, però ara només ho enviem al backend.
    try {
      await updateNote(noteId, { [field]: netejat }, externalConfig);
    } catch (e) {
      console.warn("No s'ha pogut guardar la nota en remot:", e);
    }
  };

  const publishNote = async () => {
    if (!activeNote) return;
    
    const labels = [];
    const folderName = noteFolders.find(f => f.id === activeNote.folderId)?.name || 'General';
    labels.push({ text: folderName, className: 'sdp-badge-system' });
    labels.push({ text: 'Mur', className: 'sdp-badge-category' });
    if (activeNote.category) {
      labels.push({ text: activeNote.category, className: 'sdp-badge-category' });
    }
    if (activeNote.tags && Array.isArray(activeNote.tags)) {
      activeNote.tags.forEach(tag => {
        labels.push({ text: tag, className: 'sdp-badge-neutral', style: { border: '1px solid var(--sdp-vora)', backgroundColor: 'transparent' } });
      });
    }

    const payload = {
      sectionId: 'mur',
      type: 'feed',
      title: activeNote.title || 'Sense Títol',
      subtitle: activeNote.subtitle,
      description: activeNote.lead,
      content: activeNote.content,
      image: activeNote.coverImage || '/assets/system/ui/logo-socdepoble-cuadrat-verd.svg',
      labels,
      author_name: 'Sóc de Poble',
      author_location: 'La Torre de les Maçanes',
      publish_date: new Date().toISOString()
    };
    
    try {
      await sendSectionSubmission({ sectionId: 'mur', payload });
      showToast('Nota publicada correctament al mur!', 'success');
    } catch (err) {
      console.error('Error enviant publicació:', err);
      showToast('Error publicant al mur. Verifica la connexió o l\'entorn.', 'error');
    }
  };

  return (
    <NotesContext.Provider value={{
      notes, filteredNotes, activeNote, activeNoteId, setActiveNoteId: handleSelectNote,
      activeFolderId, handleSelectFolder,
      activeCategory, handleSelectCategory,
      searchQuery, setSearchQuery,
      colFoldersCollapsed, setColFoldersCollapsed,
      colNotesCollapsed, setColNotesCollapsed,
      accCategoriesOpen, setAccCategoriesOpen,
      accTagsOpen, setAccTagsOpen,
      settingsOpen, setSettingsOpen,
      timerActive, setTimerActive,
      timerSeconds, setTimerSeconds,
      mobilePanel, setMobilePanel, isCompact, setIsCompact,
      saveNoteField, publishNote,
      t, noteFolders
    }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  return useContext(NotesContext);
}
