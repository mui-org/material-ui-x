import * as React from 'react';
import {
  GRID_COLUMNS_CHANGE,
  GRID_COLUMN_ORDER_CHANGE,
  GRID_COLUMN_WIDTH_CHANGE,
  GRID_COLUMN_VISIBILITY_CHANGE,
} from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridColumnApi } from '../../../models/api/gridColumnApi';
import { gridCheckboxSelectionColDef } from '../../../models/colDef/gridCheckboxSelection';
import {
  GridColDef,
  GridColumns,
  GridColumnsMeta,
  getInitialGridColumnsState,
  GridInternalColumns,
} from '../../../models/colDef/gridColDef';
import { GridColumnTypesRecord } from '../../../models/colDef/gridColTypeDef';
import { getGridDefaultColumnTypes } from '../../../models/colDef/gridDefaultColumnTypes';
import { getGridColDef } from '../../../models/colDef/getGridColDef';
import { Logger } from '../../../models/logger';
import { GridColumnOrderChangeParams } from '../../../models/params/gridColumnOrderChangeParams';
import { mergeGridColTypes } from '../../../utils/mergeUtils';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { GridLocaleText, GridTranslationKeys } from '../../../models/api/gridLocaleTextApi';
import { useGridState } from '../core/useGridState';
import {
  allGridColumnsSelector,
  gridColumnsMetaSelector,
  visibleGridColumnsSelector,
} from './gridColumnsSelector';
import { useGridApiOptionHandler } from '../../root/useGridApiEventHandler';
import { GRID_STRING_COL_DEF } from '../../../models/colDef/gridStringColDef';
import { GridComponentProps } from '../../../GridComponentProps';

function updateColumnsWidth(columns: GridColumns, viewportWidth: number): GridColumns {
  const numberOfFluidColumns = columns.filter((column) => !!column.flex && !column.hide).length;
  let flexDivider = 0;

  if (numberOfFluidColumns && viewportWidth) {
    columns.forEach((column) => {
      if (!column.hide) {
        if (!column.flex) {
          viewportWidth -= column.width!;
        } else {
          flexDivider += column.flex;
        }
      }
    });
  }

  let newColumns = columns;
  if (numberOfFluidColumns) {
    const flexMultiplier = viewportWidth / flexDivider;
    newColumns = columns.map((column) => {
      if (!column.flex) {
        return column;
      }
      return {
        ...column,
        width: viewportWidth > 0 ? flexMultiplier * column.flex! : GRID_STRING_COL_DEF.width,
      };
    });
  }
  return newColumns;
}

function hydrateColumns(
  columns: GridColumns,
  columnTypes: GridColumnTypesRecord,
  withCheckboxSelection: boolean,
  logger: Logger,
  getLocaleText: <T extends GridTranslationKeys>(key: T) => GridLocaleText[T],
): GridColumns {
  logger.debug('Hydrating GridColumns with default definitions');
  const mergedColTypes = mergeGridColTypes(getGridDefaultColumnTypes(), columnTypes);
  const extendedColumns = columns.map((c) => ({ ...getGridColDef(mergedColTypes, c.type), ...c }));

  if (withCheckboxSelection) {
    const checkboxSelection = { ...gridCheckboxSelectionColDef };
    checkboxSelection.headerName = getLocaleText('checkboxSelectionHeaderName');
    return [checkboxSelection, ...extendedColumns];
  }

  return extendedColumns;
}

function toLookup(logger: Logger, allColumns: GridColumns) {
  logger.debug('Building columns lookup');
  return allColumns.reduce((lookup, col) => {
    lookup[col.field] = col;
    return lookup;
  }, {} as { [key: string]: GridColDef });
}

const upsertColumnsState = (
  columnUpdates: GridColDef[],
  prevColumnsState?: GridInternalColumns,
) => {
  const newState: GridInternalColumns = {
    all: [...(prevColumnsState?.all ?? [])],
    lookup: { ...(prevColumnsState?.lookup ?? {}) },
  };

  columnUpdates.forEach((newColumn) => {
    if (newState.lookup[newColumn.field] == null) {
      // New Column
      newState.lookup[newColumn.field] = newColumn;
      newState.all.push(newColumn.field);
    } else {
      newState.lookup[newColumn.field] = { ...newState.lookup[newColumn.field], ...newColumn };
    }
  });

  return newState;
};

export function useGridColumns(
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'columns' | 'onColumnVisibilityChange'>,
): void {
  const logger = useLogger('useGridColumns');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const columnsMeta = useGridSelector(apiRef, gridColumnsMetaSelector);
  const allColumns = useGridSelector(apiRef, allGridColumnsSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const options = useGridSelector(apiRef, optionsSelector);

  const updateState = React.useCallback(
    (newState: GridInternalColumns, emit = true) => {
      logger.debug('Updating columns state.');

      setGridState((oldState) => ({ ...oldState, columns: newState }));
      forceUpdate();

      if (apiRef.current && emit) {
        apiRef.current.publishEvent(GRID_COLUMNS_CHANGE, newState.all);
      }
    },
    [logger, setGridState, forceUpdate, apiRef],
  );

  const getColumn: (field: string) => GridColDef = React.useCallback(
    (field) => apiRef.current.state.columns.lookup[field],
    [apiRef],
  );

  const getAllColumns: () => GridColumns = React.useCallback(() => allColumns, [allColumns]);
  const getVisibleColumns = React.useCallback(() => visibleColumns, [visibleColumns]);
  const getColumnsMeta: () => GridColumnsMeta = React.useCallback(() => columnsMeta, [columnsMeta]);

  const getColumnIndex: (field: string, useVisibleColumns?: boolean) => number = React.useCallback(
    (field, useVisibleColumns = true) =>
      useVisibleColumns
        ? visibleColumns.findIndex((col) => col.field === field)
        : allColumns.findIndex((col) => col.field === field),
    [allColumns, visibleColumns],
  );

  const getColumnPosition: (field: string) => number = React.useCallback(
    (field) => {
      const index = getColumnIndex(field);
      return columnsMeta.positions[index];
    },
    [columnsMeta.positions, getColumnIndex],
  );

  const setColumnsState = React.useCallback(
    (newState: GridInternalColumns, emit?: boolean) => {
      logger.debug('updating GridColumns with new state');

      // Avoid dependency on gridState to avoid infinite loop
      const refGridState = apiRef.current.getState();
      const newColumns: GridColumns = newState.all.map((field) => newState.lookup[field]);
      const updatedCols = updateColumnsWidth(newColumns, refGridState.viewportSizes.width);

      const finalState: GridInternalColumns = {
        all: updatedCols.map((col) => col.field),
        lookup: toLookup(logger, updatedCols),
      };

      updateState(finalState, emit);
    },
    [apiRef, logger, updateState],
  );

  const updateColumns = React.useCallback(
    (cols: GridColDef[]) => {
      // Avoid dependency on gridState to avoid infinite loop
      const newState = upsertColumnsState(cols, apiRef.current.getState().columns);
      setColumnsState(newState, false);
    },
    [apiRef, setColumnsState],
  );

  const updateColumn = React.useCallback(
    (col: GridColDef) => updateColumns([col]),
    [updateColumns],
  );

  const setColumnVisibility = React.useCallback(
    (field: string, isVisible: boolean) => {
      const col = getColumn(field);
      const updatedCol = { ...col, hide: !isVisible };

      updateColumns([updatedCol]);
      forceUpdate();

      apiRef.current.publishEvent(GRID_COLUMN_VISIBILITY_CHANGE, {
        field,
        colDef: updatedCol,
        api: apiRef,
        isVisible,
      });
    },
    [apiRef, forceUpdate, getColumn, updateColumns],
  );

  const setColumnIndex = React.useCallback(
    (field: string, targetIndexPosition: number) => {
      const oldIndexPosition = gridState.columns.all.findIndex((col) => col === field);
      if (oldIndexPosition === targetIndexPosition) {
        return;
      }

      logger.debug(`Moving column ${field} to index ${targetIndexPosition}`);

      const params: GridColumnOrderChangeParams = {
        field,
        element: apiRef.current.getColumnHeaderElement(field),
        colDef: apiRef.current.getColumn(field),
        targetIndex: targetIndexPosition,
        oldIndex: oldIndexPosition,
        api: apiRef.current,
      };
      apiRef.current.publishEvent(GRID_COLUMN_ORDER_CHANGE, params);

      const updatedColumns = [...gridState.columns.all];
      updatedColumns.splice(targetIndexPosition, 0, updatedColumns.splice(oldIndexPosition, 1)[0]);
      updateState({ ...gridState.columns, all: updatedColumns });
    },
    [apiRef, gridState.columns, logger, updateState],
  );

  const setColumnWidth = React.useCallback(
    (field: string, width: number) => {
      logger.debug(`Updating column ${field} width to ${width}`);

      const column = apiRef.current.getColumn(field);
      apiRef.current.updateColumn({ ...column, width });

      apiRef.current.publishEvent(GRID_COLUMN_WIDTH_CHANGE, {
        element: apiRef.current.getColumnHeaderElement(field),
        colDef: column,
        api: apiRef,
        width,
      });
    },
    [apiRef, logger],
  );

  const colApi: GridColumnApi = {
    getColumn,
    getAllColumns,
    getColumnIndex,
    getColumnPosition,
    getVisibleColumns,
    getColumnsMeta,
    updateColumn,
    updateColumns,
    setColumnVisibility,
    setColumnIndex,
    setColumnWidth,
  };

  useGridApiMethod(apiRef, colApi, 'ColApi');

  React.useEffect(() => {
    logger.info(`GridColumns have changed, new length ${props.columns.length}`);

    if (props.columns.length > 0) {
      const hydratedColumns = hydrateColumns(
        props.columns,
        options.columnTypes,
        !!options.checkboxSelection,
        logger,
        apiRef.current.getLocaleText,
      );

      const newState = upsertColumnsState(hydratedColumns);
      setColumnsState(newState);
    } else {
      updateState(getInitialGridColumnsState());
    }
  }, [
    logger,
    apiRef,
    props.columns,
    options.columnTypes,
    options.checkboxSelection,
    updateState,
    setColumnsState,
  ]);

  React.useEffect(() => {
    logger.debug(
      `GridColumns gridState.viewportSizes.width, changed ${gridState.viewportSizes.width}`,
    );
    // Avoid dependency on gridState as I only want to update cols when viewport size changed.
    const currentColumns = allGridColumnsSelector(apiRef.current.getState());

    apiRef.current.updateColumns(currentColumns);
  }, [apiRef, gridState.viewportSizes.width, logger]);

  // Grid Option Handlers
  useGridApiOptionHandler(apiRef, GRID_COLUMN_VISIBILITY_CHANGE, props.onColumnVisibilityChange);
}
