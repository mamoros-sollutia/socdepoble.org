import { useDeferredValue, useMemo, useState, useEffect } from 'react';
import { FileText, Folder, List, Search, Settings, Image as ImageIcon, PanelLeftClose, Bookmark, Hash, Sparkles, Download, Heading2, Type, ListTodo, Video, Link, Bold, Italic, Strikethrough, Globe, Clock, Lock } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { UniversalPage, DateTimeControl, Dropdown, DropdownItem } from '../../components/universal/UniversalComponents';
import { useAppData } from '../../app/AppDataContext';
import { sanitizeHtml } from '../../utils/sanitize.js';

const CATEGORIES = ['Trellat', 'Patrimoni', 'Dades', 'Social'];
const LANGUAGE_LOCALES = {
  ca: 'ca-ES',
  es: 'es-ES',
  en: 'en-GB',
  eu: 'eu-ES',
  gl: 'gl-ES'
};

export default function NotesSection() {
  const { language, normalizeSearchText, noteFolders, notes: rawNotes, t, showToast, sendSectionSubmission } = useAppData();
  
  // State
  const [activeFolderId, setActiveFolderId] = useState('f-root');
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeNoteId, setActiveNoteId] = useState('n1');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const locale = LANGUAGE_LOCALES[language] || 'ca-ES';

  // UI Collapse State
  const [colFoldersCollapsed, setColFoldersCollapsed] = useState(false);
  const [colNotesCollapsed, setColNotesCollapsed] = useState(false);
  const [accCategoriesOpen, setAccCategoriesOpen] = useState(true);
  const [accTagsOpen, setAccTagsOpen] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Timer State
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else if (!timerActive && timerSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs.toString().padStart(2, '0') + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const notes = useMemo(
    () =>
      rawNotes.map((note) => {
        const plainText = String(note.content || '').replace(/<[^>]*>/g, ' ').trim();
        return {
          ...note,
          plainText,
          searchText: normalizeSearchText(`${note.title} ${plainText}`),
          formattedDate: new Date(note.updatedAt).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: '2-digit' }),
          formattedTime: new Date(note.updatedAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
        };
      }),
    [locale, normalizeSearchText, rawNotes]
  );

  const filteredNotes = useMemo(() => {
    const query = normalizeSearchText(deferredSearchQuery);
    return notes
      .filter((note) => (activeFolderId ? note.folderId === activeFolderId : true))
      .filter((note) => (activeCategory ? note.category === activeCategory : true))
      .filter((note) => (!query ? true : note.searchText.includes(query)));
  }, [activeCategory, activeFolderId, deferredSearchQuery, notes, normalizeSearchText]);

  const activeNote = filteredNotes.find((note) => note.id === activeNoteId) || filteredNotes[0] || notes[0];

  const editor = useEditor({
    extensions: [StarterKit],
    content: activeNote?.content || '',
    editorProps: {
      attributes: {
        class: 'editor-content page-content sdp-text-cos sdp-prose focus:outline-none',
        style: 'min-height: 300px; outline: none; flex: 1; line-height: 1.8;'
      },
    },
  });

  useEffect(() => {
    if (editor && activeNote) {
      if (editor.getHTML() !== activeNote.content) {
        editor.commands.setContent(activeNote.content || '');
      }
    }
  }, [activeNote?.id, editor]);

  const handleSelectFolder = (id) => {
    setActiveFolderId(id);
    setActiveCategory(null);
    if (colNotesCollapsed) setColNotesCollapsed(false);
  };

  const handleSelectCategory = (category) => {
    setActiveCategory(category);
    setActiveFolderId(null);
    if (colNotesCollapsed) setColNotesCollapsed(false);
  };

  const getCategoryLabel = (category) => t(`section.notes.category.${category}`, category);

  const handleSaveField = (field, value) => {
    // El valor ve de `e.currentTarget.innerHTML` d'un contentEditable: és HTML
    // arbitrari. Es saneja ACÍ perquè el que s'envie a Supabase ja siga net,
    // no només el que es pinta. Sanejar només al render deixa la càrrega viva
    // a la base de dades per a qualsevol altre consumidor.
    const netejat = sanitizeHtml(value);
    // TODO(260831): connectar amb el port de dades. Fins llavors no desa res.
    return { field, value: netejat };
  };

  const handlePublish = async () => {
    if (!activeNote) return;
    
    // Reproduïm les etiquetes tal com queden a la vista de targeta de l'editor
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
      await sendSectionSubmission({
        sectionId: 'mur',
        payload
      });
      showToast('Nota publicada correctament al mur!', 'success');
    } catch (err) {
      console.warn('Error enviant publicació (mode simulat ho tolera si està actiu optimísticament):', err);
      // Fins i tot si dóna error en mode local, la UI optimística de sendSectionSubmission 
      // ho haurà posat al context (mergedFeedPosts). 
      showToast('Nota afegida al mur (Mode Simulat)', 'success');
    }
  };

  return (
    <UniversalPage
      title={t('section.notes.title', 'Bloc de notes')}
      chrome="system"
      showLogos={true}
    >
      <article style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--sdp-pedra-100)' }}>
        
        {/* CONTENIDOR 3 COLUMNES */}
        <div className="notes-shell" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* COL 1: CARPETES (ESQUERRA) */}
          <aside 
            className="notes-column--left no-scrollbar"
            style={{  
              width: colFoldersCollapsed ? '64px' : '250px', 
              transition: 'width 0.2s ease', 
              flexShrink: 0, 
              overflowY: 'hidden', 
              overflowX: 'hidden',
              borderRight: '1px solid var(--sdp-vora)',
              display: 'flex',
              flexDirection: 'column'}}
          >
            {colFoldersCollapsed ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0', backgroundColor: 'var(--sdp-pedra-700)', color: 'white', height: '56px', flexShrink: 0 }}>
                <button 
                  onClick={() => setColFoldersCollapsed(false)}
                  style={{  width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', color: 'inherit', cursor: 'pointer',  borderRadius: '8px'  }}
                  title="Expandir Carpetes"
                  className="hover-bg"
                >
                  <Folder size={20} />
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: '56px', backgroundColor: 'var(--sdp-pedra-700)', color: 'white', flexShrink: 0 }}>
                  <div style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '13px', letterSpacing: '0.05em' }}>CARPETES</div>
                  <button onClick={() => setColFoldersCollapsed(true)} style={{ background: 'transparent', color: 'inherit', border: 'none', cursor: 'pointer'}} title="Replegar Columna">
                    <PanelLeftClose size={18} />
                  </button>
                </div>
                
                <div className="notes-column__body" style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
                  
                  {/* LLISTA CARPETES */}
                  <div className="folders-list" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '24px' }}>
                    {noteFolders.map((folder) => (
                      <button
                        key={folder.id}
                        type="button"
                        onClick={() => handleSelectFolder(folder.id)}
                        style={{  
                          display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '4px', 
                          background: folder.id === activeFolderId ? 'var(--sdp-pedra-200)' : 'transparent',
                          color: 'inherit',
                          cursor: 'pointer', textAlign: 'left',
                          border: folder.id === activeFolderId ? '1px solid var(--sdp-accent-text)' : '1px solid transparent'
                         }}
                      >
                        <Folder size={16} /> {folder.name}
                      </button>
                    ))}
                  </div>

                  {/* ACCORDION CATEGORIES */}
                  <div style={{ marginBottom: '24px' }}>
                    <button 
                      onClick={() => setAccCategoriesOpen(!accCategoriesOpen)}
                      style={{  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', border: 'none', background: 'transparent', color: 'var(--sdp-text-secundari)', fontSize: '0.85rem', cursor: 'pointer', textTransform: 'uppercase'}}
                      title="Plegar/Desplegar Categories"
                    >
                      CATEGORIES
                    </button>
                    {accCategoriesOpen && (
                      <div className="folders-list" style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {CATEGORIES.map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => handleSelectCategory(category)}
                            style={{  
                              display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '4px', 
                              background: category === activeCategory ? 'var(--sdp-pedra-200)' : 'transparent',
                              color: 'inherit',
                              cursor: 'pointer', textAlign: 'left',
                              border: category === activeCategory ? '1px solid var(--sdp-accent-text)' : '1px solid transparent'
                             }}
                          >
                            <Bookmark size={16} /> {getCategoryLabel(category)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ACCORDION ETIQUETES */}
                  <div>
                    <button 
                      onClick={() => setAccTagsOpen(!accTagsOpen)}
                      style={{  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', border: 'none', background: 'transparent', color: 'var(--sdp-text-secundari)', fontSize: '0.85rem', cursor: 'pointer', textTransform: 'uppercase'}}
                      title="Plegar/Desplegar Etiquetes"
                    >
                      ETIQUETES
                    </button>
                    {accTagsOpen && (
                      <div className="folders-list" style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {['#important', '#idea', '#esborrany'].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            style={{  
                              display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '4px', 
                              background: 'transparent',
                              color: 'inherit',
                              cursor: 'pointer', textAlign: 'left',
                              border: '1px solid transparent'
                             }}
                          >
                            <Hash size={16} /> {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </>
            )}
          </aside>

          {/* COL 2: NOTES (CENTRAL) */}
          <section 
            className="notes-column--middle no-scrollbar"
            style={{  
              width: colNotesCollapsed ? '64px' : '300px', 
              transition: 'width 0.2s ease', 
              flexShrink: 0, 
               
              overflowY: 'hidden', 
              overflowX: 'hidden',
              borderRight: '1px solid var(--sdp-vora)', 
              display: 'flex', 
              flexDirection: 'column' 
             }}
          >
            {colNotesCollapsed ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0', backgroundColor: 'var(--sdp-pedra-700)', color: 'white', height: '56px', flexShrink: 0 }}>
                <button 
                  onClick={() => setColNotesCollapsed(false)}
                  style={{  width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', color: 'inherit', cursor: 'pointer',  borderRadius: '8px'  }}
                  title="Expandir Notes"
                  className="hover-bg"
                >
                  <List size={20} />
                </button>
              </div>
            ) : (
              <>
                {/* Capçalera Column 2 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', height: '56px', backgroundColor: 'var(--sdp-pedra-700)', color: 'white', flexShrink: 0 }}>
                  <div style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '13px', letterSpacing: '0.05em' }}>NOTES</div>
                  <button 
                    onClick={() => setColNotesCollapsed(true)} 
                    style={{ background: 'transparent', color: 'inherit', border: 'none', cursor: 'pointer'}}
                    title="Replegar Columna"
                  >
                    <PanelLeftClose size={18} />
                  </button>
                </div>
                
                {/* Cerca i accions */}
                <div className="notes-column__body" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
                  <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <button className="btn-icon" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--sdp-text-cos)' }} title="Cercar">
                        <Search size={20} />
                      </button>
                      <div style={{ position: 'relative' }}>
                        <button 
                          onClick={() => setSettingsOpen(!settingsOpen)}
                          style={{ border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', position: 'relative', background: 'transparent', color: 'var(--sdp-text-cos)' }}
                          title="Ajustaments i Timer"
                        >
                          <Settings size={20} />
                          {timerActive && (
                            <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', borderRadius: '50%', boxShadow: '0 0 0 2px var(--sdp-fons-superficie)', background: 'var(--sdp-accent)' }} />
                          )}
                        </button>
                        {settingsOpen && (
                          <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', border: '1px solid var(--sdp-vora)', borderRadius: '8px', boxShadow: 'var(--sdp-ombra-3)', padding: '8px', minWidth: '180px', zIndex: 50, background: 'var(--sdp-fons-superficie)' }}>
                            <div style={{ padding: '8px', borderBottom: '1px solid var(--sdp-vora)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px'}}><Clock size={14}/> Temps:</span>
                              <span >{formatTime(timerSeconds)}</span>
                            </div>
                            <button 
                              onClick={() => setTimerActive(!timerActive)}
                              style={{ width: '100%', padding: '8px', textAlign: 'left', border: 'none', cursor: 'pointer', borderRadius: '4px', background: 'transparent', color: 'inherit'}}
                              className="hover-bg"
                            >
                              {timerActive ? 'Aturar Temporitzador' : 'Iniciar Temporitzador'}
                            </button>
                            {timerSeconds > 0 && !timerActive && (
                              <button 
                                onClick={() => setTimerSeconds(0)}
                                style={{ width: '100%', padding: '8px', textAlign: 'left', border: 'none', cursor: 'pointer', borderRadius: '4px', background: 'transparent', color: 'inherit' }}
                                className="hover-bg"
                              >
                                Reiniciar Temps
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <button className="btn btn-sm" style={{ cursor: 'pointer', border: '1px solid var(--sdp-vora)', borderRadius: '20px', padding: '8px 16px', whiteSpace: 'nowrap', background: 'var(--sdp-pedra-200)', color: 'var(--sdp-text-titol)' }}>
                      CREAR NOTA
                    </button>
                  </div>

                <div className="notes-column__scroll" style={{ flex: 1, padding: '0 16px 16px 16px', overflowY: 'auto' }}>
                  <div className="note-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredNotes.map((note) => {
                      const isActive = note.id === activeNote?.id;
                      return (
                        <button
                          key={note.id}
                          type="button"
                          onClick={() => setActiveNoteId(note.id)}
                          style={{  
                            textAlign: 'left', padding: '16px', borderRadius: '8px', 
                            border: isActive ? '1px solid var(--sdp-accent-text)' : '1px solid var(--sdp-vora)', 
                            background: isActive ? 'var(--sdp-pedra-200)' : 'transparent',
                            color: 'inherit',
                            cursor: 'pointer',
                            boxShadow: isActive ? 'var(--sdp-ombra-1)' : 'none'
                           }}
                        >
                          <div className="conversation-meta">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                              <strong style={{    lineHeight: '1.2'  }}>{note.title || 'Sense títol'}</strong>
                              <span style={{    whiteSpace: 'nowrap', marginLeft: '8px'  }}>{note.formattedDate}</span>
                            </div>
                            <span className="conversation-preview" style={{    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'  }}>
                              {note.subtitle || t('section.notes.emptyPreview', 'Sense contingut...')}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              </>
            )}
          </section>

          {/* COL 3: EDITOR PRINCIPAL */}
          <main 
            className="notes-column--editor no-scrollbar"
            style={{  flex: 1, overflowY: 'hidden', display: 'flex', flexDirection: 'column'}}
          >
            {activeNote ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                
                {/* TOOLBAR EDITOR */}
                <div className="editor-toolbar" style={{  display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', height: '56px', backgroundColor: 'var(--sdp-pedra-800)', color: 'white', flexShrink: 0 }}>
                  <div style={{  display: 'flex', gap: '16px'}}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ background: 'transparent', color: 'inherit', border: 'none', cursor: 'pointer'}}><Sparkles size={18} /></button>
                      <button style={{ background: 'transparent', color: 'inherit', border: 'none', cursor: 'pointer'}}><Download size={18} /></button>
                    </div>
                    <div style={{  width: '1px', backgroundColor: 'var(--sdp-pedra-600)'}}></div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: editor?.isActive('heading', { level: 2 }) ? 'var(--sdp-accent)' : 'inherit' }}><Heading2 size={18} /></button>
                      <button style={{ background: 'transparent', color: 'inherit', border: 'none', cursor: 'pointer'}}><Type size={18} /></button>
                      <button onClick={() => editor?.chain().focus().toggleBulletList().run()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: editor?.isActive('bulletList') ? 'var(--sdp-accent)' : 'inherit' }}><List size={18} /></button>
                      <button style={{ background: 'transparent', color: 'inherit', border: 'none', cursor: 'pointer'}}><ListTodo size={18} /></button>
                    </div>
                    <div style={{  width: '1px', backgroundColor: 'var(--sdp-pedra-600)'}}></div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ background: 'transparent', color: 'inherit', border: 'none', cursor: 'pointer'}}><ImageIcon size={18} /></button>
                      <button style={{ background: 'transparent', color: 'inherit', border: 'none', cursor: 'pointer'}}><Video size={18} /></button>
                      <button style={{ background: 'transparent', color: 'inherit', border: 'none', cursor: 'pointer'}}><Link size={18} /></button>
                    </div>
                    <div style={{  width: '1px', backgroundColor: 'var(--sdp-pedra-600)'}}></div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => editor?.chain().focus().toggleBold().run()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: editor?.isActive('bold') ? 'var(--sdp-accent)' : 'inherit' }}><Bold size={18} /></button>
                      <button onClick={() => editor?.chain().focus().toggleItalic().run()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: editor?.isActive('italic') ? 'var(--sdp-accent)' : 'inherit' }}><Italic size={18} /></button>
                      <button onClick={() => editor?.chain().focus().toggleStrike().run()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: editor?.isActive('strike') ? 'var(--sdp-accent)' : 'inherit' }}><Strikethrough size={18} /></button>
                    </div>
                  </div>
                  <div>
                    <button 
                      onClick={handlePublish}
                      style={{  display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--sdp-pedra-500)', background: 'transparent', color: 'white', borderRadius: '20px', padding: '6px 16px',  cursor: 'pointer'}}>
                      <Globe size={16} /> PUBLICAR
                    </button>
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                  {/* Imatge Capçalera (Hero Image) */}
                  {activeNote.heroImage && (
                  <div className="hero-image" style={{ margin: 0, width: '100%', flexShrink: 0 }}>
                    <img src={activeNote.heroImage} alt="Cover" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }} />
                  </div>
                )}

                {/* Barra Taronja */}
                <section className="bar-orange" aria-label="Autoria i data" style={{  margin: 0, borderRadius: 0,  padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <div className="sp-card-author" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img className="sp-card-avatar" src="/assets/system/ui/logo-socdepoble-cuadrat-verd.svg" alt="Sóc de Poble" width="48" height="48" />
                    <div className="sp-card-author-info">
                      <div className="sp-card-author-name" >Sóc de Poble</div>
                      <div className="sp-card-author-location" style={{   opacity: 0.9  }}>La Torre de les Maçanes</div>
                    </div>
                  </div>
                  <div className="bar-actions" style={{ position: 'relative', opacity: 0.9, display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Dropdown
                      right
                      minWidth="320px"
                      trigger={
                        <button 
                          type="button" 
                          className="btn-date-time sp-card-time"
                          style={{ borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: '#fff', cursor: 'pointer' }}
                        >
                          <Lock size={16} />
                        </button>
                      }
                    >
                      <div style={{ padding: '8px 16px 12px 16px', borderBottom: '1px solid var(--sdp-vora)', marginBottom: '4px' }}>
                        <strong style={{ display: 'block', marginBottom: '8px', color: 'var(--sdp-text-titol)' }}>Mode Edició</strong>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--sdp-text-cos)', lineHeight: '1.4' }}>
                          Aquesta targeta és una previsualització de com quedarà al Mur. Utilitza l'editor inferior per modificar el contingut.
                        </p>
                      </div>
                      <DropdownItem icon={<Lock size={16} />} onClick={() => {}}>Privada (Oculta)</DropdownItem>
                      <DropdownItem icon={<Globe size={16} />} onClick={() => {}}>Pública al Mur</DropdownItem>
                    </Dropdown>
                    <DateTimeControl time={activeNote.formattedTime} date={activeNote.formattedDate} />
                  </div>
                </section>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 32px 32px 32px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                  <article className="card universal-page" style={{  margin: 0, padding: 0, flex: 1, display: 'flex', flexDirection: 'column', border: 'none', boxShadow: 'none'}}>
                    
                    <header className="page-title" style={{ margin: '0 0 24px 0', padding: 0, borderBottom: 'none' }}>
                      
                      {/* Logo Sóc de Poble Gran */}
                      <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
                        <img 
                          src="/assets/system/ui/logo-socdepoble-rect-negre.svg" 
                          alt="Sóc de Poble" 
                          style={{ width: '100%', maxWidth: '600px', height: 'auto', objectFit: 'contain' }} 
                          className="light-only"
                        />
                        <img 
                          src="/assets/system/ui/logo-socdepoble-rect-blanc.svg" 
                          alt="Sóc de Poble" 
                          style={{ width: '100%', maxWidth: '600px', height: 'auto', objectFit: 'contain' }} 
                          className="dark-only"
                        />
                      </div>
                      
                      {!activeNote.heroImage && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                          <button type="button" className="pill" style={{  borderStyle: 'dashed',  cursor: 'pointer'}}>
                            <ImageIcon size={16} /> Inserir Imatge o Multimèdia
                          </button>
                        </div>
                      )}

                      {/* H1 Títol */}
                      <h1 
                        className="editor-title-input"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleSaveField('title', e.currentTarget.innerHTML)}
                        style={{  outline: 'none', cursor: 'text',    textAlign: 'center', marginBottom: '16px', lineHeight: '1.2'  }}
                        data-placeholder="Escriu el títol de l'article (H1)..."
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeNote.title || '') }}
                      />

                      {/* Etiquetes de Sistema i Categories */}
                      <ul className="sp-card-labels page-title-labels" style={{ margin: '24px 0 24px 0', justifyContent: 'center', display: 'flex', gap: '8px', listStyle: 'none', padding: 0, flexWrap: 'wrap' }}>
                        <li className="sp-card-label sdp-badge-system">{noteFolders.find(f => f.id === activeNote.folderId)?.name || 'General'}</li>
                        <li className="sp-card-label sdp-badge-category">Mur</li>
                        {activeNote.category && (
                          <li className="sp-card-label sdp-badge-category">{activeNote.category}</li>
                        )}
                        {activeNote.tags?.map(tag => (
                          <li key={tag} className="sp-card-label sdp-badge-neutral" style={{ border: '1px solid var(--sdp-vora)', backgroundColor: 'transparent' }}>{tag}</li>
                        ))}
                      </ul>

                      {/* Copyright */}
                      <p className="sp-card-copyright page-title-copyright" style={{  textAlign: 'center',   margin: '16px 0 32px 0'  }}>
                        © Sóc de Poble / Fet per la IAIA i Nano Banana
                      </p>
                    </header>

                    <div className="page-intro" style={{ marginBottom: '32px' }}>
                      {/* H2 Subtítol */}
                      <h2 
                        className="editor-subtitle-input"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleSaveField('subtitle', e.currentTarget.innerHTML)}
                        style={{  outline: 'none', cursor: 'text',    textAlign: 'center', marginBottom: '24px', lineHeight: '1.3'  }}
                        data-placeholder="Escriu el subtítol (H2)..."
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeNote.subtitle || '') }}
                      />

                      {/* Entradilla */}
                      <p 
                        className="lead editor-lead-input"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleSaveField('lead', e.currentTarget.innerHTML)}
                        style={{  outline: 'none', cursor: 'text',  lineHeight: '1.6',  marginBottom: '24px', textAlign: 'center'  }}
                        data-placeholder="Escriu l'entradilla..."
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeNote.lead || '') }}
                      />
                    </div>
                    
                    {/* Contingut Ric (TipTap) */}
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <EditorContent editor={editor} />
                    </div>
                  </article>
                </div>
              </div>
            </div>
          ) : (
              <div className="chat-empty" style={{  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                <FileText size={64} />
                <h2 className="section-title" style={{ marginTop: '16px' }}>{t('section.notes.open', 'Obre un solc')}</h2>
              </div>
            )}
          </main>

        </div>
      </article>
    </UniversalPage>
  );
}
