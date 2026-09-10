import React from 'react';
import AppGridShell from '../../layout/AppGridShell';
import { ManagerProvider, useManager } from './ManagerContext';
import ManagerFacets from './ManagerFacets';
import ManagerList from './ManagerList';
import { UniversalPage } from '../UniversalPage';

function UniversalManagerInner({ renderItem, renderDetail, onActionCreate, createLabel }) {
  const { activeItem } = useManager();

  return (
    <UniversalPage layout="contained">
      <AppGridShell
        leftColumn={<ManagerFacets />}
        middleColumn={
          <ManagerList 
            renderItem={renderItem} 
            onActionCreate={onActionCreate} 
            createLabel={createLabel} 
          />
        }
        rightColumn={activeItem ? renderDetail(activeItem) : null}
      />
    </UniversalPage>
  );
}

export function UniversalManager({
  items = [],
  facets = [],
  getItemId,
  getItemSearchText,
  renderItem,
  renderDetail,
  onActionCreate,
  createLabel = 'CREAR',
  initialItemId = null,
}) {
  return (
    <ManagerProvider
      items={items}
      facets={facets}
      getItemId={getItemId}
      getItemSearchText={getItemSearchText}
      initialItemId={initialItemId}
    >
      <UniversalManagerInner 
        renderItem={renderItem}
        renderDetail={renderDetail}
        onActionCreate={onActionCreate}
        createLabel={createLabel}
      />
    </ManagerProvider>
  );
}
