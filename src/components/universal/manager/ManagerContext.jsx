import {
  createContext,
  useCallback,
  useContext,
  useDeferredValue,
  useMemo,
  useState,
} from 'react';

const ManagerContext = createContext(null);

export function ManagerProvider({
  children,
  items = [],
  facets = [],
  facetsTitle = 'CARPETES',
  getItemId = (item) => item.id,
  getItemSearchText = (item) => item.searchText || item.title || '',
  initialActiveFacets = {},
  initialItemId = null,
}) {
  const [activeFacets, setActiveFacets] = useState(initialActiveFacets);
  const [activeItemId, setActiveItemId] = useState(initialItemId);
  const [searchQuery, setSearchQuery] = useState('');
  const [colLeftCollapsed, setColLeftCollapsed] = useState(false);
  const [colMiddleCollapsed, setColMiddleCollapsed] = useState(false);

  const deferredSearchQuery = useDeferredValue(searchQuery);

  const facetById = useMemo(() => {
    const map = new Map();
    for (const facet of facets) map.set(facet.id, facet);
    return map;
  }, [facets]);

  const setFacet = useCallback((facetId, value) => {
    setActiveFacets((prev) => {
      if (prev[facetId] === value) return prev;
      return { ...prev, [facetId]: value };
    });
  }, []);

  const clearFacet = useCallback((facetId) => {
    setActiveFacets((prev) => {
      if (prev[facetId] == null) return prev;
      return { ...prev, [facetId]: null };
    });
  }, []);

  const filteredItems = useMemo(() => {
    const query = deferredSearchQuery.trim().toLowerCase();

    const treeAllowedByFacet = new Map();
    for (const facet of facets) {
      if (facet.type !== 'tree') continue;
      const selected = activeFacets[facet.id];
      if (selected == null) continue;

      // Amb facet.options tenim l'arbre pre-construït. Recollim l'id seleccionat i tots els seus descendents
      const allowed = new Set();
      const findNodeAndChildren = (nodes, isUnderSelected = false) => {
        if (!nodes) return;
        for (const node of nodes) {
          const match = isUnderSelected || node.id === selected;
          if (match) allowed.add(node.id);
          if (node.children) findNodeAndChildren(node.children, match);
        }
      };
      findNodeAndChildren(facet.options);
      
      treeAllowedByFacet.set(facet.id, allowed);
    }

    const flatSelections = new Map();
    for (const facet of facets) {
      if (facet.type !== 'flat') continue;
      const selected = activeFacets[facet.id];
      if (selected == null) continue;
      flatSelections.set(facet.id, selected);
    }

    if (treeAllowedByFacet.size === 0 && flatSelections.size === 0 && !query) {
      return items;
    }

    return items.filter((item) => {
      for (const [facetId, allowed] of treeAllowedByFacet) {
        const facet = facetById.get(facetId);
        const value = facet.getValue(item);
        if (value == null || !allowed.has(value)) return false;
      }

      for (const [facetId, selected] of flatSelections) {
        const facet = facetById.get(facetId);
        const value = facet.getValue(item);
        if (Array.isArray(value)) {
          if (!value.includes(selected)) return false;
        } else if (value !== selected) {
          return false;
        }
      }

      if (query) {
        const text = String(getItemSearchText(item) || '').toLowerCase();
        if (!text.includes(query)) return false;
      }

      return true;
    });
  }, [
    items,
    facets,
    facetById,
    activeFacets,
    deferredSearchQuery,
    getItemSearchText,
  ]);

  const activeItem = useMemo(() => {
    if (activeItemId != null) {
      const found = filteredItems.find((item) => getItemId(item) === activeItemId);
      if (found) return found;
    }
    return filteredItems[0] || null;
  }, [filteredItems, activeItemId, getItemId]);

  // Si l'element actiu canvia (ex. pel filtre), sincronitzem l'estat local perquè la selecció canvie visualment
  // però ho fem a través de setState en el següent render per no trencar les regles de React
  const finalActiveItemId = activeItem ? getItemId(activeItem) : null;

  const value = useMemo(() => ({
    items,
    facets,
    filteredItems,
    activeItem,
    activeItemId: finalActiveItemId,
    activeFacets,
    searchQuery,
    colLeftCollapsed,
    colMiddleCollapsed,
    facetsTitle,
    setFacet,
    clearFacet,
    setActiveItemId,
    setSearchQuery,
    setColLeftCollapsed,
    setColMiddleCollapsed,
    getItemId,
    getItemSearchText,
  }), [
    items,
    facets,
    filteredItems,
    activeItem,
    finalActiveItemId,
    activeFacets,
    searchQuery,
    colLeftCollapsed,
    colMiddleCollapsed,
    facetsTitle,
    setFacet,
    clearFacet,
    getItemId,
    getItemSearchText,
  ]);

  return (
    <ManagerContext.Provider value={value}>
      {children}
    </ManagerContext.Provider>
  );
}

export function useManager() {
  const ctx = useContext(ManagerContext);
  if (!ctx) {
    throw new Error('useManager ha de ser usat dins de ManagerProvider');
  }
  return ctx;
}
