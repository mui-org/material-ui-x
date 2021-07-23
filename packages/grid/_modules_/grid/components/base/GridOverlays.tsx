import * as React from 'react';
import { GridRootPropsContext } from '../../context/GridRootPropsContext';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { visibleGridRowCountSelector } from '../../hooks/features/filter/gridFilterSelector';
import { gridRowCountSelector } from '../../hooks/features/rows/gridRowsSelector';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';

export function GridOverlays() {
  const apiRef = useGridApiContext();
  const rootProps = React.useContext(GridRootPropsContext)!;

  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const visibleRowCount = useGridSelector(apiRef, visibleGridRowCountSelector);

  const showNoRowsOverlay = !rootProps.loading && totalRowCount === 0;
  const showNoResultsOverlay = !rootProps.loading && totalRowCount > 0 && visibleRowCount === 0;

  if (showNoRowsOverlay) {
    return (
      <apiRef.current.components.NoRowsOverlay {...rootProps.componentsProps?.noRowsOverlay} />
    );
  }

  if (showNoResultsOverlay) {
    return (
      <apiRef.current.components.NoResultsOverlay
        {...rootProps.componentsProps?.noResultsOverlay}
      />
    );
  }

  if (rootProps.loading) {
    return (
      <apiRef.current.components.LoadingOverlay {...rootProps.componentsProps?.loadingOverlay} />
    );
  }
  return null;
}
