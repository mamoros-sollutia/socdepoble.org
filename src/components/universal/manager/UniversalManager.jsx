import React from 'react';
import AppGridShell from '../../layout/AppGridShell';
import { ManagerProvider, useManager } from './ManagerContext';
import ManagerFacets from './ManagerFacets';
import ManagerList from './ManagerList';
import { UniversalPage } from '../UniversalPage';

function UniversalManagerInner({ getItemCard, renderDetail, onActionCreate, createLabel, listTitle, listIcon }) {
  const { activeItem, facetsTitle } = useManager();

  return (
    <UniversalPage layout="contained">
      <AppGridShell
        leftColumn={<ManagerFacets />}
        middleColumn={
          <ManagerList 
            getItemCard={getItemCard} 
            onActionCreate={onActionCreate} 
            createLabel={createLabel} 
            listTitle={listTitle}
            listIcon={listIcon}
          />
        }
        rightColumn={activeItem ? renderDetail(activeItem) : null}
        leftTitle={facetsTitle}
        middleTitle={listTitle}
      />
    </UniversalPage>
  );
}

export function UniversalManager({
  items = [],
  facets = [],
  facetsTitle = 'CARPETES',
  listTitle = 'LLISTA',
  listIcon = null,
  getItemId,
  getItemSearchText,
  getItemCard,
  renderDetail,
  onActionCreate,
  createLabel = 'CREAR',
  initialItemId = null,
  initialActiveFacets = {},
}) {
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
      <UniversalManagerInner 
        getItemCard={getItemCard}
        renderDetail={renderDetail}
        onActionCreate={onActionCreate}
        createLabel={createLabel}
        listTitle={listTitle}
        listIcon={listIcon}
      />
    </ManagerProvider>
  );
}
