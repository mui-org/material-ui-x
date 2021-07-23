import * as React from 'react';
import clsx from 'clsx';
import { GridCellIdentifier } from '../../hooks/features/focus/gridFocusState';
import {
  GridRowModel,
  GridCellParams,
  GridRowId,
  GridEditRowProps,
  GridStateColDef,
} from '../../models/index';
import { GridCell, GridCellProps } from './GridCell';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { isFunction } from '../../utils/index';
import { GRID_CSS_CLASS_PREFIX } from '../../constants/cssClassesConstants';

interface RowCellsProps {
  cellClassName?: string;
  columns: GridStateColDef[];
  extendRowFullWidth: boolean;
  firstColIdx: number;
  id: GridRowId;
  hasScrollX: boolean;
  hasScrollY: boolean;
  height: number;
  getCellClassName?: (params: GridCellParams) => string;
  lastColIdx: number;
  row: GridRowModel;
  rowIndex: number;
  showCellRightBorder: boolean;
  cellFocus: GridCellIdentifier | null;
  cellTabIndex: GridCellIdentifier | null;
  isSelected: boolean;
  editRowState?: GridEditRowProps;
}

export const GridRowCells = React.memo(function GridRowCells(props: RowCellsProps) {
  const {
    columns,
    firstColIdx,
    hasScrollX,
    hasScrollY,
    height,
    id,
    getCellClassName,
    lastColIdx,
    rowIndex,
    cellFocus,
    cellTabIndex,
    showCellRightBorder,
    isSelected,
    editRowState,
    cellClassName,
    ...other
  } = props;
  const apiRef = useGridApiContext();
  const cellsProps = columns.slice(firstColIdx, lastColIdx + 1).map((column, colIdx) => {
    const colIndex = firstColIdx + colIdx;
    const isLastColumn = colIndex === columns.length - 1;
    const removeLastBorderRight = isLastColumn && hasScrollX && !hasScrollY;
    const showRightBorder = !isLastColumn
      ? showCellRightBorder
      : !removeLastBorderRight && !props.extendRowFullWidth;

    const cellParams: GridCellParams = apiRef!.current.getCellParams(id, column.field);

    const classNames = [cellClassName];

    if (column.cellClassName) {
      classNames.push(
        clsx(
          isFunction(column.cellClassName)
            ? column.cellClassName(cellParams)
            : column.cellClassName,
        ),
      );
    }

    const editCellState = editRowState && editRowState[column.field];
    let cellComponent: React.ReactNode = null;

    if (editCellState == null && column.renderCell) {
      cellComponent = column.renderCell(cellParams);
      classNames.push(`${GRID_CSS_CLASS_PREFIX}-cell--withRenderer`);
    }

    if (editCellState != null && column.renderEditCell) {
      const params = { ...cellParams, ...editCellState };
      cellComponent = column.renderEditCell(params);
      classNames.push(`${GRID_CSS_CLASS_PREFIX}-cell--editing`);
    }

    if (getCellClassName) {
      classNames.push(getCellClassName(cellParams));
    }

    const cellProps: GridCellProps = {
      value: cellParams.value,
      field: column.field,
      width: column.computedWidth,
      rowId: id,
      height,
      showRightBorder,
      formattedValue: cellParams.formattedValue,
      align: column.align || 'left',
      rowIndex,
      cellMode: cellParams.cellMode,
      colIndex,
      children: cellComponent,
      isEditable: cellParams.isEditable,
      isSelected,
      hasFocus: cellFocus !== null && cellFocus.id === id && cellFocus.field === column.field,
      tabIndex:
        cellTabIndex !== null && cellTabIndex.id === id && cellTabIndex.field === column.field
          ? 0
          : -1,
      className: clsx(classNames),
      ...other,
    };

    return cellProps;
  });

  return (
    <React.Fragment>
      {cellsProps.map((cellProps) => (
        <GridCell key={cellProps.field} {...cellProps} />
      ))}
    </React.Fragment>
  );
});
