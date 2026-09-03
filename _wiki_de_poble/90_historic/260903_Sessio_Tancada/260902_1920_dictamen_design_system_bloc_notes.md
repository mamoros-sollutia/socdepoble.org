---
tipus: dictamen
estat: canonic
description: "🏛️ DICTAMEN DEL CONSELL: DESIGN SYSTEM PER AL BLOC DE NOTES (SÓC DE POBLE)"
---

# 🏛️ DICTAMEN DEL CONSELL: DESIGN SYSTEM PER AL BLOC DE NOTES (SÓC DE POBLE)

> **Ancoratge**: aquest document pertany a l'[[00_INDEX_ESCRIPTORI]] i respon formalment a la petició [[260902_1907_PROMPT_auditoria]] basada en el context termodinàmic de [[260902_1907_BUNDLE_auditoria]].

---

## 1. DIAGNÒSTIC FORENSE: QUÈ VA TRENCAR LA DISPOSICIÓ?

L'auditoria dels fitxers `src/sections/notes/` i de l'esquelet `PedraSecaEmbed.jsx` revela **3 fallades estructurals precises**:

1. **Aïllament del Shadow DOM (CSS Fantasma):**
   `NotesSection.jsx` fa `import './NotesSection.css'`. Tanmateix, l'aplicació s'executa encapsulada en el Web Component `<soc-de-poble>` amb Shadow Root (`attachShadow`). Vite injecta els fitxers CSS importats al `<head>` del document pare. Com que les regles del `<head>` no penetren el límit del Shadow DOM, cap estil de `NotesSection.css` s'estava aplicant a la interfície.
2. **Apilament Horitzontal dels Botons (`button` com `inline-block`):**
   Sense el CSS carregat dins del Shadow DOM, `.folders-list` no tenia `display: flex; flex-direction: column;`. Per especificació del navegador, els `<button>` són `inline-block`, de manera que totes les carpetes, categories i etiquetes es col·locaven en filera horitzontal un al costat de l'altre.
3. **Col·lapse d'Alçada de la Pàgina (`content-wrapper`):**
   `UniversalPage` embolcalla els seus fills en `<article className="content-wrapper">`, el qual té `flex: none` i paddings editorials en `index.css`. Això impedia que `.notes-shell` s'expandira al 100% de l'alçada de la finestra, col·lapsant les 3 columnes.

---

## 2. EL DESIGN SYSTEM: "BLOC DE NOTES DE PEDRA SECA"

Dissenyat combinant la puresa, netedat i immediatesa d'**Apple Notes** amb la filosofia de materials i contrastos de **Pedra Seca** (colors de terra, contrastos AAA i tipografia neta).

### 2.1. Tokens Semàntics del Mòdul
```css
:host, .sdp-root, .notes-shell {
  --notes-col-sidebar: 250px;
  --notes-col-sidebar-collapsed: 56px;
  --notes-col-list: 320px;
  --notes-col-list-collapsed: 56px;
  --notes-header-height: 52px;

  /* Capes de profunditat visual */
  --notes-bg-sidebar: var(--sdp-fons-subtil);       /* Pedra 200 càlid */
  --notes-bg-list: var(--sdp-fons-superficie);     /* Blanc pur / Superfície */
  --notes-bg-editor: var(--sdp-fons-app);          /* Blanc pur / Paper */
  --notes-border: var(--sdp-vora);                 /* Vora de pedra suau */

  /* Estats de selecció i interacció */
  --notes-item-hover-bg: rgba(0, 0, 0, 0.04);
  --notes-item-active-bg: var(--sdp-fons-superficie);
  --notes-card-hover-bg: var(--sdp-fons-subtil);
  --notes-card-active-bg: var(--sdp-accent-subtil);
  --notes-card-active-border: var(--sdp-accent);
}
```

### 2.2. Arquitectura de 3 Columnes
- **Columna 1: `NotesSidebar` (Carpetes)**
  - Fons subtil càlid (`--sdp-fons-subtil`), 250px d'amplada (col·lapsable a 56px).
  - Llista de carpetes i acordions amb `flex-direction: column; width: 100%`.
  - Estat actiu: Fons blanc, indicador esquerre de 3px amb `--sdp-accent` (taronja de marca).
- **Columna 2: `NotesList` (Solcs i Notes)**
  - Fons de targeta (`--sdp-fons-superficie`), 320px d'amplada (col·lapsable a 56px).
  - Capçalera d'accions amb cercador suau i botó "CREAR NOTA" amb pastilla `--sdp-radi-pastilla`.
  - Targetes de notes (`.note-card`) amb vora, ombra subtil, títol destacat, data relativa i 2 línies d'entradeta (`-webkit-line-clamp: 2`).
- **Columna 3: `NotesEditor` (El Paper d'Escriptura)**
  - Ocupa tot l'espai restant fluid (`flex: 1 1 auto`).
  - Barra d'eines sticky estilitzada com a taula d'escriptura.
  - Àrea central de redacció calibrada a un màxim de `820px` per a màxim confort ergonòmic.

---

## 3. FULL D'ESTILS CANÒNIC: `src/sections/notes/NotesSection.css`

```css
/* src/sections/notes/NotesSection.css
   ==========================================================================
   DESIGN SYSTEM DEL BLOC DE NOTES (SÓC DE POBLE — PEDRA SECA)
   Inspirat en la puresa d'Apple Notes, adaptat a la doctrina visual del Mas.
   ========================================================================== */

/* ── 0. TOKENS LOCALS ─────────────────────────────────────────────────── */
:host, .sdp-root, .notes-shell {
  --notes-col-sidebar: 250px;
  --notes-col-sidebar-collapsed: 56px;
  --notes-col-list: 320px;
  --notes-col-list-collapsed: 56px;
  --notes-header-height: 52px;

  --notes-bg-sidebar: var(--sdp-fons-subtil);
  --notes-bg-list: var(--sdp-fons-superficie);
  --notes-bg-editor: var(--sdp-fons-app);
  --notes-border: var(--sdp-vora);

  --notes-item-hover-bg: rgba(0, 0, 0, 0.04);
  --notes-item-active-bg: var(--sdp-fons-superficie);
  --notes-card-hover-bg: var(--sdp-fons-subtil);
  --notes-card-active-bg: var(--sdp-accent-subtil);
  --notes-card-active-border: var(--sdp-accent);
}

/* ── 1. EXPANSIONS I HERÈNCIA D'ALÇADA ────────────────────────────────── */
.content-wrapper:has(.notes-shell) {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden;
}

.notes-shell {
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background-color: var(--notes-bg-editor);
  box-sizing: border-box;
}

/* ── 2. LES 3 COLUMNES ───────────────────────────────────────────────── */
.notes-column {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
  transition: width 0.22s cubic-bezier(0.2, 0.7, 0.3, 1);
}

.notes-column--left {
  width: var(--notes-col-sidebar);
  flex-shrink: 0;
  background-color: var(--notes-bg-sidebar);
  border-right: 1px solid var(--notes-border);
}
.notes-column--left.collapsed {
  width: var(--notes-col-sidebar-collapsed);
}

.notes-column--middle {
  width: var(--notes-col-list);
  flex-shrink: 0;
  background-color: var(--notes-bg-list);
  border-right: 1px solid var(--notes-border);
}
.notes-column--middle.collapsed {
  width: var(--notes-col-list-collapsed);
}

.notes-column--editor {
  flex: 1 1 auto;
  min-width: 0;
  background-color: var(--notes-bg-editor);
  position: relative;
}

/* ── 3. CAPÇALERES UNIFICADES ────────────────────────────────────────── */
.notes-column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: var(--notes-header-height);
  min-height: var(--notes-header-height);
  background-color: var(--notes-bg-sidebar);
  border-bottom: 1px solid var(--notes-border);
  flex-shrink: 0;
  box-sizing: border-box;
}

.notes-column-header--collapsed {
  justify-content: center;
  padding: 0;
}

.notes-column-title {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--sdp-text-suau);
  user-select: none;
}

/* ── 4. COLUMNA 1: CARPETES (SIDEBAR) ────────────────────────────────── */
.notes-column__body {
  padding: 12px;
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
}

.folders-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
  box-sizing: border-box;
}

.folder-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  border-radius: var(--sdp-radi-s);
  border: 1px solid transparent;
  background: transparent;
  color: var(--sdp-text-cos);
  cursor: pointer;
  text-align: left;
  font-size: 0.88rem;
  font-weight: 500;
  line-height: 1.2;
  transition: background var(--sdp-t), color var(--sdp-t), border-color var(--sdp-t);
  box-sizing: border-box;
}

.folder-item svg {
  flex-shrink: 0;
  color: var(--sdp-text-suau);
  transition: color var(--sdp-t);
}

.folder-item:hover {
  background: var(--notes-item-hover-bg);
  color: var(--sdp-text-titol);
}
.folder-item:hover svg {
  color: var(--sdp-text-titol);
}

.folder-item.active {
  background: var(--notes-item-active-bg);
  color: var(--sdp-text-titol);
  border-left: 3px solid var(--sdp-accent);
  box-shadow: var(--sdp-ombra-1);
  font-weight: 600;
}
.folder-item.active svg {
  color: var(--sdp-accent);
}

.accordion {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}

.accordion-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 6px 10px;
  border: none;
  background: transparent;
  color: var(--sdp-text-suau);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: var(--sdp-radi-s);
  transition: color var(--sdp-t);
}
.accordion-toggle:hover {
  color: var(--sdp-text-titol);
}

.accordion-content {
  margin-top: 4px;
}

/* ── 5. COLUMNA 2: LLISTA DE NOTES ───────────────────────────────────── */
.notes-list-container {
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.notes-list-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  gap: 10px;
  border-bottom: 1px solid var(--notes-border);
  background-color: var(--notes-bg-list);
  flex-shrink: 0;
  box-sizing: border-box;
}

.notes-actions-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-create {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--sdp-accent-subtil);
  color: var(--sdp-accent-text);
  border: 1px solid var(--sdp-accent);
  padding: 6px 14px;
  border-radius: var(--sdp-radi-pastilla);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--sdp-t);
}
.btn-create:hover {
  background-color: var(--sdp-accent);
  color: #ffffff;
  box-shadow: var(--sdp-ombra-1);
}

.notes-column__scroll {
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px;
  box-sizing: border-box;
}

.note-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
}

.note-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 14px 16px;
  border-radius: var(--sdp-radi-m);
  border: 1px solid var(--notes-border);
  background: var(--notes-bg-list);
  color: var(--sdp-text-cos);
  cursor: pointer;
  text-align: left;
  box-shadow: var(--sdp-ombra-1);
  transition: transform var(--sdp-t), box-shadow var(--sdp-t), border-color var(--sdp-t), background var(--sdp-t);
  box-sizing: border-box;
}

.note-card:hover {
  transform: translateY(-1px);
  background: var(--notes-card-hover-bg);
  border-color: var(--sdp-vora-control);
  box-shadow: var(--sdp-ombra-2);
}

.note-card.active {
  background: var(--notes-card-active-bg);
  border-color: var(--notes-card-active-border);
  box-shadow: 0 0 0 1px var(--notes-card-active-border) inset;
}

.note-card-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.note-card-header strong {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--sdp-text-titol);
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-card-date {
  font-size: 0.74rem;
  color: var(--sdp-text-suau);
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.conversation-preview {
  font-size: 0.84rem;
  color: var(--sdp-text-suau);
  line-height: 1.45;
}

.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.timer-indicator {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--sdp-accent);
  box-shadow: 0 0 0 2px var(--sdp-fons-superficie);
}

/* ── 6. COLUMNA 3: EDITOR I EINES ────────────────────────────────────── */
.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: var(--notes-header-height);
  min-height: var(--notes-header-height);
  background-color: var(--notes-bg-list);
  border-bottom: 1px solid var(--notes-border);
  position: sticky;
  top: 0;
  z-index: 10;
  box-sizing: border-box;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 3px;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background-color: var(--notes-border);
  margin: 0 4px;
}

.btn-publish {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--sdp-accent);
  color: #ffffff;
  border: 1px solid var(--sdp-accent);
  border-radius: var(--sdp-radi-pastilla);
  padding: 6px 16px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all var(--sdp-t);
}
.btn-publish:hover {
  background: var(--sdp-accent-hover);
  box-shadow: var(--sdp-ombra-1);
}

.active-text {
  color: var(--sdp-accent) !important;
  background: var(--sdp-accent-subtil);
}

.editor-scroll-area {
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  background-color: var(--notes-bg-editor);
  box-sizing: border-box;
}

.hero-image {
  width: 100%;
  max-height: 380px;
  overflow: hidden;
  flex-shrink: 0;
}
.hero-image-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.editor-container {
  width: 100%;
  max-width: 820px;
  margin: 0 auto;
  padding: 32px 24px 80px;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.page-article {
  background: var(--notes-bg-list);
  border: 1px solid var(--notes-border);
  border-radius: var(--sdp-radi-m);
  box-shadow: var(--sdp-ombra-1);
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  box-sizing: border-box;
}

.editor-title-input {
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1.25;
  color: var(--sdp-text-titol);
  text-align: left;
  outline: none;
  margin: 0 0 16px 0;
  cursor: text;
}

.editor-subtitle-input {
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--sdp-accent-text);
  text-align: left;
  outline: none;
  margin: 0 0 16px 0;
  cursor: text;
}

.editor-lead-input {
  font-size: 1.08rem;
  line-height: 1.65;
  color: var(--sdp-text-cos);
  text-align: left;
  outline: none;
  margin: 0 0 24px 0;
  cursor: text;
}

.editor-tiptap-container {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 250px;
}

.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--sdp-text-suau);
  gap: 12px;
}

/* ── 7. UTILITATS I CONTROLS ─────────────────────────────────────────── */
.btn-icon {
  background: transparent;
  color: var(--sdp-text-suau);
  border: none;
  border-radius: var(--sdp-radi-s);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  transition: all var(--sdp-t);
  box-sizing: border-box;
}
.btn-icon:hover {
  background: var(--notes-item-hover-bg);
  color: var(--sdp-text-titol);
}

.btn-icon--settings {
  position: relative;
}

.dropdown-container {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: var(--sdp-fons-superficie);
  border: 1px solid var(--notes-border);
  border-radius: var(--sdp-radi-s);
  box-shadow: var(--sdp-ombra-3);
  padding: 6px;
  min-width: 200px;
  z-index: 50;
  box-sizing: border-box;
}

.dropdown-header {
  padding: 8px 10px;
  border-bottom: 1px solid var(--notes-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--sdp-text-suau);
  margin-bottom: 4px;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 8px 10px;
  text-align: left;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  background: transparent;
  color: var(--sdp-text-cos);
  font-size: 0.85rem;
  transition: background var(--sdp-t);
}
.dropdown-item:hover {
  background: var(--notes-item-hover-bg);
  color: var(--sdp-text-titol);
}

.notes-column--editor .bar-orange {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px;
  background: var(--sdp-accent);
  color: #ffffff;
  flex-shrink: 0;
}
.notes-column--editor .bar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin: 16px 0 24px 0;
}
.logo-img {
  max-width: 280px;
  height: auto;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

---

## 4. MODIFICACIONS EN ELS COMPONENTS JSX

### 4.1. `NotesSidebar.jsx`
S'assegura que cada botó tinga `type="button"` explícit, icones ben dimensionades i la classe `.folders-list` que ara s'apila estrictament en columna:
```jsx
// src/sections/notes/NotesSidebar.jsx
import { useNotes } from './NotesContext';
import { Folder, Bookmark, Hash, PanelLeftClose } from 'lucide-react';

const CATEGORIES = ['Trellat', 'Patrimoni', 'Dades', 'Social'];

export default function NotesSidebar() {
  const { 
    noteFolders, activeFolderId, handleSelectFolder, 
    activeCategory, handleSelectCategory,
    colFoldersCollapsed, setColFoldersCollapsed,
    accCategoriesOpen, setAccCategoriesOpen,
    accTagsOpen, setAccTagsOpen,
    t
  } = useNotes();

  const getCategoryLabel = (category) => t(`section.notes.category.${category}`, category);

  if (colFoldersCollapsed) {
    return (
      <aside className="notes-column notes-column--left collapsed">
        <div className="notes-column-header notes-column-header--collapsed">
          <button 
            type="button"
            onClick={() => setColFoldersCollapsed(false)}
            className="btn-icon"
            title="Expandir Carpetes"
          >
            <Folder size={18} />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="notes-column notes-column--left no-scrollbar">
      <div className="notes-column-header">
        <div className="notes-column-title">CARPETES</div>
        <button 
          type="button"
          onClick={() => setColFoldersCollapsed(true)} 
          className="btn-icon" 
          title="Replegar Columna"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>
      
      <div className="notes-column__body">
        {/* LLISTA CARPETES APILADES VERTICALMENT */}
        <div className="folders-list">
          {noteFolders.map((folder) => (
            <button
              key={folder.id}
              type="button"
              onClick={() => handleSelectFolder(folder.id)}
              className={`folder-item ${folder.id === activeFolderId ? 'active' : ''}`}
            >
              <Folder size={16} />
              <span>{folder.name}</span>
            </button>
          ))}
        </div>

        {/* ACORDIO CATEGORIES */}
        <div className="accordion">
          <button 
            type="button"
            onClick={() => setAccCategoriesOpen(!accCategoriesOpen)}
            className="accordion-toggle"
            title="Plegar/Desplegar Categories"
          >
            CATEGORIES
          </button>
          {accCategoriesOpen && (
            <div className="folders-list accordion-content">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleSelectCategory(category)}
                  className={`folder-item ${category === activeCategory ? 'active' : ''}`}
                >
                  <Bookmark size={16} />
                  <span>{getCategoryLabel(category)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ACORDIO ETIQUETES */}
        <div className="accordion">
          <button 
            type="button"
            onClick={() => setAccTagsOpen(!accTagsOpen)}
            className="accordion-toggle"
            title="Plegar/Desplegar Etiquetes"
          >
            ETIQUETES
          </button>
          {accTagsOpen && (
            <div className="folders-list accordion-content">
              {['#important', '#idea', '#esborrany'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="folder-item"
                >
                  <Hash size={16} />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
```

### 4.2. `NotesList.jsx`
Garanteix el funcionament de la segona columna amb el botó pastilla i targetes amb estat actiu definit:
```jsx
// src/sections/notes/NotesList.jsx
import { useNotes } from './NotesContext';
import { List, Search, Settings, PanelLeftClose, Clock } from 'lucide-react';

export default function NotesList() {
  const { 
    filteredNotes, activeNote, setActiveNoteId,
    colNotesCollapsed, setColNotesCollapsed,
    settingsOpen, setSettingsOpen,
    timerActive, setTimerActive,
    timerSeconds, setTimerSeconds,
    t
  } = useNotes();

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs.toString().padStart(2, '0') + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (colNotesCollapsed) {
    return (
      <section className="notes-column notes-column--middle collapsed">
        <div className="notes-column-header notes-column-header--collapsed">
          <button 
            type="button"
            onClick={() => setColNotesCollapsed(false)}
            className="btn-icon"
            title="Expandir Notes"
          >
            <List size={18} />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="notes-column notes-column--middle no-scrollbar">
      <div className="notes-column-header">
        <div className="notes-column-title">NOTES</div>
        <button 
          type="button"
          onClick={() => setColNotesCollapsed(true)} 
          className="btn-icon"
          title="Replegar Columna"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>
      
      <div className="notes-list-container">
        <div className="notes-list-actions">
          <div className="notes-actions-left">
            <button type="button" className="btn-icon" title="Cercar">
              <Search size={18} />
            </button>
            <div className="dropdown-container">
              <button 
                type="button"
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="btn-icon btn-icon--settings"
                title="Ajustaments i Temps"
              >
                <Settings size={18} />
                {timerActive && <span className="timer-indicator" />}
              </button>
              {settingsOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <span><Clock size={14}/> Temps:</span>
                    <strong>{formatTime(timerSeconds)}</strong>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setTimerActive(!timerActive)}
                    className="dropdown-item"
                  >
                    {timerActive ? 'Aturar Temporitzador' : 'Iniciar Temporitzador'}
                  </button>
                  {timerSeconds > 0 && !timerActive && (
                    <button 
                      type="button"
                      onClick={() => setTimerSeconds(0)}
                      className="dropdown-item"
                    >
                      Reiniciar Temps
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <button type="button" className="btn-create">
            CREAR NOTA
          </button>
        </div>

        <div className="notes-column__scroll">
          <div className="note-list">
            {filteredNotes.map((note) => {
              const isActive = note.id === activeNote?.id;
              return (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => setActiveNoteId(note.id)}
                  className={`note-card ${isActive ? 'active' : ''}`}
                >
                  <div className="note-card-header">
                    <strong>{note.title || 'Sense títol'}</strong>
                    <span className="note-card-date">{note.formattedDate}</span>
                  </div>
                  <span className="conversation-preview line-clamp">
                    {note.subtitle || t('section.notes.emptyPreview', 'Sense contingut...')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
```

### 4.3. Pas Crític d'Enllaç a `src/css/index.css`
Afegeix a la capçalera de `src/css/index.css`:
```css
@import url('./design-tokens.css');
@import '../sections/notes/NotesSection.css';
```
Això garanteix que Vite resolga i empaquete el Design System del Bloc de Notes dins de `PedraSecaEmbed.jsx` (`adoptedStyleSheets`), donant-li vida immediata dins del Web Component sense trencaments futurs.

## Sinapsis Entrants (Autogenerat)

- [[00_INDEX_ESCRIPTORI|05_Escriptori_Soc_de_Poble/00_INDEX_ESCRIPTORI.md]] — [[260902_1920_dictamen_design_system_bloc_notes]]

<!-- FI SINAPSIS ENTRANTS - NO EDITAR MANUALMENT -->
