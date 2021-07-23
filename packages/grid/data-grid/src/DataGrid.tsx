import * as React from 'react';
import { DATAGRID_PROPTYPES } from './DataGridPropTypes';
import {
  DEFAULT_GRID_OPTIONS,
  GridBody,
  GridErrorHandler,
  GridFooterPlaceholder,
  GridHeaderPlaceholder,
  GridRoot,
  useGridApiRef,
} from '../../_modules_/grid';
import { GridContextProvider } from '../../_modules_/grid/context/GridContextProvider';
import { useDataGridComponent } from './useDataGridComponent';
import { DataGridProps, MAX_PAGE_SIZE } from './DataGridProps';

const DataGridRaw = React.forwardRef<HTMLDivElement, DataGridProps>(function DataGrid(
  inProps,
  ref,
) {
  if (inProps.pageSize! > MAX_PAGE_SIZE) {
    throw new Error(`'props.pageSize' cannot exceed 100 in DataGrid.`);
  }

  const apiRef = useGridApiRef();

  useDataGridComponent(apiRef, inProps);

  return (
    <GridContextProvider apiRef={apiRef} props={inProps}>
      <GridRoot ref={ref}>
        <GridErrorHandler>
          <GridHeaderPlaceholder />
          <GridBody />
          <GridFooterPlaceholder />
        </GridErrorHandler>
      </GridRoot>
    </GridContextProvider>
  );
});
DataGridRaw.defaultProps = {
  ...DEFAULT_GRID_OPTIONS,
  apiRef: undefined,
  disableColumnResize: true,
  disableColumnReorder: true,
  disableMultipleColumnsFiltering: true,
  disableMultipleColumnsSorting: true,
  disableMultipleSelection: true,
  pagination: true,
  onRowsScrollEnd: undefined,
  checkboxSelectionVisibleOnly: false,
};

export const DataGrid = React.memo(DataGridRaw);

// @ts-ignore
DataGrid.propTypes = DATAGRID_PROPTYPES;
