import { getInitialGridColumnsState, GridInternalColumns } from '../../../models/colDef/gridColDef';
import {
  GridContainerProps,
  GridScrollBarState,
  GridViewportSizeState,
} from '../../../models/gridContainerProps';
import { GridEditRowsModel } from '../../../models/gridEditRowModel';
import { DEFAULT_GRID_OPTIONS, GridOptions } from '../../../models/gridOptions';
import { GridColumnMenuState } from '../columnMenu/columnMenuState';
import {
  GridColumnReorderState,
  getInitialGridColumnReorderState,
} from '../columnReorder/columnReorderState';
import {
  getInitialGridColumnResizeState,
  GridColumnResizeState,
} from '../columnResize/columnResizeState';
import { GridGridDensity, getInitialGridDensityState } from '../density/densityState';
import { GridFilterModelState, getInitialGridFilterState } from '../filter/gridFilterModelState';
import {
  getInitialVisibleGridRowsState,
  VisibleGridRowsState,
} from '../filter/visibleGridRowsState';
import { GridFocusState, GridTabIndexState } from '../focus/gridFocusState';
import { GridPreferencePanelState } from '../preferencesPanel/gridPreferencePanelState';
import { getInitialGridRowState, InternalGridRowsState } from '../rows/gridRowsState';
import { GridSelectionState } from '../selection/gridSelectionState';
import { getInitialGridSortingState, GridSortingState } from '../sorting/gridSortingState';
import {
  getInitialGridRenderingState,
  InternalRenderingState,
} from '../virtualization/renderingState';
import { GridPaginationState } from '../pagination/gridPaginationState';

export interface GridState {
  rows: InternalGridRowsState;
  editRows: GridEditRowsModel;
  pagination: GridPaginationState;
  options: GridOptions;
  isScrolling: boolean;
  columns: GridInternalColumns;
  columnReorder: GridColumnReorderState;
  columnResize: GridColumnResizeState;
  columnMenu: GridColumnMenuState;
  rendering: InternalRenderingState;
  containerSizes: GridContainerProps | null;
  viewportSizes: GridViewportSizeState;
  scrollBar: GridScrollBarState;
  sorting: GridSortingState;
  focus: GridFocusState;
  tabIndex: GridTabIndexState;
  selection: GridSelectionState;
  filter: GridFilterModelState;
  visibleRows: VisibleGridRowsState;
  preferencePanel: GridPreferencePanelState;
  density: GridGridDensity;
  error?: any;
}

export const getInitialGridState = (): GridState => ({
  rows: getInitialGridRowState(),
  editRows: {},
  pagination: {
    page: 0,
    pageCount: 0,
    rowCount: 0,
    pageSize: 100,
  },
  options: DEFAULT_GRID_OPTIONS,
  isScrolling: false,
  columns: getInitialGridColumnsState(),
  columnReorder: getInitialGridColumnReorderState(),
  columnResize: getInitialGridColumnResizeState(),
  rendering: getInitialGridRenderingState(),
  containerSizes: null,
  scrollBar: { hasScrollX: false, hasScrollY: false, scrollBarSize: { x: 0, y: 0 } },
  viewportSizes: { width: 0, height: 1 },
  sorting: getInitialGridSortingState(),
  focus: { cell: null, columnHeader: null },
  tabIndex: { cell: null, columnHeader: null },
  selection: [],
  filter: getInitialGridFilterState(),
  columnMenu: { open: false },
  preferencePanel: { open: false },
  visibleRows: getInitialVisibleGridRowsState(),
  density: getInitialGridDensityState(),
});
