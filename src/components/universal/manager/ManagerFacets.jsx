import React from 'react';
import AppGridColumn from '../../layout/AppGridColumn';
import { useAppGrid } from '../../layout/AppGridShell';
import { useManager } from './ManagerContext';
import { Filter } from 'lucide-react';
import './UniversalManager.css';

export default function ManagerFacets() {
  const { 
    facets, 
    activeFacets, 
    setFacet, 
    clearFacet,
    colLeftCollapsed, 
    setColLeftCollapsed 
  } = useManager();
  
  const { mida, setPanellObert } = useAppGrid();
  const isCompact = mida !== 'ample';

  const handleSelectFacet = (facetId, valueId) => {
    setFacet(facetId, valueId);
    if (isCompact) setPanellObert('middle');
  };

  const renderTreeNodes = (facetId, nodes, level = 0) => {
    if (!nodes || !Array.isArray(nodes)) return null;

    return nodes.map((node) => {
      const Icon = node.icon;
      const isActive = activeFacets[facetId] === node.id;

      return (
        <React.Fragment key={node.id}>
          <button
            type="button"
            onClick={() => handleSelectFacet(facetId, node.id)}
            className={`univ-manager-facet-item ${isActive ? 'univ-manager-facet-item--active' : ''}`}
            style={{ 
              paddingLeft: `calc(var(--sdp-sp-6) + ${level * 24}px)`,
              borderLeft: level > 0 ? '2px solid var(--sdp-color-borde)' : '2px solid transparent',
              marginLeft: level > 0 ? 'var(--sdp-sp-2)' : '0'
            }}
          >
            {Icon && <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />}
            <span>{node.label || node.name}</span>
          </button>
          {node.children && node.children.length > 0 && (
            <div className="univ-manager-facet-tree-branch">
              {renderTreeNodes(facetId, node.children, level + 1)}
            </div>
          )}
        </React.Fragment>
      );
    });
  };

  if (colLeftCollapsed && !isCompact) {
    return (
      <aside className="notes-column collapsed">
        <AppGridColumn
          variant="collapsed"
          titol="ÀMBITS"
          onReplega={() => setColLeftCollapsed(false)}
        />
      </aside>
    );
  }

  return (
    <aside className="notes-column">
      <AppGridColumn
        titol="ÀMBITS"
        plegable={!isCompact}
        onReplega={() => setColLeftCollapsed(true)}
      />

      <div className="notes-column__body no-padding sdp-scrollable">
        {facets.map(facet => (
          <div key={facet.id}>
            <h3 className="sdp-heading-3 ob-mb-15 univ-manager-facet-header">
              {facet.label || facet.id}
            </h3>
            <button 
              type="button" 
              className={`univ-manager-facet-item ${!activeFacets[facet.id] ? 'univ-manager-facet-item--active' : ''}`}
              onClick={() => clearFacet(facet.id)}
            >
              <Filter size={18} strokeWidth={!activeFacets[facet.id] ? 2.5 : 2} />
              <span>Tots</span>
            </button>
            {facet.type === 'tree' ? (
               renderTreeNodes(facet.id, facet.options || [])
            ) : (
               (facet.options || []).map(opt => (
                 <button
                   key={opt.id}
                   type="button"
                   onClick={() => handleSelectFacet(facet.id, opt.id)}
                   className={`univ-manager-facet-item ${activeFacets[facet.id] === opt.id ? 'univ-manager-facet-item--active' : ''}`}
                 >
                   {opt.icon && <opt.icon size={18} strokeWidth={activeFacets[facet.id] === opt.id ? 2.5 : 2} />}
                   <span>{opt.label || opt.name}</span>
                 </button>
               ))
            )}
            <div className="univ-manager-facet-spacing"></div>
          </div>
        ))}
      </div>
    </aside>
  );
}
