import React, { useState, useEffect, useRef } from 'react';
import AppGridColumn from '../../layout/AppGridColumn';
import { useAppGrid } from '../../layout/AppGridShell';
import { useManager } from './ManagerContext';
import ManagerItemCard from './ManagerItemCard';
import { Search, Plus } from 'lucide-react';

export default function ManagerList({
  getItemCard,
  onActionCreate,
  createLabel = 'CREAR',
  listTitle = 'LLISTA',
}) {
  const {
    filteredItems,
    activeItemId,
    setActiveItemId,
    getItemId,
    searchQuery: ctxSearchQuery,
    setSearchQuery: setCtxSearchQuery,
    colMiddleCollapsed,
    setColMiddleCollapsed,
  } = useManager();

  const { mida, setPanellObert } = useAppGrid();
  const isCompact = mida !== 'ample';
  const [localQuery, setLocalQuery] = useState(ctxSearchQuery);
  const [searchOpen, setSearchOpen] = useState(Boolean(ctxSearchQuery));
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (ctxSearchQuery !== localQuery) setCtxSearchQuery(localQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [localQuery, ctxSearchQuery, setCtxSearchQuery]);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const handleSelect = (id) => {
    setActiveItemId(id);
    if (isCompact) setPanellObert(null);
  };

  /* Collapsed: només lupa + expandir. Crear DESAPAREIX. */
  if (colMiddleCollapsed && !isCompact) {
    return (
      <aside className="notes-column collapsed">
        <AppGridColumn
          variant="collapsed"
          titol={listTitle}
          onReplega={() => setColMiddleCollapsed(false)}
          accions={[
            {
              id: 'search',
              icona: Search,
              etiqueta: 'Cercar',
              onAcciona: () => {
                setColMiddleCollapsed(false);
                setSearchOpen(true);
              },
            },
          ]}
        />
      </aside>
    );
  }

  const listAccions = [];
  if (onActionCreate) {
    listAccions.push({
      id: 'create',
      icona: Plus,
      etiqueta: createLabel,
      label: createLabel,
      onAcciona: onActionCreate,
      variant: 'primary',
    });
  }

  return (
    <aside className="notes-column">
      {/* Capçalera: [Lupa] … [Crear] [replegar] — sense input fins clicar lupa */}
      <AppGridColumn
        titol=""
        onReplega={!isCompact ? () => setColMiddleCollapsed(true) : null}
        esquerra={searchOpen ? (
          <div className="univ-manager-header-search">
            <Search size={18} aria-hidden focusable="false" />
            <input
              ref={inputRef}
              type="search"
              placeholder="Cerca..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              aria-label="Cercar elements"
            />
          </div>
        ) : (
          <button
            type="button"
            className="app-grid-col-header__accio-icon"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Cercar"
            title="Cercar"
            aria-pressed={searchOpen}
          >
            <Search size={18} aria-hidden focusable="false" />
          </button>
        )}
        accions={listAccions}
      />

      <div className="notes-column__body notes-column__body--sense-marge sdp-scrollable">
        <ul className="sdp-gestor-llista">
          {filteredItems.map((item) => {
            const id = getItemId(item);
            const fitxa = getItemCard
              ? getItemCard(item)
              : { titol: item.name || item.title || String(id) };
            return (
              <li key={id}>
                <ManagerItemCard
                  {...fitxa}
                  actiu={id === activeItemId}
                  onSelecciona={() => handleSelect(id)}
                />
              </li>
            );
          })}
          {filteredItems.length === 0 && (
            <li className="sdp-gestor-buit">Cap element trobat.</li>
          )}
        </ul>
      </div>
    </aside>
  );
}
