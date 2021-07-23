import * as React from 'react';
import { GridCellValue } from '../gridCell';
import { GridCellClassNamePropType } from '../gridCellClass';
import { GridColumnHeaderClassNamePropType } from '../gridColumnHeaderClass';
import { GridFilterOperator } from '../gridFilterOperator';
import {
  GridCellParams,
  GridValueFormatterParams,
  GridValueGetterParams,
} from '../params/gridCellParams';
import { GridColumnHeaderParams } from '../params/gridColumnHeaderParams';
import { GridComparatorFn } from '../gridSortModel';
import { GridColType, GridNativeColTypes } from './gridColType';

/**
 * Alignment used in position elements in Cells.
 */
export type GridAlignment = 'left' | 'right' | 'center';

/**
 * Column Definition interface.
 */
export interface GridColDef {
  /**
   * The column identifier. It's used to map with [[GridRowData]] values.
   */
  field: string;
  /**
   * The title of the column rendered in the column header cell.
   */
  headerName?: string;
  /**
   * The description of the column rendered as tooltip if the column header name is not fully displayed.
   */
  description?: string;
  /**
   * Set the width of the column.
   * @default 100
   */
  width?: number;
  /**
   * If set, it indicates that a column has fluid width. Range [0, ∞).
   */
  flex?: number;
  /**
   * Sets the minimum width of a column.
   * @default 50
   */
  minWidth?: number;
  /**
   * If `true`, hide the column.
   * @default false
   */
  hide?: boolean;
  /**
   * If `true`, the column is sortable.
   * @default true
   */
  sortable?: boolean;
  /**
   * If `true`, the column is resizable.
   * @default true
   */
  resizable?: boolean;
  /**
   * If `true`, the cells of the column are editable.
   * @default false
   */
  editable?: boolean;
  /**
   * A comparator function used to sort rows.
   */
  sortComparator?: GridComparatorFn;
  /**
   * Type allows to merge this object with a default definition [[GridColDef]].
   * @default 'string'
   */
  type?: GridColType;
  /**
   * To be used in combination with `type: 'singleSelect'`. This is an array of the possible cell values and labels.
   */
  valueOptions?: Array<string | number | { value: any; label: string }>;
  /**
   * Allows to align the column values in cells.
   */
  align?: GridAlignment;
  /**
   * Function that allows to get a specific data instead of field to render in the cell.
   * @param params
   */
  valueGetter?: (params: GridValueGetterParams) => GridCellValue;
  /**
   * Function that allows to apply a formatter before rendering its value.
   * @param {GridValueFormatterParams} params Object containing parameters for the formatter.
   * @returns {GridCellValue} The formatted value.
   */
  valueFormatter?: (params: GridValueFormatterParams) => GridCellValue;
  /**
   * Function that takes the user-entered value and converts it to a value used internally.
   * @param {GridCellValue} value The user-entered value.
   * @param {GridCellParams} params The params when called before saving the value.
   * @returns {GridCellValue} The converted value to use internally.
   */
  valueParser?: (value: GridCellValue, params?: GridCellParams) => GridCellValue;
  /**
   * Class name that will be added in cells for that column.
   */
  cellClassName?: GridCellClassNamePropType;
  /**
   * Allows to override the component rendered as cell for this column.
   * @param params
   */
  renderCell?: (params: GridCellParams) => React.ReactNode;
  /**
   * Allows to override the component rendered in edit cell mode for this column.
   * @param params
   */
  renderEditCell?: (params: GridCellParams) => React.ReactNode;
  /**
   * Class name that will be added in the column header cell.
   */
  headerClassName?: GridColumnHeaderClassNamePropType;
  /**
   * Allows to render a component in the column header cell.
   * @param params
   */
  renderHeader?: (params: GridColumnHeaderParams) => React.ReactNode;
  /**
   * Header cell element alignment.
   */
  headerAlign?: GridAlignment;
  /**
   * Toggle the visibility of the sort icons.
   * @default false
   */
  hideSortIcons?: boolean;
  /**
   * If `true`, the column menu is disabled for this column.
   * @default false
   */
  disableColumnMenu?: boolean;
  /**
   * If `true`, the column is filterable.
   * @default true
   */
  filterable?: boolean;
  /**
   * Allows setting the filter operators for this column.
   */
  filterOperators?: GridFilterOperator[];
  /**
   * If `true`, this column cannot be reordered.
   * @default false
   */
  disableReorder?: boolean;
  /**
   * If `true`, this column will not be included in exports.
   * @default false
   */
  disableExport?: boolean;
}

export type GridColumns = GridColDef[];
export type GridColTypeDef = Omit<GridColDef, 'field'> & { extendType?: GridNativeColTypes };

export interface GridStateColDef extends GridColDef {
  computedWidth: number;
}

/**
 * Meta Info about columns.
 */
export interface GridColumnsMeta {
  totalWidth: number;
  positions: number[];
}

export type GridColumnLookup = { [field: string]: GridStateColDef };

export interface GridColumnsState {
  all: string[];
  lookup: GridColumnLookup;
}

export const getInitialGridColumnsState = (): GridColumnsState => ({
  all: [],
  lookup: {},
});
