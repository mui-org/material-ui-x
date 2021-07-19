import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { useGridSelector } from '../features/core/useGridSelector';
import { optionsSelector } from '../utils/optionsSelector';
import {
  GRID_CELL_CLICK,
  GRID_COLUMN_HEADER_CLICK,
  GRID_ROW_CLICK,
  GRID_CELL_OVER,
  GRID_ROW_OVER,
  GRID_COMPONENT_ERROR,
  GRID_STATE_CHANGE,
  GRID_CELL_DOUBLE_CLICK,
  GRID_CELL_CONTEXT_MENU,
  GRID_ROW_DOUBLE_CLICK,
  GRID_ROW_CONTEXT_MENU,
  GRID_CELL_ENTER,
  GRID_CELL_LEAVE,
  GRID_CELL_OUT,
  GRID_ROW_ENTER,
  GRID_ROW_LEAVE,
  GRID_ROW_OUT,
  GRID_COLUMN_HEADER_LEAVE,
  GRID_COLUMN_HEADER_ENTER,
  GRID_COLUMN_HEADER_DOUBLE_CLICK,
  GRID_COLUMN_HEADER_OVER,
  GRID_COLUMN_HEADER_OUT,
  GRID_COLUMN_ORDER_CHANGE,
  GRID_CELL_KEY_DOWN,
  GRID_CELL_FOCUS_OUT,
  GRID_CELL_BLUR,
  GRID_KEYDOWN,
} from '../../constants/eventsConstants';
import { useGridApiOptionHandler } from './useGridApiEventHandler';
import { useNativeEventListener } from './useNativeEventListener';

export function useEvents(apiRef: GridApiRef): void {
  const options = useGridSelector(apiRef, optionsSelector);

  useGridApiOptionHandler(apiRef, GRID_COLUMN_HEADER_CLICK, options.onColumnHeaderClick);
  useGridApiOptionHandler(
    apiRef,
    GRID_COLUMN_HEADER_DOUBLE_CLICK,
    options.onColumnHeaderDoubleClick,
  );
  useGridApiOptionHandler(apiRef, GRID_COLUMN_HEADER_OVER, options.onColumnHeaderOver);
  useGridApiOptionHandler(apiRef, GRID_COLUMN_HEADER_OUT, options.onColumnHeaderOut);
  useGridApiOptionHandler(apiRef, GRID_COLUMN_HEADER_ENTER, options.onColumnHeaderEnter);
  useGridApiOptionHandler(apiRef, GRID_COLUMN_HEADER_LEAVE, options.onColumnHeaderLeave);
  useGridApiOptionHandler(apiRef, GRID_COLUMN_ORDER_CHANGE, options.onColumnOrderChange);

  useGridApiOptionHandler(apiRef, GRID_CELL_CLICK, options.onCellClick);
  useGridApiOptionHandler(apiRef, GRID_CELL_DOUBLE_CLICK, options.onCellDoubleClick);
  useGridApiOptionHandler(apiRef, GRID_CELL_CONTEXT_MENU, options.onCellContextMenu);
  useGridApiOptionHandler(apiRef, GRID_CELL_OVER, options.onCellOver);
  useGridApiOptionHandler(apiRef, GRID_CELL_OUT, options.onCellOut);
  useGridApiOptionHandler(apiRef, GRID_CELL_ENTER, options.onCellEnter);
  useGridApiOptionHandler(apiRef, GRID_CELL_LEAVE, options.onCellLeave);
  useGridApiOptionHandler(apiRef, GRID_CELL_KEY_DOWN, options.onCellKeyDown);
  useGridApiOptionHandler(apiRef, GRID_CELL_BLUR, options.onCellBlur);
  useGridApiOptionHandler(apiRef, GRID_CELL_FOCUS_OUT, options.onCellFocusOut);

  useGridApiOptionHandler(apiRef, GRID_ROW_DOUBLE_CLICK, options.onRowDoubleClick);
  useGridApiOptionHandler(apiRef, GRID_ROW_CONTEXT_MENU, options.onRowContextMenu);
  useGridApiOptionHandler(apiRef, GRID_ROW_CLICK, options.onRowClick);
  useGridApiOptionHandler(apiRef, GRID_ROW_OVER, options.onRowOver);
  useGridApiOptionHandler(apiRef, GRID_ROW_OUT, options.onRowOut);
  useGridApiOptionHandler(apiRef, GRID_ROW_ENTER, options.onRowEnter);
  useGridApiOptionHandler(apiRef, GRID_ROW_LEAVE, options.onRowLeave);

  useGridApiOptionHandler(apiRef, GRID_COMPONENT_ERROR, options.onError);
  useGridApiOptionHandler(apiRef, GRID_STATE_CHANGE, options.onStateChange);

  const getHandler = React.useCallback(
    (name: string) =>
      (...args: any[]) =>
        apiRef.current.publishEvent(name, ...args),
    [apiRef],
  );

  useNativeEventListener(
    apiRef,
    apiRef.current.rootElementRef!,
    GRID_KEYDOWN,
    getHandler(GRID_KEYDOWN),
  );
}
