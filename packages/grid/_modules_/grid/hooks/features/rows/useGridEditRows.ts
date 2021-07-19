import * as React from 'react';
import {
  GRID_CELL_MODE_CHANGE,
  GRID_CELL_EDIT_PROPS_CHANGE,
  GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED,
  GRID_ROW_EDIT_MODEL_CHANGE,
  GRID_CELL_DOUBLE_CLICK,
  GRID_CELL_CONTEXT_MENU,
  GRID_CELL_EDIT_ENTER,
  GRID_CELL_EDIT_EXIT,
  GRID_CELL_NAVIGATION_KEY_DOWN,
  GRID_CELL_MOUSE_DOWN,
  GRID_CELL_KEY_DOWN,
  GRID_CELL_VALUE_CHANGE,
  GRID_COLUMN_HEADER_DRAG_START,
  GRID_CELL_FOCUS_OUT,
} from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridEditRowApi } from '../../../models/api/gridEditRowApi';
import { GridCellMode } from '../../../models/gridCell';
import { GridEditRowsModel } from '../../../models/gridEditRowModel';
import { GridRowId } from '../../../models/gridRows';
import { GridCellParams } from '../../../models/params/gridCellParams';
import {
  GridEditCellPropsParams,
  GridEditRowModelParams,
  GridEditCellValueParams,
  GridCommitCellChangeParams,
} from '../../../models/params/gridEditCellParams';
import {
  isPrintableKey,
  isCellEditCommitKeys,
  isCellEnterEditModeKeys,
  isCellExitEditModeKeys,
  isDeleteKeys,
  isEscapeKey,
  isKeyboardEvent,
} from '../../../utils/keyboardUtils';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { useEventCallback } from '../../../utils/material-ui-utils';
import { useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';

export function useGridEditRows(apiRef: GridApiRef) {
  const logger = useLogger('useGridEditRows');
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);

  const commitPropsAndExit = (params: GridCellParams) => {
    if (params.cellMode === 'view') {
      return;
    }
    apiRef.current.commitCellChange(params);
    apiRef.current.publishEvent(GRID_CELL_EDIT_EXIT, params);
  };

  const handleCellFocusOut = useEventCallback(
    (params: GridCellParams, event?: MouseEvent | React.SyntheticEvent) => {
      if (event && (event as any).defaultMuiPrevented) {
        return;
      }
      commitPropsAndExit(params);
    },
  );

  const handleColumnHeaderDragStart = useEventCallback(() => {
    const { cell } = apiRef.current.getState().focus;
    if (!cell) {
      return;
    }
    const params = apiRef.current.getCellParams(cell.id, cell.field);
    commitPropsAndExit(params);
  });

  const setCellMode = React.useCallback(
    (id, field, mode: GridCellMode) => {
      const isInEditMode = apiRef.current.getCellMode(id, field) === 'edit';
      if ((mode === 'edit' && isInEditMode) || (mode === 'view' && !isInEditMode)) {
        return;
      }

      logger.debug(`Switching cell id: ${id} field: ${field} to mode: ${mode}`);
      setGridState((state) => {
        const newEditRowsState: GridEditRowsModel = { ...state.editRows };
        if (mode === 'edit') {
          newEditRowsState[id] = { ...newEditRowsState[id] };
          newEditRowsState[id][field] = { value: apiRef.current.getCellValue(id, field) };
        } else {
          delete newEditRowsState[id][field];
          if (!Object.keys(newEditRowsState[id]).length) {
            delete newEditRowsState[id];
          }
        }
        return { ...state, editRows: newEditRowsState };
      });
      forceUpdate();
      apiRef.current.publishEvent(GRID_CELL_MODE_CHANGE, {
        id,
        field,
        mode,
        api: apiRef.current,
      });

      const editRowParams: GridEditRowModelParams = {
        api: apiRef.current,
        model: apiRef.current.getState().editRows,
      };
      apiRef.current.publishEvent(GRID_ROW_EDIT_MODEL_CHANGE, editRowParams);
    },
    [apiRef, forceUpdate, logger, setGridState],
  );

  const getCellMode = React.useCallback(
    (id, field) => {
      const editState = apiRef.current.getState().editRows;
      const isEditing = editState[id] && editState[id][field];
      return isEditing ? 'edit' : 'view';
    },
    [apiRef],
  );

  const isCellEditable = React.useCallback(
    (params: GridCellParams) =>
      params.colDef.editable &&
      params.colDef!.renderEditCell &&
      (!options.isCellEditable || options.isCellEditable(params)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.isCellEditable],
  );

  const setEditCellValue = React.useCallback(
    (params: GridEditCellValueParams, event?: React.SyntheticEvent) => {
      const newParams = { id: params.id, field: params.field, props: { value: params.value } };
      apiRef.current.publishEvent(GRID_CELL_EDIT_PROPS_CHANGE, newParams, event);
    },
    [apiRef],
  );

  const setEditCellProps = React.useCallback(
    (params: GridEditCellPropsParams) => {
      const { id, field, props } = params;
      logger.debug(`Setting cell props on id: ${id} field: ${field}`);
      setGridState((state) => {
        const column = apiRef.current.getColumn(field);
        const parsedValue = column.valueParser
          ? column.valueParser(props.value, apiRef.current.getCellParams(id, field))
          : props.value;

        const editRowsModel: GridEditRowsModel = { ...state.editRows };
        editRowsModel[id] = { ...state.editRows[id] };
        editRowsModel[id][field] = { ...props, value: parsedValue };
        return { ...state, editRows: editRowsModel };
      });
      forceUpdate();
      const editRowParams: GridEditRowModelParams = {
        api: apiRef.current,
        model: apiRef.current.getState().editRows,
      };
      apiRef.current.publishEvent(GRID_ROW_EDIT_MODEL_CHANGE, editRowParams);
    },
    [apiRef, forceUpdate, logger, setGridState],
  );

  const handleCellEditPropsChange = React.useCallback(
    (params: GridEditCellPropsParams, event?: React.SyntheticEvent) => {
      if (event?.isPropagationStopped()) {
        return;
      }
      apiRef.current.setEditCellProps(params);
    },
    [apiRef],
  );

  const setEditRowsModel = React.useCallback(
    (editRows: GridEditRowsModel): void => {
      logger.debug(`Setting row model`);

      setGridState((state) => ({ ...state, editRows }));
      forceUpdate();
    },
    [forceUpdate, logger, setGridState],
  );

  const getEditRowsModel = React.useCallback(
    (): GridEditRowsModel => apiRef.current.getState().editRows,
    [apiRef],
  );

  const getEditCellPropsParams = React.useCallback(
    (id: GridRowId, field: string): GridEditCellPropsParams => {
      const model = apiRef.current.getEditRowsModel();
      if (!model[id] || !model[id][field]) {
        throw new Error(`Cell at id: ${id} and field: ${field} is not in edit mode`);
      }
      return { id, field, props: model[id][field] };
    },
    [apiRef],
  );

  const commitCellChange = React.useCallback(
    (params: GridCommitCellChangeParams, event?: React.SyntheticEvent): boolean => {
      const { id, field } = params;
      const model = apiRef.current.getEditRowsModel();
      if (!model[id] || !model[id][field]) {
        throw new Error(`Cell at id: ${id} and field: ${field} is not in edit mode`);
      }

      const { error } = model[id][field];
      if (!error) {
        apiRef.current.publishEvent(GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED, params, event);
        return true;
      }
      return false;
    },
    [apiRef],
  );

  const handleCellEditPropsChangeCommited = React.useCallback(
    (params: GridCommitCellChangeParams, event?: React.SyntheticEvent) => {
      if (event?.isPropagationStopped()) {
        return;
      }

      const { id, field } = params;
      const model = apiRef.current.getEditRowsModel();
      const { value } = model[id][field];
      logger.debug(`Setting cell id: ${id} field: ${field} to value: ${value?.toString()}`);
      const row = apiRef.current.getRow(id);
      const rowUpdate = { ...row, [field]: value };
      apiRef.current.updateRows([rowUpdate]);
      const cellValueChangeParams: GridEditCellValueParams = { id, field, value };
      apiRef.current.publishEvent(GRID_CELL_VALUE_CHANGE, cellValueChangeParams);
    },
    [apiRef, logger],
  );

  const handleExitEdit = React.useCallback(
    (params: GridCellParams, event?: React.SyntheticEvent) => {
      setCellMode(params.id, params.field, 'view');

      // When dispatched by the document, the event is not passed
      if (!event || !isKeyboardEvent(event)) {
        return;
      }

      if (isCellEditCommitKeys(event.key)) {
        apiRef.current.publishEvent(GRID_CELL_NAVIGATION_KEY_DOWN, params, event);
        return;
      }
      if (isEscapeKey(event.key) || isDeleteKeys(event.key)) {
        apiRef.current.setCellFocus(params.id, params.field);
      }
    },
    [apiRef, setCellMode],
  );

  const handleEnterEdit = React.useCallback(
    (params: GridCellParams, event: React.MouseEvent | React.KeyboardEvent) => {
      if (!params.isEditable || event.isPropagationStopped()) {
        return;
      }

      setCellMode(params.id, params.field, 'edit');

      if (isKeyboardEvent(event) && isPrintableKey(event.key)) {
        const propsParams = apiRef.current.getEditCellPropsParams(params.id, params.field);
        propsParams.props.value = '';
        apiRef.current.setEditCellProps(propsParams);
      }
    },
    [apiRef, setCellMode],
  );

  const preventTextSelection = React.useCallback(
    (params: GridCellParams, event: React.MouseEvent) => {
      const isMoreThanOneClick = event.detail > 1;
      if (params.isEditable && params.cellMode === 'view' && isMoreThanOneClick) {
        // If we click more than one time, then we prevent the default behavior of selecting the text cell.
        event.preventDefault();
      }
    },
    [],
  );

  const handleCellKeyDown = React.useCallback(
    (params: GridCellParams, event) => {
      if (!params.isEditable || event.isPropagationStopped()) {
        return;
      }

      const isEditMode = params.cellMode === 'edit';

      const isModifierKeyPressed = event.ctrlKey || event.metaKey || event.altKey;
      if (!isEditMode && isCellEnterEditModeKeys(event.key) && !isModifierKeyPressed) {
        apiRef.current.publishEvent(GRID_CELL_EDIT_ENTER, params, event);
      }
      if (!isEditMode && isDeleteKeys(event.key)) {
        const commitParams = apiRef.current.getEditCellPropsParams(params.id, params.field);
        commitParams.props.value = '';
        apiRef.current.commitCellChange(commitParams, event);
        apiRef.current.publishEvent(GRID_CELL_EDIT_EXIT, params, event);
      }
      if (isEditMode && isCellEditCommitKeys(event.key)) {
        const commitParams = apiRef.current.getEditCellPropsParams(params.id, params.field);
        if (!apiRef.current.commitCellChange(commitParams, event)) {
          return;
        }
      }
      if (isEditMode && !event.isPropagationStopped() && isCellExitEditModeKeys(event.key)) {
        apiRef.current.publishEvent(GRID_CELL_EDIT_EXIT, params, event);
      }
    },
    [apiRef],
  );

  const handleDoubleClick = React.useCallback(
    (...args) => {
      apiRef.current.publishEvent(GRID_CELL_EDIT_ENTER, ...args);
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, GRID_CELL_KEY_DOWN, handleCellKeyDown);
  useGridApiEventHandler(apiRef, GRID_CELL_MOUSE_DOWN, preventTextSelection);
  useGridApiEventHandler(apiRef, GRID_CELL_DOUBLE_CLICK, handleDoubleClick);
  useGridApiEventHandler(apiRef, GRID_CELL_CONTEXT_MENU, handleDoubleClick);
  useGridApiEventHandler(apiRef, GRID_CELL_EDIT_ENTER, handleEnterEdit);
  useGridApiEventHandler(apiRef, GRID_CELL_EDIT_EXIT, handleExitEdit);
  useGridApiEventHandler(apiRef, GRID_CELL_FOCUS_OUT, handleCellFocusOut);
  useGridApiEventHandler(apiRef, GRID_CELL_EDIT_PROPS_CHANGE, handleCellEditPropsChange);
  useGridApiEventHandler(apiRef, GRID_COLUMN_HEADER_DRAG_START, handleColumnHeaderDragStart);
  useGridApiEventHandler(
    apiRef,
    GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED,
    handleCellEditPropsChangeCommited,
  );

  useGridApiOptionHandler(
    apiRef,
    GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED,
    options.onEditCellChangeCommitted,
  );
  // TODO rename to onEditCellPropsChange
  useGridApiOptionHandler(apiRef, GRID_CELL_EDIT_PROPS_CHANGE, options.onEditCellChange);
  // TODO remove because onEditCellChange does the same
  useGridApiOptionHandler(apiRef, GRID_CELL_VALUE_CHANGE, options.onCellValueChange);
  useGridApiOptionHandler(apiRef, GRID_CELL_MODE_CHANGE, options.onCellModeChange);
  useGridApiOptionHandler(apiRef, GRID_ROW_EDIT_MODEL_CHANGE, options.onEditRowModelChange);

  useGridApiMethod<GridEditRowApi>(
    apiRef,
    {
      setCellMode,
      getCellMode,
      isCellEditable,
      commitCellChange,
      setEditCellProps, // TODO don't expose, update the editRowsModel prop directly
      getEditCellPropsParams,
      setEditRowsModel,
      getEditRowsModel,
      setEditCellValue,
    },
    'EditRowApi',
  );

  React.useEffect(() => {
    apiRef.current.setEditRowsModel(options.editRowsModel || {});
  }, [apiRef, options.editRowsModel]);
}
