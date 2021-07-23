import * as React from 'react';
import {
  GRID_COLUMNS_CHANGE,
  GRID_COLUMN_ORDER_CHANGE,
  GRID_COLUMN_WIDTH_CHANGE,
  GRID_COLUMN_VISIBILITY_CHANGE,
} from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridColumnApi } from '../../../models/api/gridColumnApi';
import {
  GridColDef,
  getInitialGridColumnsState,
  GridColumnsState,
} from '../../../models/colDef/gridColDef';
import { GridColumnOrderChangeParams } from '../../../models/params/gridColumnOrderChangeParams';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import {
  allGridColumnsSelector,
  gridColumnsMetaSelector,
  visibleGridColumnsSelector,
} from './gridColumnsSelector';
import { useGridApiOptionHandler } from '../../root/useGridApiEventHandler';
import { GridComponentProps } from '../../../GridComponentProps';
import {
  hydrateColumns,
  getStateColumns,
  toLookup,
  upsertColumnsState,
  RawGridColumnsState,
} from './columnsUtils';

export function useGridColumns(
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    'columns' | 'onColumnVisibilityChange' | 'columnTypes' | 'checkboxSelection'
  >,
): void {
  const logger = useLogger('useGridColumns');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const columnsMeta = useGridSelector(apiRef, gridColumnsMetaSelector);
  const allColumns = useGridSelector(apiRef, allGridColumnsSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);

  const updateState = React.useCallback(
    (newState: GridColumnsState, emit = true) => {
      logger.debug('Updating columns state.');

      setGridState((oldState) => ({ ...oldState, columns: newState }));
      forceUpdate();

      if (apiRef.current && emit) {
        apiRef.current.publishEvent(GRID_COLUMNS_CHANGE, newState.all);
      }
    },
    [logger, setGridState, forceUpdate, apiRef],
  );

  const getColumn = React.useCallback<GridColumnApi['getColumn']>(
    (field) => apiRef.current.state.columns.lookup[field],
    [apiRef],
  );

  const getAllColumns = React.useCallback<GridColumnApi['getAllColumns']>(
    () => allColumns,
    [allColumns],
  );
  const getVisibleColumns = React.useCallback<GridColumnApi['getVisibleColumns']>(
    () => visibleColumns,
    [visibleColumns],
  );
  const getColumnsMeta = React.useCallback<GridColumnApi['getColumnsMeta']>(
    () => columnsMeta,
    [columnsMeta],
  );

  const getColumnIndex = React.useCallback(
    (field: string, useVisibleColumns: boolean = true): number =>
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
    (newState: RawGridColumnsState, emit: boolean) => {
      logger.debug('updating GridColumns with new state');

      // Avoid dependency on gridState to avoid infinite loop
      const refGridState = apiRef.current.getState();
      const newColumns = newState.all.map((field) => newState.lookup[field]);
      const updatedCols = getStateColumns(newColumns, refGridState.viewportSizes.width);

      const finalState: GridColumnsState = {
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

  const setColumnsFromProps = React.useCallback(() => {
    logger.info(`GridColumns have changed, new length ${props.columns.length}`);

    if (props.columns.length > 0) {
      const hydratedColumns = hydrateColumns(
        props.columns,
        props.columnTypes!,
        !!props.checkboxSelection,
        logger,
        apiRef.current.getLocaleText,
      );

      const newState = upsertColumnsState(hydratedColumns);
      setColumnsState(newState, true);
    } else {
      updateState(getInitialGridColumnsState());
    }
  }, [
    logger,
    apiRef,
    updateState,
    setColumnsState,
    props.columns,
    props.columnTypes,
    props.checkboxSelection,
  ]);

  const updateColumnsTotalWidth = React.useCallback(() => {
    logger.debug(
      `GridColumns gridState.viewportSizes.width, changed ${gridState.viewportSizes.width}`,
    );
    // Avoid dependency on gridState as I only want to update cols when viewport size changed.
    const currentColumns = allGridColumnsSelector(apiRef.current.getState());
    apiRef.current.updateColumns(currentColumns);
  }, [apiRef, logger, gridState.viewportSizes.width]);

  const hasInitializedColumns = React.useRef(false);

  React.useEffect(() => {
    if (hasInitializedColumns.current) {
      setColumnsFromProps();
    }
  }, [setColumnsFromProps]);

  React.useEffect(() => {
    if (hasInitializedColumns.current) {
      updateColumnsTotalWidth();
    }
  }, [updateColumnsTotalWidth]);

  React.useEffect(() => {
    if (!hasInitializedColumns.current) {
      setColumnsFromProps();

      if (gridState.viewportSizes.width) {
        hasInitializedColumns.current = true;
      }
    }
  }, [setColumnsFromProps, gridState.viewportSizes.width]);

  // Grid Option Handlers
  useGridApiOptionHandler(apiRef, GRID_COLUMN_VISIBILITY_CHANGE, props.onColumnVisibilityChange);
}
