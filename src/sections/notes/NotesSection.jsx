import { useDeferredValue, useMemo, useState } from 'react';
import { sanitizeHtml } from '../../utils/sanitize';
import { ChevronLeft, ChevronDown, ChevronRight, FileText, Folder, List, Heading1, Heading2, Type, ListOrdered, CheckSquare, Image as ImageIcon, Video, Link, Bold, Italic, Strikethrough, Sparkles, Download, Plus, Bookmark, Hash, Globe, Search, Settings } from 'lucide-react';
import { UniversalPage, DateTimeControl } from '../../components/universal/UniversalComponents';
import { UniversalSearch } from '../../components/ui/UniversalSearch.jsx';
import { useAppData } from '../../app/AppDataContext';

const CATEGORIES = ['Trellat', 'Patrimoni', 'Dades', 'Social'];
const LANGUAGE_LOCALES = {
  ca: 'ca-ES',
  es: 'es-ES',
  en: 'en-GB',
  eu: 'eu-ES',
  gl: 'gl-ES'
};

export default function NotesSection() {
  const { language, normalizeSearchText, noteFolders, notes: rawNotes, t } = useAppData();
  const [activeFolderId, setActiveFolderId] = useState('f-root');
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeNoteId, setActiveNoteId] = useState('n1');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [mobileView, setMobileView] = useState('list'); // 'folders', 'list', 'editor'
  const [showPublishMenu, setShowPublishMenu] = useState(false);
  const [isFoldersOpen, setIsFoldersOpen] = useState(true); // sidebar collapse
  const [isFoldersAccordionOpen, setIsFoldersAccordionOpen] = useState(true);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isTagsOpen, setIsTagsOpen] = useState(true);
  const [isNotesOpen, setIsNotesOpen] = useState(true);
  const locale = LANGUAGE_LOCALES[language] || 'ca-ES';

  const notes = useMemo(
    () =>
      rawNotes.map((note) => {
        const plainText = String(note.content || '').replace(/<[^>]*>/g, ' ').trim();
        return {
          ...note,
          plainText,
          searchText: normalizeSearchText(`${note.title} ${plainText}`),
          formattedDate: new Date(note.updatedAt).toLocaleDateString(locale, { day: 'numeric', month: 'short' }),
          formattedTime: new Date(note.updatedAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
          formattedDateShort: `${String(new Date(note.updatedAt).getDate()).padStart(2, '0')}/${String(new Date(note.updatedAt).getMonth() + 1).padStart(2, '0')}/${String(new Date(note.updatedAt).getFullYear()).slice(-2)}`
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

  const handleSelectFolder = (id) => {
    setActiveFolderId(id);
    setActiveCategory(null);
    setMobileView('list');
  };

  const handleSelectCategory = (category) => {
    setActiveCategory(category);
    setActiveFolderId(null);
    setMobileView('list');
  };

  const handleBack = () => {
    if (mobileView === 'editor') setMobileView('list');
    else if (mobileView === 'list') setMobileView('folders');
  };

  const getCategoryLabel = (category) => t(`section.notes.category.${category}`, category);

  const handleToggleFolders = () => {
    const nextState = !isFoldersOpen;
    setIsFoldersOpen(nextState);
    if (nextState) setIsNotesOpen(true);
  };

  return (
    <UniversalPage chrome="system" hideHeader={true}>
      <article className="notes-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="topbar mobile-only-topbar">
          <div className="topbar__title">
            <strong>{t('section.notes.mobileTitle', 'Bloc de notes')}</strong>
          </div>
          <div className="sdp-switcher mobile-only" role="tablist">
            <button type="button" role="tab" aria-selected={mobileView === 'folders'} className={`pill ${mobileView === 'folders' ? 'pill--active' : ''}`} onClick={() => setMobileView('folders')}>
              <Folder size={16} /> {t('section.notes.mobileFolders', 'Carpetes')}
            </button>
            <button type="button" role="tab" aria-selected={mobileView === 'list'} className={`pill ${mobileView === 'list' ? 'pill--active' : ''}`} onClick={() => setMobileView('list')}>
              <List size={16} /> {t('section.notes.mobileList', 'Llista')}
            </button>
            <button type="button" role="tab" aria-selected={mobileView === 'editor'} className={`pill ${mobileView === 'editor' ? 'pill--active' : ''}`} onClick={() => setMobileView('editor')}>
              <FileText size={16} /> {t('section.notes.mobileEditor', 'Editor')}
            </button>
          </div>
        </div>

        <div className="notes-shell" style={{ marginTop: '24px', flex: 1, overflow: 'hidden' }}>
          <aside role="complementary" aria-label={t('section.notes.folders', 'Carpetes')} className={`notes-column notes-column--folders ${mobileView === 'folders' ? 'notes-column--mobile' : ''} ${!isFoldersOpen ? 'notes-column--collapsed' : ''}`}>
            <div className="notes-column__head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setIsFoldersAccordionOpen(!isFoldersAccordionOpen)}>
                <Folder size={16} />
                <span className="column-title">{t('section.notes.folders', 'Carpetes')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Plus size={16} style={{ cursor: 'pointer' }} onClick={() => {}} aria-label="Afegeix carpeta" />
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => setIsFoldersAccordionOpen(!isFoldersAccordionOpen)}>
                  {isFoldersAccordionOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', paddingLeft: '4px', borderLeft: '1px solid var(--sdp-vora)' }} onClick={handleToggleFolders}>
                  {isFoldersOpen ? <ChevronLeft size={16} className="collapse-icon" /> : <Folder size={16} className="collapse-icon" />}
                </div>
              </div>
            </div>
            <div className="notes-column__body">
              <nav role="navigation" aria-label={t('section.notes.folders', 'Carpetes')} className="folders-list" style={{ display: isFoldersAccordionOpen ? 'block' : 'none' }}>
                {noteFolders.map((folder) => (
                  <button
                    key={folder.id}
                    type="button"
                    className={`folder-button ${folder.id === activeFolderId ? 'folder-button--active' : ''}`}
                    onClick={() => handleSelectFolder(folder.id)}
                  >
                    <Folder size={16} /> {folder.name}
                  </button>
                ))}
              </nav>

              <div className="notes-category-block">
                <div className="notes-column__head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}>
                    <Bookmark size={16} />
                    <span className="column-title">{t('section.notes.categories', 'Categories')}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Plus size={16} style={{ cursor: 'pointer' }} onClick={() => {}} aria-label="Afegeix categoria" />
                    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}>
                      {isCategoriesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </div>
                </div>
                <div role="group" aria-label={t('section.notes.categories', 'Categories')} className="categories-list" style={{ display: isCategoriesOpen ? 'block' : 'none' }}>
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`folder-button ${category === activeCategory ? 'folder-button--active' : ''}`}
                      onClick={() => handleSelectCategory(category)}
                      style={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                      <Bookmark size={14} /> {getCategoryLabel(category)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="notes-tags-block">
                <div className="notes-column__head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setIsTagsOpen(!isTagsOpen)}>
                    <Hash size={16} />
                    <span className="column-title">Etiquetes</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Plus size={16} style={{ cursor: 'pointer' }} onClick={() => {}} aria-label="Afegeix etiqueta" />
                    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => setIsTagsOpen(!isTagsOpen)}>
                      {isTagsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </div>
                </div>
                <div role="group" aria-label="Etiquetes" className="tags-list" style={{ display: isTagsOpen ? 'block' : 'none' }}>
                  {/* Mock tags for now */}
                  {['#important', '#idea', '#esborrany'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="folder-button"
                      style={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                      <Hash size={14} /> {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section role="region" aria-label={t('nav.notes', 'Notes')} className={`notes-column notes-column--left ${mobileView === 'list' ? 'notes-column--mobile' : ''} ${!isNotesOpen ? 'notes-column--collapsed' : ''}`} style={{ width: '250px', borderRight: '1px solid var(--sdp-vora)', display: 'flex', flexDirection: 'column' }}>
            <div className="notes-column__head" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--sdp-vora)', minHeight: '60px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--sdp-text-titol)' }} className="notes-header-title sdp-flex sdp-items-center sdp-gap-2"><FileText size={16} /> NOTES</span>
            </div>
            <div className="notes-column__body no-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Plus size={16} style={{ cursor: 'pointer' }} onClick={() => {}} aria-label="Afegeix nota" />
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', paddingLeft: '4px', borderLeft: '1px solid var(--sdp-vora)' }} onClick={() => setIsNotesOpen(!isNotesOpen)}>
                  {isNotesOpen ? <ChevronLeft size={16} className="collapse-icon" /> : <List size={16} className="collapse-icon" />}
                </div>
              </div>
              <UniversalSearch
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('section.notes.searchPlaceholder', 'Cerca al bancal...')}
                ariaLabel={t('section.notes.searchAria', 'Cercador de notes')}
              />

              <div className="note-list">
                {filteredNotes.map((note) => {
                  const isActive = note.id === activeNote?.id;
                  return (
                    <button
                      key={note.id}
                      type="button"
                      onClick={() => {
                        setActiveNoteId(note.id);
                        setMobileView('editor');
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '16px',
                        background: isActive ? 'var(--sdp-fons-subtil)' : 'transparent',
                        border: 'none',
                        borderBottom: '1px solid var(--sdp-vora)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'baseline' }}>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--sdp-text-principal)' }}>{note.title}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--sdp-text-secundari)' }}>{note.formattedDateShort}</span>
                      </div>
                      {note.subtitle && (
                        <div style={{ fontSize: '0.95rem', color: 'var(--sdp-text-principal)', marginBottom: '8px', fontWeight: 600 }}>
                          {note.subtitle}
                        </div>
                      )}
                      <div style={{ fontSize: '0.85rem', color: 'var(--sdp-text-secundari)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {note.plainText.slice(0, 100) || t('section.notes.emptyPreview', 'Sense contingut...')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <main className={`notes-column notes-column--editor ${mobileView === 'editor' ? 'notes-column--mobile' : ''}`}>
            <div className="notes-column--middle" style={{ width: '300px', borderRight: '1px solid var(--sdp-vora)', display: 'flex', flexDirection: 'column', background: 'var(--sdp-fons-subtil)' }}>
              <div className="notes-actions-bar" style={{ padding: '8px 16px', borderBottom: '1px solid var(--sdp-vora)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '60px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button aria-label="Cerca" style={{ padding: '0', display: 'flex', alignItems: 'center', color: 'var(--sdp-text-secundari)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <Search size={20} />
                  </button>
                  <button aria-label="Configuració" style={{ padding: '0', display: 'flex', alignItems: 'center', color: 'var(--sdp-text-secundari)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <Settings size={20} />
                  </button>
                </div>
                <button className="btn btn-sm" style={{ background: 'var(--sdp-fons-subtil)', color: 'var(--sdp-text-titol)', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap' }}>
                  CREAR NOTA
                </button>
              </div>
              <div className="notes-column__body no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '16px' }}></div>
            </div>
              <div className="notes-column__head notes-column__head--editor" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', padding: 0 }}>
                {/* Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '52px', padding: '0 16px' }}>
                  <button type="button" className="pill mobile-only" onClick={handleBack}>
                  <ChevronLeft size={16} /> {t('section.notes.back', 'Tornar')}
                  </button>
                  <div className="editor-toolbar" style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
                    <Sparkles size={20} style={{ cursor: 'pointer' }} />
                    <Download size={20} style={{ cursor: 'pointer' }} />
                    <Heading2 size={20} style={{ cursor: 'pointer' }} />
                    <Type size={20} style={{ cursor: 'pointer' }} />
                    <List size={20} style={{ cursor: 'pointer' }} />
                    <ListOrdered size={20} style={{ cursor: 'pointer' }} />
                    <CheckSquare size={20} style={{ cursor: 'pointer' }} />
                    <ImageIcon size={20} style={{ cursor: 'pointer' }} />
                    <Video size={20} style={{ cursor: 'pointer' }} />
                    <Link size={20} style={{ cursor: 'pointer' }} />
                    <Bold size={20} style={{ cursor: 'pointer' }} />
                    <Italic size={20} style={{ cursor: 'pointer' }} />
                    <Strikethrough size={20} style={{ cursor: 'pointer' }} />
                  </div>
                  <div className="editor-toolbar-actions" style={{ marginLeft: '16px' }}>
                    <div 
                      onClick={() => setShowPublishMenu(!showPublishMenu)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        cursor: 'pointer',
                        color: 'var(--sdp-text-principal)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '0.85rem'
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <Globe size={20} />
                      PUBLICAR
                    </div>
                  </div>
                </div>

                {/* Inline Expandable Menu */}
                {showPublishMenu && (
                  <div style={{ 
                    borderTop: '1px solid var(--sdp-vora)', 
                    background: 'var(--sdp-fons-subtil)', 
                    padding: '8px 16px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '4px' 
                  }}>
                    <button className="folder-button" style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px' }}>
                      Públicament al Mur
                    </button>
                    <button className="folder-button" style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px' }}>
                      Al teu Grup de Treball
                    </button>
                    <button className="folder-button" style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px' }}>
                      Només usuaris seleccionats
                    </button>
                  </div>
                )}
              </div>
            <div className="notes-column__body notes-editor" style={{ padding: 0 }}>
              {activeNote ? (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
                    
                    {/* Media Insertion */}
                    {activeNote.heroImage ? (
                      <div className="hero-image" style={{ margin: 0 }}>
                        <img src={activeNote.heroImage} alt="Cover" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 0 }} />
                      </div>
                    ) : (
                      <div style={{ padding: '32px', paddingBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                        <button type="button" className="pill" style={{ borderStyle: 'dashed', background: 'transparent' }}>
                          <ImageIcon size={16} /> Inserir Imatge o Multimèdia
                        </button>
                      </div>
                    )}

                    <div style={{ flexShrink: 0 }}>
                      {/* Orange Bar */}
                      <section className="bar-orange" aria-label="Autoria i data" style={{ margin: 0, borderRadius: 0 }}>
                        <div className="sp-card-author">
                          <img className="sp-card-avatar" src="/assets/system/ui/logo-socdepoble-cuadrat-verd.svg" alt="Sóc de Poble" width="48" height="48" />
                          <div className="sp-card-author-info">
                            <div className="sp-card-author-name">Sóc de Poble</div>
                            <div className="sp-card-author-location">La Torre de les Maçanes</div>
                          </div>
                        </div>
                        <div className="bar-actions">
                          <DateTimeControl 
                            time={activeNote.formattedTime}
                            date={new Date(activeNote.createdAt).toLocaleDateString('ca-ES')} 
                            onClick={() => {
                              // Obrirà el contextual del calendari
                            }}
                          />
                        </div>
                      </section>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: '32px' }}>
                      {/* Inner Universal Card */}
                      <article className="card universal-page" style={{ margin: '0 0 32px 0', padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', borderTopLeftRadius: 0, borderTopRightRadius: 0, borderLeft: 'none', borderRight: 'none', borderBottom: 'none', boxShadow: 'none' }}>
                        
                        <header className="page-title" style={{ margin: '0 0 24px 0', borderBottom: 'none' }}>
                          {!activeNote.heroImage && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                              <button type="button" className="pill" style={{ borderStyle: 'dashed', background: 'transparent' }}>
                                <ImageIcon size={16} /> Inserir Imatge o Multimèdia
                              </button>
                            </div>
                          )}

                          {/* H1 Title */}
                          <h1 
                            className="editor-title-input"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleSaveField('title', e.currentTarget.innerHTML)}
                            style={{ outline: 'none', cursor: 'text', color: 'var(--sdp-accio-text)' }}
                            data-placeholder="Escriu el títol de l'article (H1)..."
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeNote.title || '') }}
                          />

                          {/* Meta Labels (Categories/Tags) */}
                          <ul className="sp-card-labels page-title-labels" style={{ marginTop: '16px', marginBottom: '16px', justifyContent: 'center' }}>
                            <li className="sp-card-label" style={{ backgroundColor: 'var(--sdp-accio)', color: 'var(--sdp-text-invers)', cursor: 'pointer', border: 'none' }}>General</li>
                            {activeNote.category ? (
                              <li className={`sp-card-label ${activeNote.category.toLowerCase() === 'sistema' ? 'sdp-badge-system' : 'sdp-badge-category'}`} style={{ cursor: 'pointer', border: 'none' }}>{activeNote.category}</li>
                            ) : (
                              <li className="sp-card-label sdp-badge-category" style={{ borderStyle: 'dashed', background: 'transparent', cursor: 'pointer' }}>+ Categoria</li>
                            )}
                            {activeNote.tags && activeNote.tags.length > 0 ? (
                              activeNote.tags.map(tag => (
                                <li key={tag} className="sp-card-label sdp-badge-tag" style={{ cursor: 'pointer' }}>{tag}</li>
                              ))
                            ) : (
                              <li className="sp-card-label sdp-badge-tag" style={{ borderStyle: 'dashed', background: 'transparent', cursor: 'pointer' }}>+ Etiqueta</li>
                            )}
                          </ul>

                          {/* Copyright */}
                          <p className="sp-card-copyright page-title-copyright">Com vols publicar? (Ex: Drets d'autor, Creative Commons...)</p>
                        </header>

                        <div className="page-intro" style={{ marginBottom: '24px' }}>
                          {/* H2 Subtitle */}
                          <h2 
                            className="editor-subtitle-input"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleSaveField('subtitle', e.currentTarget.innerHTML)}
                            style={{ outline: 'none', cursor: 'text' }}
                            data-placeholder="Escriu el subtítol (H2)..."
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeNote.subtitle || '') }}
                          />

                          {/* Lead (Entradilla) */}
                          <p 
                            className="lead editor-lead-input"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleSaveField('lead', e.currentTarget.innerHTML)}
                            style={{ outline: 'none', cursor: 'text' }}
                            data-placeholder="Escriu l'entradilla..."
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeNote.lead || '') }}
                          />
                        </div>
                        
                        <div 
                          className="editor-content page-content"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleSaveField('content', e.currentTarget.innerHTML)}
                          style={{ outline: 'none', flex: 1 }}
                          data-placeholder="Açí pots començar a redactar el text del teu article (H3)..."
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeNote.content) }}
                        />
                      </article>
                    </div>
                  </div>
                </>
              ) : (
                <div className="chat-empty">
                  <FileText size={64} />
                  <h2 className="section-title">{t('section.notes.open', 'Obre un solc')}</h2>
                </div>
              )}
            </div>
          </main>
        </div>
      </article>
    </UniversalPage>
  );
}
