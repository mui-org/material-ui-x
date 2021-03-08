import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridCellApi } from '../../../models/api/gridCellApi';
import { GridRowId } from '../../../models/gridRows';
import { GridCellParams, ValueGetterParams } from '../../../models/params/gridCellParams';
import { GridRowParams } from '../../../models/params/gridRowParams';
import { getGridCellElement, getGridRowElement } from '../../../utils/domUtils';
import { useGridApiMethod } from '../../root/useGridApiMethod';

export function useGridCellApi(apiRef: GridApiRef) {
  const getRowParams = React.useCallback(
    (id: GridRowId) => {
      const params: GridRowParams = {
        id,
        element: apiRef.current.getRowElement(id),
        columns: apiRef.current.getAllColumns(),
        getValue: (columnField: string) => apiRef.current.getCellValue(id, columnField),
        row: apiRef.current.getRowFromId(id),
        rowIndex: apiRef.current.getRowIndexFromId(id),
        api: apiRef.current,
      };
      return params;
    },
    [apiRef],
  );

  const getCellParams = React.useCallback(
    (id: GridRowId, field: string) => {
      const colDef = apiRef.current.getColumnFromField(field);
      const element = apiRef.current.getCellElement(id, field);

      const params: GridCellParams = {
        element,
        id,
        value: apiRef.current.getCellValue(id, field),
        field,
        getValue: (columnField: string) => apiRef.current.getCellValue(id, columnField),
        row: apiRef.current.getRowFromId(id),
        colDef: apiRef.current.getColumnFromField(field),
        rowIndex: apiRef.current.getRowIndexFromId(id),
        colIndex: apiRef.current.getColumnIndex(field, true),
        api: apiRef.current,
      };
      const isEditableAttr = element && element.getAttribute('data-editable');
      params.isEditable =
        isEditableAttr != null
          ? isEditableAttr === 'true'
          : colDef && apiRef.current.isCellEditable(params);

      return params;
    },
    [apiRef],
  );

  const getValueGetterParams = React.useCallback(
    (id: GridRowId, field: string) => {
      const element = apiRef.current.getCellElement(id, field);
      const row = apiRef.current.getRowFromId(id);

      const params: ValueGetterParams = {
        element,
        id,
        field,
        row,
        value: row[field],
        getValue: (columnField: string) => row[columnField],
        colDef: apiRef.current.getColumnFromField(field),
        rowIndex: apiRef.current.getRowIndexFromId(id),
        colIndex: apiRef.current.getColumnIndex(field, true),
        api: apiRef.current,
      };

      return params;
    },
    [apiRef],
  );

  const getCellValue = React.useCallback(
    (id: GridRowId, field: string) => {
      const colDef = apiRef.current.getColumnFromField(field);
      const rowModel = apiRef.current.getRowFromId(id);

      if (!colDef || !colDef.valueGetter) {
        return rowModel[field];
      }

      return colDef.valueGetter(getValueGetterParams(id, field));
    },
    [apiRef, getValueGetterParams],
  );

  const getRowElement = React.useCallback(
    (id: GridRowId): HTMLDivElement | null => {
      if (!apiRef.current.rootElementRef!.current) {
        return null;
      }
      return getGridRowElement(apiRef.current.rootElementRef!.current!, id);
    },
    [apiRef],
  );
  const getCellElement = React.useCallback(
    (id: GridRowId, field: string): HTMLDivElement | null => {
      if (!apiRef.current.rootElementRef!.current) {
        return null;
      }
      return getGridCellElement(apiRef.current.rootElementRef!.current!, { id, field });
    },
    [apiRef],
  );

  useGridApiMethod<GridCellApi>(
    apiRef,
    {
      getCellValue,
      getCellParams,
      getCellElement,
      getRowParams,
      getRowElement,
    },
    'CellApi',
  );
}
