// Web standard events

/**
 * Fired when the grid is resized. Called with a [[GridResizeParams]] object.
 * @event
 */
export const GRID_RESIZE = 'resize';
/**
 * Fired when the grid is resized with a debounced time of 60ms. Called with a [[GridResizeParams]] object.
 * @event
 */
export const GRID_DEBOUNCED_RESIZE = 'debouncedResize';

/**
 * @ignore - do not document.
 */
export const GRID_SCROLL = 'scroll';

/**
 * @ignore - do not document.
 */
export const GRID_KEYDOWN = 'keydown';

// GRID events

/**
 * Fired when an exception is thrown in the grid.
 * @event
 */
export const GRID_COMPONENT_ERROR = 'componentError';

/**
 * Fired when the grid is unmounted.
 * @event
 */
export const GRID_UNMOUNT = 'unmount';

/**
 * Fired when the mode of a cell changes. Called with a [[GridCellModeChangeParams]] object.
 * @event
 */
export const GRID_CELL_MODE_CHANGE = 'cellModeChange';

/**
 * Fired when a cell is clicked. Called with a [[GridCellParams]] object.
 * @event
 */
export const GRID_CELL_CLICK = 'cellClick';

/**
 * Fired when a cell is double-clicked. Called with a [[GridCellParams]] object.
 * @event
 */
export const GRID_CELL_DOUBLE_CLICK = 'cellDoubleClick';

/**
 * Fired when a cell is right-clicked. Called with a [[GridCellParams]] object.
 * @event
 */
export const GRID_CELL_CONTEXT_MENU = 'cellContextMenu';

/**
 * Fired when a `mousedown` event happens in a cell. Called with a [[GridCellParams]] object.
 * @event
 */
export const GRID_CELL_MOUSE_DOWN = 'cellMouseDown';

/**
 * Fired when a `mouseup` event happens in a cell. Called with a [[GridCellParams]] object.
 * @event
 */
export const GRID_CELL_MOUSE_UP = 'cellMouseUp';

/**
 * Fired when a `mouseover` event happens in a cell. Called with a [[GridCellParams]] object.
 * @event
 */
export const GRID_CELL_OVER = 'cellOver';

/**
 * Fired when a `mouseout` event happens in a cell. Called with a [[GridCellParams]] object.
 * @event
 */
export const GRID_CELL_OUT = 'cellOut';

/**
 * Fired when a `mouseenter` event happens in a cell. Called with a [[GridCellParams]] object.
 * @event
 */
export const GRID_CELL_ENTER = 'cellEnter';

/**
 * Fired when a `mouseleave` event happens in a cell. Called with a [[GridCellParams]] object.
 * @event
 */
export const GRID_CELL_LEAVE = 'cellLeave';

/**
 * Fired when a `keydown` event happens in a cell. Called with a [[GridCellParams]] object.
 * @event
 */
export const GRID_CELL_KEY_DOWN = 'cellKeyDown';

/**
 * Fired when the `blur` event of a cell is triggered. Called with a [[GridCellParams]] object.
 * @event
 */
export const GRID_CELL_BLUR = 'cellBlur';

/**
 * Fired when a cell gains focus. Called with a [[GridCellParams]] object.
 * @event
 */
export const GRID_CELL_FOCUS = 'cellFocus';

/**
 * Fired when a cell loses focus. Called with a [[GridCellParams]] object.
 * @event
 */
export const GRID_CELL_FOCUS_OUT = 'cellFocusOut';

/**
 * Fired when the user starts dragging a cell. It's mapped to the `dragstart` DOM event.
 * Called with a [[GridCellParams]] object.
 * @ignore - do not document.
 * @event
 */
export const GRID_CELL_DRAG_START = 'cellDragStart';

/**
 * Fired when the dragged cell enters a valid drop target. It's mapped to the `dragend` DOM event.
 * Called with a [[GridCellParams]] object.
 * @ignore - do not document.
 * @event
 */
export const GRID_CELL_DRAG_ENTER = 'cellDragEnter';

/**
 * Fired while an element or text selection is dragged over the cell.
 * It's mapped to the `dragover` DOM event.
 * Called with a [[GridCellParams]] object.
 * @ignore - do not document.
 * @event
 */
export const GRID_CELL_DRAG_OVER = 'cellDragOver';

/**
 * Fired when the dragging of a cell ends. Called with a [[GridCellParams]] object.
 * @ignore - do not document.
 * @event
 */
export const GRID_CELL_DRAG_END = 'cellDragEnd';

/**
 * Fired when the props of the edit input changes. Called with a [[GridEditCellPropsParams]] object.
 * @event
 */
export const GRID_CELL_EDIT_PROPS_CHANGE = 'cellEditPropsChange';

/**
 * Fired when the props of the edit input are committed. Called with a [[GridEditCellPropsParams]] object.
 * @event
 */
export const GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED = 'cellEditPropsChangeCommitted';

/**
 * Fired when the value of a cell changes. Called with a [[GridEditCellValueParams]] object.
 * @event
 */
export const GRID_CELL_VALUE_CHANGE = 'cellValueChange';

/**
 * Fired when the cell turns to edit mode. Called with a [[GridCellParams]] object.
 * @event
 */
export const GRID_CELL_EDIT_ENTER = 'cellEditEnter';

/**
 * Fired when the cell turns back to view mode. Called with a [[GridCellParams]] object.
 * @event
 */
export const GRID_CELL_EDIT_EXIT = 'cellEditExit';

/**
 * Fired when a [navigation key](/components/data-grid/accessibility#keyboard-navigation) is pressed in a cell.
 * Called with a [[GridCellParams]] object.
 * @ignore - do not document.
 * @event
 */
export const GRID_CELL_NAVIGATION_KEY_DOWN = 'cellNavigationKeyDown';

/**
 * Fired when a row is clicked. Called with a [[GridRowParams]] object.
 * @event
 */
export const GRID_ROW_CLICK = 'rowClick';

/**
 * Fired when a row is double-clicked. Called with a [[GridRowParams]] object.
 * @event
 */
export const GRID_ROW_DOUBLE_CLICK = 'rowDoubleClick';

/**
 * Fired when a row is right-clicked. Called with a [[GridRowParams]] object.
 * @event
 */
export const GRID_ROW_CONTEXT_MENU = 'rowContextMenu';

/**
 * Fired when a `mouseover` event happens in a row.  Called with a [[GridRowParams]] object.
 * @event
 */
export const GRID_ROW_OVER = 'rowOver';

/**
 * Fired when a `mouseout` event happens in a row.  Called with a [[GridRowParams]] object.
 * @event
 */
export const GRID_ROW_OUT = 'rowOut';

/**
 * Fired when a `mouseenter` event happens in a row.  Called with a [[GridRowParams]] object.
 * @event
 */
export const GRID_ROW_ENTER = 'rowEnter';

/**
 * Fired when a `mouseleave` event happens in a row.  Called with a [[GridRowParams]] object.
 * @event
 */
export const GRID_ROW_LEAVE = 'rowLeave';

/**
 * Fired when the row editing model changes. Called with a [[GridEditRowModelParams]] object.
 * @event
 */
export const GRID_ROW_EDIT_MODEL_CHANGE = 'editRowModelChange';

/**
 * Fired when a column header loses focus. Called with a [[GridColumnHeaderParams]] object.
 * @ignore - do not document.
 * @event
 */
export const GRID_COLUMN_HEADER_BLUR = 'columnHeaderBlur';

/**
 * Fired when a column header gains focus. Called with a [[GridColumnHeaderParams]] object.
 * @ignore - do not document.
 * @event
 */
export const GRID_COLUMN_HEADER_FOCUS = 'columnHeaderFocus';

/**
 * Fired when a [navigation key](/components/data-grid/accessibility#keyboard-navigation) is pressed in a column header.
 * Called with a [[GridColumnHeaderParams]] object.
 * @ignore - do not document.
 * @event
 */
export const GRID_COLUMN_HEADER_NAVIGATION_KEY_DOWN = 'columnHeaderNavigationKeyDown';

/**
 * Fired when a key is pressed in a column header. It's mapped do the `keydown` DOM event.
 * Called with a [[GridColumnHeaderParams]] object.
 * @event
 */
export const GRID_COLUMN_HEADER_KEY_DOWN = 'columnHeaderKeyDown';

/**
 * Fired when a column header is clicked. Called with a [[GridColumnHeaderParams]] object.
 * @event
 */
export const GRID_COLUMN_HEADER_CLICK = 'columnHeaderClick';

/**
 * Fired when a column header is double-clicked. Called with a [[GridColumnHeaderParams]] object.
 * @event
 */
export const GRID_COLUMN_HEADER_DOUBLE_CLICK = 'columnHeaderDoubleClick';

/**
 * Fired when a `mouseover` event happens in a column header. Called with a [[GridColumnHeaderParams]] object.
 * @ignore - do not document.
 * @event
 */
export const GRID_COLUMN_HEADER_OVER = 'columnHeaderOver';

/**
 * Fired when a `mouseout` event happens in a column header. Called with a [[GridColumnHeaderParams]] object.
 * @ignore - do not document.
 * @event
 */
export const GRID_COLUMN_HEADER_OUT = 'columnHeaderOut';

/**
 * Fired when a `mouseenter` event happens in a column header. Called with a [[GridColumnHeaderParams]] object.
 * @ignore - do not document.
 * @event
 */
export const GRID_COLUMN_HEADER_ENTER = 'columnHeaderEnter';

/**
 * Fired when a `mouseleave` event happens in a column header. Called with a [[GridColumnHeaderParams]] object.
 * @ignore - do not document.*
 * @event
 */
export const GRID_COLUMN_HEADER_LEAVE = 'columnHeaderLeave';

/**
 * Fired when the user starts dragging a column header. It's mapped to the `dragstart` DOM event.
 * Called with a [[GridColumnHeaderParams]] object.
 * @ignore - do not document.
 * @event
 */
export const GRID_COLUMN_HEADER_DRAG_START = 'columnHeaderDragStart';

/**
 * Fired while an element or text selection is dragged over the column header.
 * It's mapped to the `dragover` DOM event.
 * Called with a [[GridColumnHeaderParams]] object.
 * @ignore - do not document.
 * @event
 */
export const GRID_COLUMN_HEADER_DRAG_OVER = 'columnHeaderDragOver';

/**
 * Fired when the dragged column header enters a valid drop target.
 * It's mapped to the `dragend` DOM event.
 * Called with a [[GridColumnHeaderParams]] object.
 * @ignore - do not document.
 * @event
 */
export const GRID_COLUMN_HEADER_DRAG_ENTER = 'columnHeaderDragEnter';

/**
 * Fired when the dragging of a column header ends. Called with a [[GridColumnHeaderParams]] object.
 * @ignore - do not document.
 * @event
 */
export const GRID_COLUMN_HEADER_DRAG_END = 'columnHeaderDragEnd';

/**
 * Fired when the selection state of one or multiple rows changes.
 * Called with a [[GridSelectionModelChangeParams]] object.
 * @event
 */
export const GRID_SELECTION_CHANGE = 'selectionChange';

/**
 * Fired when the current page change. Called with a [[GridPageChangeParams]] object.
 * @event
 */
export const GRID_PAGE_CHANGE = 'pageChange';

/**
 * Fired when the page size change. Called with a [[GridPageChangeParams]] object.
 * @event
 */
export const GRID_PAGE_SIZE_CHANGE = 'pageSizeChange';

/**
 * Fired during the scroll of the grid viewport. Called with a [[GridScrollParams]] object.
 * @event
 */
export const GRID_ROWS_SCROLL = 'rowsScroll';

/**
 * Fired when scrolling to the bottom of the grid viewport. Called with a [[GridRowScrollEndParams]] object.
 * @event
 */
export const GRID_ROWS_SCROLL_END = 'rowsScrollEnd';

/**
 * Fired when a `mousedown` DOM event happens in the column header separator.
 * Called with a [[GridColumnHeaderParams]] object.
 * @ignore - do not document.
 * @event
 */
export const GRID_COLUMN_SEPARATOR_MOUSE_DOWN = 'columnSeparatorMouseDown';

/**
 * Fired during the resizing of a column. Called with a [[GridColumnResizeParams]] object.
 * @event
 */
export const GRID_COLUMN_RESIZE = 'columnResize';

/**
 * Fired when the width of a column is changed. Called with a [[GridColumnResizeParams]] object.
 * @event
 */
export const GRID_COLUMN_WIDTH_CHANGE = 'columnWidthChange';

/**
 * Fired when the user starts resizing a column. Called with an object `{ field: string }`.
 * @event
 */
export const GRID_COLUMN_RESIZE_START = 'columnResizeStart';

/**
 * Fired when the user stops resizing a column. Called with an object `{ field: string }`.
 * @event
 */
export const GRID_COLUMN_RESIZE_STOP = 'columnResizeStop';

/**
 * Fired when the user ends resizing a column.
 * @event
 */
export const GRID_COLUMN_ORDER_CHANGE = 'columnOrderChange';

/**
 * Fired when the rows are updated.
 * @ignore - do not document.
 * @event
 */
export const GRID_ROWS_UPDATE = 'rowsUpdate';

/**
 * Fired when the rows are updated.
 * @ignore - do not document.
 * @event
 */
export const GRID_ROWS_SET = 'rowsSet';

/**
 * Implementation detail.
 * Fired to reset the sortedRow when the set of rows changes.
 * It's important as the rendered rows are coming from the sortedRow
 * @ignore - do not document.
 * @event
 */
export const GRID_ROWS_CLEAR = 'rowsClear';

/**
 * Fired when the columns state is changed.
 * Called with an array of strings corresponding to the field names.
 * @event
 */
export const GRID_COLUMNS_CHANGE = 'columnsChange';

/**
 * Fired when the sort model changes.
 * Called with a [[GridSortModelParams]] object.
 * @event
 */
export const GRID_SORT_MODEL_CHANGE = 'sortModelChange';

/**
 * Fired when the filter model changes.
 * Called with a [[GridFilterModelParams]] object.
 * @event
 */
export const GRID_FILTER_MODEL_CHANGE = 'filterModelChange';

/**
 * Fired when the state of the grid is updated. Called with a [[GridStateChangeParams]] object.
 * @event
 */
export const GRID_STATE_CHANGE = 'stateChange';

/**
 * Fired when a column visibility changes. Called with a [[GridColumnVisibilityChangeParams]] object.
 * @event
 */
export const GRID_COLUMN_VISIBILITY_CHANGE = 'columnVisibilityChange';
