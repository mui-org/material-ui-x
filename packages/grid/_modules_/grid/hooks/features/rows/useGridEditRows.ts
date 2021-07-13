import * as React from 'react';
import {
  GRID_CELL_MODE_CHANGE,
  GRID_CELL_EDIT_PROPS_CHANGE,
  GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED,
  GRID_ROW_EDIT_MODEL_CHANGE,
  GRID_CELL_DOUBLE_CLICK,
  GRID_CELL_EDIT_ENTER,
  GRID_CELL_EDIT_EXIT,
  GRID_CELL_NAVIGATION_KEY_DOWN,
  GRID_CELL_MOUSE_DOWN,
  GRID_CELL_KEY_DOWN,
  GRID_CELL_VALUE_CHANGE,
  GRID_COLUMN_HEADER_DRAG_START,
  GRID_CELL_FOCUS_OUT,
  GRID_CELL_FOCUS_IN,
  GRID_ROW_EDIT_EXIT,
  GRID_ROW_EDIT_COMMIT,
} from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridEditRowApi } from '../../../models/api/gridEditRowApi';
import { GridCellMode } from '../../../models/gridCell';
import { GridEditRowsModel } from '../../../models/gridEditRowModel';
import { GridRowId } from '../../../models/gridRows';
import { GridCellParams } from '../../../models/params/gridCellParams';
import { GridRowParams } from '../../../models/params/gridRowParams';
import {
  GridEditCellPropsParams,
  GridEditRowModelParams,
  GridEditCellValueParams,
  GridCommitCellChangeParams,
  GridCommitRowChangeParams,
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
import { allGridColumnsSelector } from '../columns/gridColumnsSelector';
import { useEventCallback } from '../../../utils/material-ui-utils';
import { useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';

export function useGridEditRows(apiRef: GridApiRef) {
  const logger = useLogger('useGridEditRows');
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);
  const columns = useGridSelector(apiRef, allGridColumnsSelector);
  const focusTimeout = React.useRef<any>(null);
  const nextFocusedCell = React.useRef<GridCellParams | null>(null);

  const commitPropsAndExit = (params: GridCellParams) => {
    if (params.cellMode === 'view') {
      return;
    }
    if (options.editMode === 'row') {
      nextFocusedCell.current = null;
      focusTimeout.current = setTimeout(() => {
        if (nextFocusedCell.current?.id !== params.id) {
          apiRef.current.publishEvent(GRID_ROW_EDIT_EXIT, { id: params.id });
        }
      });
    } else {
      apiRef.current.commitCellChange(params);
      apiRef.current.publishEvent(GRID_CELL_EDIT_EXIT, params);
    }
  };

  const handleCellFocusOut = useEventCallback(
    (params: GridCellParams, event?: MouseEvent | React.SyntheticEvent) => {
      if (event && (event as any).defaultMuiPrevented) {
        return;
      }
      commitPropsAndExit(params);
    },
  );

  const handleCellFocusIn = React.useCallback((params) => {
    nextFocusedCell.current = params;
  }, []);

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

  const changeCellEditProps = React.useCallback(
    (params: GridEditCellPropsParams, event?: React.SyntheticEvent) => {
      apiRef.current.publishEvent(GRID_CELL_EDIT_PROPS_CHANGE, params, event);
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
      if (options.editMode === 'row') {
        throw new Error(`You can't commit changes when the edit mode is 'row'`);
      }

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
    [apiRef, options.editMode],
  );

  const commitRowChange = React.useCallback(
    (params: GridCommitRowChangeParams, event?: React.SyntheticEvent): boolean => {
      if (options.editMode === 'cell') {
        throw new Error(`You can't commit changes when the edit mode is 'cell'`);
      }

      const { id } = params;
      const model = apiRef.current.getEditRowsModel();
      const editRow = model[id];
      if (!editRow) {
        throw new Error(`Row at id: ${id} is not being editted`);
      }

      // TODO Ensure that there's no cell with error
      const error = false;
      if (!error) {
        apiRef.current.publishEvent(GRID_ROW_EDIT_COMMIT, params, event);
        return true;
      }
      return false;
    },
    [apiRef, options.editMode],
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

  const handleCellEditExit = React.useCallback(
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

  const handleRowEditExit = React.useCallback(
    (params: GridRowParams, event: React.SyntheticEvent) => {
      apiRef.current.commitRowChange(params, event);
    },
    [apiRef],
  );

  const handleRowEditCommit = React.useCallback(
    (params: GridRowParams) => {
      const { id } = params;
      const model = apiRef.current.getEditRowsModel();
      const editRow = model[id];
      if (!editRow) {
        throw new Error(`Row at id: ${id} is not being editted`);
      }

      const row = apiRef.current.getRow(id);
      const rowUpdate = { ...row };
      Object.keys(editRow).forEach((field) => {
        rowUpdate[field] = editRow[field].value;
      });
      apiRef.current.updateRows([rowUpdate]);

      const newEditRows = { ...model };
      delete newEditRows[id];
      setGridState((state) => ({ ...state, editRows: newEditRows }));
    },
    [apiRef, setGridState],
  );

  const handleCellEnterEdit = React.useCallback(
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

  const startEditingRow = React.useCallback(
    (id) => {
      setGridState((state) => {
        const newEditRowsState: GridEditRowsModel = { ...state.editRows };
        if (newEditRowsState[id]) {
          // Row is already being editted
          return state;
        }
        newEditRowsState[id] = {};
        columns.forEach((column) => {
          newEditRowsState[id][column.field] = {
            value: apiRef.current.getCellValue(id, column.field),
          };
        });
        return { ...state, editRows: newEditRowsState };
      });
      forceUpdate();
    },
    [apiRef, columns, forceUpdate, setGridState],
  );

  const handleCellKeyDown = React.useCallback(
    (params: GridCellParams, event) => {
      if (!params.isEditable || event.isPropagationStopped()) {
        return;
      }

      const isInEditMode = params.cellMode === 'edit';
      const isModifierKeyPressed = event.ctrlKey || event.metaKey || event.altKey;

      if (options.editMode === 'row') {
        if (isInEditMode) {
          if (event.key === 'Enter') {
            apiRef.current.commitRowChange({ id: params.id });
          } else if (event.key === 'Escape') {
            setGridState((state) => {
              const newEditRowsState: GridEditRowsModel = { ...state.editRows };
              delete newEditRowsState[params.id];
              return { ...state, editRows: newEditRowsState };
            });
            forceUpdate();
          }
        } else if (event.key === 'Enter') {
          startEditingRow(params.id);
        }
        return;
      }

      if (!isInEditMode && isCellEnterEditModeKeys(event.key) && !isModifierKeyPressed) {
        apiRef.current.publishEvent(GRID_CELL_EDIT_ENTER, params, event);
      }
      if (!isInEditMode && isDeleteKeys(event.key)) {
        const commitParams = apiRef.current.getEditCellPropsParams(params.id, params.field);
        commitParams.props.value = '';
        apiRef.current.commitCellChange(commitParams, event);
        apiRef.current.publishEvent(GRID_CELL_EDIT_EXIT, params, event);
      }
      if (isInEditMode && isCellEditCommitKeys(event.key)) {
        const commitParams = apiRef.current.getEditCellPropsParams(params.id, params.field);
        if (!apiRef.current.commitCellChange(commitParams, event)) {
          return;
        }
      }
      if (isInEditMode && !event.isPropagationStopped() && isCellExitEditModeKeys(event.key)) {
        apiRef.current.publishEvent(GRID_CELL_EDIT_EXIT, params, event);
      }
    },
    [apiRef, forceUpdate, options.editMode, setGridState, startEditingRow],
  );

  const handleDoubleClick = React.useCallback(
    (params: GridCellParams, event) => {
      if (options.editMode === 'cell') {
        apiRef.current.publishEvent(GRID_CELL_EDIT_ENTER, params, event);
        return;
      }
      startEditingRow(params.id);
    },
    [apiRef, options.editMode, startEditingRow],
  );

  useGridApiEventHandler(apiRef, GRID_CELL_KEY_DOWN, handleCellKeyDown);
  useGridApiEventHandler(apiRef, GRID_CELL_MOUSE_DOWN, preventTextSelection);
  useGridApiEventHandler(apiRef, GRID_CELL_DOUBLE_CLICK, handleDoubleClick);
  useGridApiEventHandler(apiRef, GRID_CELL_EDIT_ENTER, handleCellEnterEdit);
  useGridApiEventHandler(apiRef, GRID_CELL_EDIT_EXIT, handleCellEditExit);
  useGridApiEventHandler(apiRef, GRID_CELL_FOCUS_OUT, handleCellFocusOut);
  useGridApiEventHandler(apiRef, GRID_CELL_FOCUS_IN, handleCellFocusIn);
  useGridApiEventHandler(apiRef, GRID_CELL_EDIT_PROPS_CHANGE, handleCellEditPropsChange);
  useGridApiEventHandler(apiRef, GRID_COLUMN_HEADER_DRAG_START, handleColumnHeaderDragStart);
  useGridApiEventHandler(
    apiRef,
    GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED,
    handleCellEditPropsChangeCommited,
  );
  useGridApiEventHandler(apiRef, GRID_ROW_EDIT_EXIT, handleRowEditExit);
  useGridApiEventHandler(apiRef, GRID_ROW_EDIT_COMMIT, handleRowEditCommit);

  useGridApiOptionHandler(
    apiRef,
    GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED,
    options.onEditCellChangeCommitted,
  );
  useGridApiOptionHandler(apiRef, GRID_CELL_EDIT_PROPS_CHANGE, options.onEditCellChange);
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
      commitRowChange,
      setEditCellProps,
      getEditCellPropsParams,
      setEditRowsModel,
      getEditRowsModel,
      changeCellEditProps,
    },
    'EditRowApi',
  );

  React.useEffect(() => {
    apiRef.current.setEditRowsModel(options.editRowsModel || {});
  }, [apiRef, options.editRowsModel]);
}
