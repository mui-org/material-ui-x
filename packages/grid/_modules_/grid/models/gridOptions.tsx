import * as React from 'react';
import { GRID_DEFAULT_LOCALE_TEXT } from '../constants/localeTextConstants';
import { GridFilterModel } from '../hooks/features/filter/gridFilterModelState';
import { GridLocaleText } from './api/gridLocaleTextApi';
import { GridColumnTypesRecord } from './colDef/gridColTypeDef';
import { getGridDefaultColumnTypes } from './colDef/gridDefaultColumnTypes';
import { GridDensity, GridDensityTypes } from './gridDensity';
import { GridEditRowsModel } from './gridEditRowModel';
import { GridFeatureMode, GridFeatureModeConstant } from './gridFeatureMode';
import { Logger } from './logger';
import { GridCellParams } from './params/gridCellParams';
import { GridColumnHeaderParams } from './params/gridColumnHeaderParams';
import { GridPageChangeParams } from './params/gridPageChangeParams';
import { GridRowParams } from './params/gridRowParams';
import { GridSelectionModel } from './gridSelectionModel';
import { GridSortDirection, GridSortModel } from './gridSortModel';
import {
  GridCellModeChangeParams,
  GridEditCellPropsParams,
  GridEditCellValueParams,
} from './params/gridEditCellParams';
import { GridRowScrollEndParams } from './params/gridRowScrollEndParams';
import { GridColumnOrderChangeParams } from './params/gridColumnOrderChangeParams';
import { GridResizeParams } from './params/gridResizeParams';
import { GridColumnResizeParams } from './params/gridColumnResizeParams';
import { GridColumnVisibilityChangeParams } from './params/gridColumnVisibilityChangeParams';
import { GridClasses } from './gridClasses';

export type MuiEvent<E> = (E | React.SyntheticEvent) & {
  defaultMuiPrevented?: boolean;
};

// TODO add multiSortKey
/**
 * Grid options react prop, containing all the setting for the grid.
 */
export interface GridOptions {
  /**
   * If `true`, the grid height is dynamic and follow the number of rows in the grid.
   * @default false
   */
  autoHeight?: boolean;
  /**
   * If `true`, the pageSize is calculated according to the container size and the max number of rows to avoid rendering a vertical scroll bar.
   * @default false
   */
  autoPageSize?: boolean;
  /**
   * If `true`, the grid get a first column with a checkbox that allows to select rows.
   * @default false
   */
  checkboxSelection?: boolean;
  /**
   * If `true`, the "Select All" header checkbox selects only the rows on the current page. To be used in combination with `checkboxSelection`.
   * @default false
   */
  checkboxSelectionVisibleOnly?: boolean;
  /**
   * Number of columns rendered outside the grid viewport.
   * @default 2
   */
  columnBuffer: number;
  /**
   * Extend native column types with your new column types.
   */
  columnTypes: GridColumnTypesRecord;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: GridClasses;
  /**
   * Set the density of the grid.
   */
  density: GridDensity;
  /**
   * If `true`, rows will not be extended to fill the full width of the grid container.
   * @default false
   */
  disableExtendRowFullWidth?: boolean;
  /**
   * If `true`, column filters are disabled.
   * @default false
   */
  disableColumnFilter?: boolean;
  /**
   * If `true`, the column menu is disabled.
   * @default false
   */
  disableColumnMenu?: boolean;
  /**
   * If `true`, reordering columns is disabled.
   * @default false
   */
  disableColumnReorder?: boolean;
  /**
   * If `true`, resizing columns is disabled.
   * @default false
   */
  disableColumnResize?: boolean;
  /**
   * If `true`, hiding/showing columns is disabled.
   * @default false
   */
  disableColumnSelector?: boolean;
  /**
   * If `true`, the density selector is disabled.
   * @default false
   */
  disableDensitySelector?: boolean;
  /**
   * If `true`, filtering with multiple columns is disabled.
   * @default false
   */
  disableMultipleColumnsFiltering?: boolean;
  /**
   * If `true`, multiple selection using the CTRL or CMD key is disabled.
   * @default false
   */
  disableMultipleSelection?: boolean;
  /**
   * If `true`, sorting with multiple columns is disabled.
   * @default false
   */
  disableMultipleColumnsSorting?: boolean;
  /**
   * If `true`, the selection on click on a row or cell is disabled.
   * @default false
   */
  disableSelectionOnClick?: boolean;
  /**
   * Set the edit rows model of the grid.
   */
  editRowsModel?: GridEditRowsModel;
  /**
   * Callback fired when the EditRowModel changes.
   * @param {GridEditRowsModel} editRowsModel With all properties from [[GridEditRowsModel]].
   */
  onEditRowsModelChange?: (editRowsModel: GridEditRowsModel) => void;
  /**
   * Filtering can be processed on the server or client-side.
   * Set it to 'server' if you would like to handle filtering on the server-side.
   * @default "client"
   */
  filterMode?: GridFeatureMode;
  /**
   * Set the filter model of the grid.
   */
  filterModel?: GridFilterModel;
  /**
   * Function that applies CSS classes dynamically on cells.
   */
  getCellClassName?: (params: GridCellParams) => string;
  /**
   * Function that applies CSS classes dynamically on rows.
   */
  getRowClassName?: (params: GridRowParams) => string;
  /**
   * Set the height in pixel of the column headers in the grid.
   * @default 56
   */
  headerHeight: number;
  /**
   * If `true`, the footer component is hidden.
   * @default false
   */
  hideFooter?: boolean;
  /**
   * If `true`, the pagination component in the footer is hidden.
   * @default false
   */
  hideFooterPagination?: boolean;
  /**
   * If `true`, the row count in the footer is hidden.
   * @default false
   */
  hideFooterRowCount?: boolean;
  /**
   * If `true`, the selected row count in the footer is hidden.
   * @default false
   */
  hideFooterSelectedRowCount?: boolean;
  /**
   * Callback fired when a cell is rendered, returns true if the cell is editable.
   */
  isCellEditable?: (params: GridCellParams) => boolean;
  /**
   * Determines if a row can be selected.
   */
  isRowSelectable?: (params: GridRowParams) => boolean;
  /**
   * Set the locale text of the grid.
   * You can find all the translation keys supported in [the source](https://github.com/mui-org/material-ui-x/blob/HEAD/packages/grid/_modules_/grid/constants/localeTextConstants.ts) in the GitHub repository.
   */
  localeText: Partial<GridLocaleText>;
  /**
   * Pass a custom logger in the components that implements the [[Logger]] interface.
   * @default null
   */
  logger: Logger;
  /**
   * Allows to pass the logging level or false to turn off logging.
   * @default debug
   */
  logLevel?: string | false;
  /**
   * Callback fired when the edit cell value changes.
   * @param {GridEditCellPropsParams} params With all properties from [[GridEditCellPropsParams]].
   * @param {React.SyntheticEvent} event The event that caused this prop to be called.
   */
  onEditCellPropsChange?: (params: GridEditCellPropsParams, event?: React.SyntheticEvent) => void;
  /**
   * Callback fired when the cell changes are committed.
   * @param {GridEditCellPropsParams} params With all properties from [[GridEditCellPropsParams]].
   * @param {React.SyntheticEvent} event The event that caused this prop to be called.
   */
  onCellEditCommit?: (params: GridEditCellPropsParams, event?: React.SyntheticEvent) => void;
  /**
   * Callback fired when an exception is thrown in the grid, or when the `showError` API method is called.
   */
  onError?: (args: any) => void;
  /**
   * Callback fired when the active element leaves a cell.
   * @param param With all properties from [[GridCellParams]].
   * @param event [[React.FocusEvent]].
   */
  onCellBlur?: (params: GridCellParams, event: React.FocusEvent) => void;
  /**
   * Callback fired when a click event comes from a cell element.
   * @param param With all properties from [[GridCellParams]].
   * @param event [[React.MouseEvent]].
   */
  onCellClick?: (params: GridCellParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a double click event comes from a cell element.
   * @param param With all properties from [[CellParams]].
   * @param event [[React.MouseEvent]].
   */
  onCellDoubleClick?: (params: GridCellParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a cell loses focus.
   * @param param With all properties from [[GridCellParams]].
   * @param event [[Event]].
   */
  onCellFocusOut?: (params: GridCellParams, event?: MuiEvent<MouseEvent>) => void;
  /**
   * Callback fired when a keydown event comes from a cell element.
   * @param param With all properties from [[GridCellParams]].
   * @param event [[React.KeyboardEvent]].
   */
  onCellKeyDown?: (params: GridCellParams, event: React.KeyboardEvent) => void;
  /**
   * Callback fired when a mouseover event comes from a cell element.
   * @param param With all properties from [[GridCellParams]].
   * @param event [[React.MouseEvent]].
   */
  onCellOver?: (params: GridCellParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouseout event comes from a cell element.
   * @param param With all properties from [[GridCellParams]].
   * @param event [[React.MouseEvent]].
   */
  onCellOut?: (params: GridCellParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouse enter event comes from a cell element.
   * @param param With all properties from [[GridCellParams]].
   * @param event [[React.MouseEvent]].
   */
  onCellEnter?: (params: GridCellParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouse leave event comes from a cell element.
   * @param param With all properties from [[GridCellParams]].
   * @param event [[React.MouseEvent]].
   */
  onCellLeave?: (params: GridCellParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when the cell mode changed.
   * @param handler
   */
  onCellModeChange?: (params: GridCellModeChangeParams) => void;
  /**
   * Callback fired when the cell value changed.
   * @param handler
   */
  onCellValueChange?: (params: GridEditCellValueParams) => void;
  /**
   * Callback fired when a click event comes from a column header element.
   * @param param With all properties from [[GridColumnHeaderParams]].
   * @param event [[React.MouseEvent]].
   */
  onColumnHeaderClick?: (param: GridColumnHeaderParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a double click event comes from a column header element.
   * @param param With all properties from [[GridColumnHeaderParams]].
   * @param event [[React.MouseEvent]].
   */
  onColumnHeaderDoubleClick?: (param: GridColumnHeaderParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouseover event comes from a column header element.
   * @param param With all properties from [[GridColumnHeaderParams]].
   * @param event [[React.MouseEvent]].
   */
  onColumnHeaderOver?: (param: GridColumnHeaderParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouseout event comes from a column header element.
   * @param param With all properties from [[GridColumnHeaderParams]].
   * @param event [[React.MouseEvent]].
   */
  onColumnHeaderOut?: (param: GridColumnHeaderParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouse enter event comes from a column header element.
   * @param param With all properties from [[GridColumnHeaderParams]].
   * @param event [[React.MouseEvent]].
   */
  onColumnHeaderEnter?: (param: GridColumnHeaderParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouse leave event comes from a column header element.
   * @param param With all properties from [[GridColumnHeaderParams]].
   * @param event [[React.MouseEvent]].
   */
  onColumnHeaderLeave?: (param: GridColumnHeaderParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a column is reordered.
   * @param param With all properties from [[GridColumnHeaderParams]].
   */
  onColumnOrderChange?: (param: GridColumnOrderChangeParams) => void;
  /**
   * Callback fired while a column is being resized.
   * @param param With all properties from [[GridColumnResizeParams]].
   */
  onColumnResize?: (param: GridColumnResizeParams) => void;
  /**
   * Callback fired when the width of a column is changed.
   * @param param With all properties from [[GridColumnResizeParams]].
   */
  onColumnWidthChange?: (param: GridColumnResizeParams) => void;
  /**
   * Callback fired when a column visibility changes.
   * @param param With all properties from [[GridColumnVisibilityChangeParams]].
   */
  onColumnVisibilityChange?: (param: GridColumnVisibilityChangeParams) => void;
  /**
   * Callback fired when the Filter model changes before the filters are applied.
   * @param model With all properties from [[GridFilterModel]].
   */
  onFilterModelChange?: (model: GridFilterModel) => void;
  /**
   * Callback fired when the current page has changed.
   * @param param With all properties from [[GridPageChangeParams]].
   */
  onPageChange?: (param: GridPageChangeParams) => void;
  /**
   * Callback fired when the page size has changed.
   * @param param With all properties from [[GridPageChangeParams]].
   */
  onPageSizeChange?: (param: GridPageChangeParams) => void;
  /**
   * Callback fired when a click event comes from a row container element.
   * @param param With all properties from [[GridRowParams]].
   * @param event [[React.MouseEvent]].
   */
  onRowClick?: (param: GridRowParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when scrolling to the bottom of the grid viewport.
   * @param param
   */
  onRowsScrollEnd?: (params: GridRowScrollEndParams) => void;
  /**
   * Callback fired when a double click event comes from a row container element.
   * @param param With all properties from [[RowParams]].
   * @param event [[React.MouseEvent]].
   */
  onRowDoubleClick?: (param: GridRowParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouseover event comes from a row container element.
   * @param param With all properties from [[GridRowParams]].
   * @param event [[React.MouseEvent]].
   */
  onRowOver?: (param: GridRowParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouseout event comes from a row container element.
   * @param param With all properties from [[GridRowParams]].
   * @param event [[React.MouseEvent]].
   */
  onRowOut?: (param: GridRowParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouse enter event comes from a row container element.
   * @param param With all properties from [[GridRowParams]].
   * @param event [[React.MouseEvent]].
   */
  onRowEnter?: (param: GridRowParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouse leave event comes from a row container element.
   * @param param With all properties from [[GridRowParams]].
   * @param event [[React.MouseEvent]].
   */
  onRowLeave?: (param: GridRowParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when the grid is resized.
   * @param param With all properties from [[GridResizeParams]].
   */
  onResize?: (param: GridResizeParams) => void;
  /**
   * Callback fired when the selection state of one or multiple rows changes.
   * @param selectionModel With all the row ids [[GridSelectionModel]].
   */
  onSelectionModelChange?: (selectionModel: GridSelectionModel) => void;
  /**
   * Callback fired when the sort model changes before a column is sorted.
   * @param param With all properties from [[GridSortModel]].
   */
  onSortModelChange?: (model: GridSortModel) => void;
  /**
   * Callback fired when the state of the grid is updated.
   */
  onStateChange?: (params: any) => void;
  /**
   * Set the current page.
   * @default 1
   */
  page?: number;
  /**
   * Set the number of rows in one page.
   * @default 100
   */
  pageSize?: number;
  /**
   * If `true`, pagination is enabled.
   * @default false
   */
  pagination?: boolean;
  /**
   * Pagination can be processed on the server or client-side.
   * Set it to 'client' if you would like to handle the pagination on the client-side.
   * Set it to 'server' if you would like to handle the pagination on the server-side.
   */
  paginationMode?: GridFeatureMode;
  /**
   * Set the height in pixel of a row in the grid.
   * @default 52
   */
  rowHeight: number;
  /**
   * Select the pageSize dynamically using the component UI.
   * @default [25, 50, 100]
   */
  rowsPerPageOptions?: number[];
  /**
   * Set the total number of rows, if it is different than the length of the value `rows` prop.
   */
  rowCount?: number;
  /**
   * Override the height/width of the grid inner scrollbar.
   */
  scrollbarSize?: number;
  /**
   * Set the area at the bottom of the grid viewport where onRowsScrollEnd is called.
   */
  scrollEndThreshold: number;
  /**
   * Set the selection model of the grid.
   */
  selectionModel?: GridSelectionModel;
  /**
   * If `true`, the right border of the cells are displayed.
   * @default false
   */
  showCellRightBorder?: boolean;
  /**
   * If `true`, the right border of the column headers are displayed.
   * @default false
   */
  showColumnRightBorder?: boolean;
  /**
   * The order of the sorting sequence.
   * @default ['asc', 'desc', null]
   */
  sortingOrder: GridSortDirection[];
  /**
   * Sorting can be processed on the server or client-side.
   * Set it to 'client' if you would like to handle sorting on the client-side.
   * Set it to 'server' if you would like to handle sorting on the server-side.
   */
  sortingMode?: GridFeatureMode;
  /**
   * Set the sort model of the grid.
   */
  sortModel?: GridSortModel;
}

/**
 * The default [[GridOptions]] object that will be used to merge with the 'options' passed in the react component prop.
 */
export const DEFAULT_GRID_OPTIONS: GridOptions = {
  columnBuffer: 2,
  columnTypes: getGridDefaultColumnTypes(),
  density: GridDensityTypes.Standard,
  filterMode: GridFeatureModeConstant.client,
  headerHeight: 56,
  localeText: GRID_DEFAULT_LOCALE_TEXT,
  pageSize: 100,
  paginationMode: GridFeatureModeConstant.client,
  rowHeight: 52,
  rowsPerPageOptions: [25, 50, 100],
  scrollEndThreshold: 80,
  sortingMode: GridFeatureModeConstant.client,
  sortingOrder: ['asc', 'desc', null],
  logger: console,
  logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'warn',
};
