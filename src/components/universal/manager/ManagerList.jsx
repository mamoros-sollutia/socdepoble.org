import React, { useState, useEffect } from 'react';
import AppGridColumn from '../../layout/AppGridColumn';
import { useAppGrid } from '../../layout/AppGridShell';
import { useManager } from './ManagerContext';
import { Search, Plus } from 'lucide-react';
import './UniversalManager.css';

export default function ManagerList({ renderItem, onActionCreate, createLabel = 'CREAR' }) {
  const { 
    filteredItems, 
    activeItemId, 
    setActiveItemId, 
    searchQuery: ctxSearchQuery, 
    setSearchQuery: setCtxSearchQuery,
    colMiddleCollapsed,
    setColMiddleCollapsed
  } = useManager();
  
  const { mida, setPanellObert } = useAppGrid();
  const isCompact = mida !== 'ample';
  const [localQuery, setLocalQuery] = useState(ctxSearchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (ctxSearchQuery !== localQuery) {
        setCtxSearchQuery(localQuery);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [localQuery, ctxSearchQuery, setCtxSearchQuery]);

  const handleSelect = (id) => {
    setActiveItemId(id);
    if (isCompact) setPanellObert('right');
  };

  if (colMiddleCollapsed && !isCompact) {
    return (
      <aside className="notes-column collapsed">
        <AppGridColumn
          variant="collapsed"
          titol="LLISTA"
          onReplega={() => setColMiddleCollapsed(false)}
        />
      </aside>
    );
  }

  return (
    <aside className="notes-column">
      <AppGridColumn
        titol="LLISTA"
        plegable={!isCompact}
        onReplega={() => setColMiddleCollapsed(true)}
      />
      
      <div className="notes-list-header">
        <div className="search-bar">
          <Search size={18} aria-hidden="true" />
          <input
            type="text"
            placeholder="Cerca..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            aria-label="Cercar elements"
          />
        </div>
      </div>

      <div className="notes-column__body no-padding sdp-scrollable">
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {filteredItems.map(item => {
            const isActive = item.id === activeItemId;
            return (
              <li 
                key={item.id} 
                className={`univ-manager-list-item ${isActive ? 'univ-manager-list-item--active' : ''}`}
                onClick={() => handleSelect(item.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(item.id);
                  }
                }}
              >
                {renderItem ? renderItem(item, isActive) : (
                  <div>
                    <strong style={{ display: 'block' }}>{item.name || item.title || item.id}</strong>
                  </div>
                )}
              </li>
            );
          })}
          {filteredItems.length === 0 && (
            <li className="univ-manager-empty">
              Cap element trobat.
            </li>
          )}
        </ul>
      </div>

      {onActionCreate && (
        <div className="univ-manager-create-action">
           <button 
             className="btn btn-primary univ-manager-create-btn" 
             onClick={onActionCreate}
           >
             <Plus size={18} />
             {createLabel}
           </button>
        </div>
      )}
    </aside>
  );
}
