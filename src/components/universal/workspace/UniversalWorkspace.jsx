import AppGridShell from '../../layout/AppGridShell';
import { ManagerProvider, useManager } from '../manager/ManagerContext';
import ManagerFacets from '../manager/ManagerFacets';
import ManagerList from '../manager/ManagerList';
import { SlotErrorBoundary } from './SlotErrorBoundary';

const getIdPerDefecte = (item) => item?.id;
const getTextPerDefecte = (item) => item?.searchText || item?.title || item?.name || '';
const getCardPerDefecte = (item) => ({ titol: item?.title || item?.name || String(item?.id ?? '') });
const FACETS_BUDES = {};

function comprovaInvariants(items, facets, getItemId) {
  if (!import.meta.env.DEV) return;
  const vists = new Set();
  for (const item of items) {
    const id = getItemId(item);
    if (id == null) {
      console.error('[UniversalWorkspace] getItemId ha tornat null/undefined.', item);
      continue;
    }
    const clau = String(id);
    if (vists.has(clau)) {
      console.error(`[UniversalWorkspace] Id duplicat "${clau}".`);
    }
    vists.add(clau);
  }
  for (const facet of facets) {
    if (!facet?.id || !Array.isArray(facet?.options) || typeof facet?.getValue !== 'function') {
      console.error('[UniversalWorkspace] Facet malformat:', facet);
    }
  }
}

export function UniversalWorkspace({
  items = [],
  facets = [],
  getItemId = getIdPerDefecte,
  getItemSearchText = getTextPerDefecte,
  getItemCard = getCardPerDefecte,
  onActionCreate = null,
  createLabel = 'CREAR',
  facetsTitle = 'CARPETES',
  listTitle = 'LLISTA',
  listIcon = null,
  renderEditor = null,
  initialItemId = null,
  initialActiveFacets = FACETS_BUDES,
  className = '',
}) {
  comprovaInvariants(items, facets, getItemId);

  return (
    <ManagerProvider
      items={items}
      facets={facets}
      facetsTitle={facetsTitle}
      getItemId={getItemId}
      getItemSearchText={getItemSearchText}
      initialItemId={initialItemId}
      initialActiveFacets={initialActiveFacets}
    >
      <UniversalWorkspaceInner
        getItemId={getItemId}
        getItemCard={getItemCard}
        onActionCreate={onActionCreate}
        createLabel={createLabel}
        listTitle={listTitle}
        listIcon={listIcon}
        renderEditor={renderEditor}
        className={className}
      />
    </ManagerProvider>
  );
}

function UniversalWorkspaceInner({
  getItemId,
  getItemCard,
  onActionCreate,
  createLabel,
  listTitle,
  listIcon,
  renderEditor,
  className,
}) {
  const {
    activeItem,
    facetsTitle,
    colLeftCollapsed,
    colMiddleCollapsed,
  } = useManager();

  const clauDeItem = activeItem == null ? '~buit' : String(getItemId(activeItem) ?? '~sense-id');

  /* Llei 1: retornem DIRECTAMENT AppGridShell — sense UniversalPage al damunt.
     La barra blava només pot viure dins de renderEditor (slot dret). */
  return (
    <AppGridShell
      className={className}
      leftCollapsed={colLeftCollapsed}
      middleCollapsed={colMiddleCollapsed}
      leftColumn={<ManagerFacets />}
      middleColumn={
        <SlotErrorBoundary domini="llista" resetKey={clauDeItem}>
          <ManagerList
            getItemCard={getItemCard}
            onActionCreate={onActionCreate}
            createLabel={createLabel}
            listTitle={listTitle}
            listIcon={listIcon}
          />
        </SlotErrorBoundary>
      }
      rightColumn={
        <SlotErrorBoundary domini="editor" resetKey={clauDeItem}>
          <EditorSlot renderEditor={renderEditor} activeItem={activeItem} />
        </SlotErrorBoundary>
      }
      leftTitle={facetsTitle}
      middleTitle={listTitle}
    />
  );
}

function EditorSlot({ renderEditor, activeItem }) {
  return renderEditor ? renderEditor(activeItem) : null;
}
