# GridApi Interface

<p class="description">The full grid API.</p>

## Import

```js
import { GridApi } from '@material-ui/x-grid';
// or
import { GridApi } from '@material-ui/data-grid';
```

## Properties

| Name                                                                                            | Type                                                                                                                                                                                     | Default | Description                                                                                                        |
| :---------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ | :----------------------------------------------------------------------------------------------------------------- |
| <span class="prop-name">columnHeadersElementRef</span>                                          | <span class="prop-type">RefObject&lt;HTMLDivElement&gt;</span>                                                                                                                           |         | The react ref of the grid column container div element.                                                            |
| <span class="prop-name required">events<abbr title="required">\*</abbr></span>                  | <span class="prop-type">{}</span>                                                                                                                                                        |         |                                                                                                                    |
| <span class="prop-name required">isInitialised<abbr title="required">\*</abbr></span>           | <span class="prop-type">boolean</span>                                                                                                                                                   |         | Property that comes true when the grid has its EventEmitter initialised.                                           |
| <span class="prop-name required">maxListeners<abbr title="required">\*</abbr></span>            | <span class="prop-type">number</span>                                                                                                                                                    |         |                                                                                                                    |
| <span class="prop-name required">publishEvent<abbr title="required">\*</abbr></span>            | <span class="prop-type">(name: string, ...args: any[]) =&gt; void</span>                                                                                                                 |         | Allows to emit an event.                                                                                           |
| <span class="prop-name">rootElementRef</span>                                                   | <span class="prop-type">RefObject&lt;HTMLDivElement&gt;</span>                                                                                                                           |         | The react ref of the grid root container div element.                                                              |
| <span class="prop-name required">showError<abbr title="required">\*</abbr></span>               | <span class="prop-type">(props: any) =&gt; void</span>                                                                                                                                   |         | Display the error overlay component.                                                                               |
| <span class="prop-name required">subscribeEvent<abbr title="required">\*</abbr></span>          | <span class="prop-type">(event: string, handler: (params: any, event?: SyntheticEvent&lt;Element, Event&gt;) =&gt; void, options?: GridSubscribeEventOptions) =&gt; () =&gt; void</span> |         | Allows to register a handler for an event.                                                                         |
| <span class="prop-name required">warnOnce<abbr title="required">\*</abbr></span>                | <span class="prop-type">boolean</span>                                                                                                                                                   |         |                                                                                                                    |
| <span class="prop-name required">components<abbr title="required">\*</abbr></span>              | <span class="prop-type">GridApiRefComponentsProperty</span>                                                                                                                              |         | The set of overridable components used in the grid.                                                                |
| <span class="prop-name">componentsProps</span>                                                  | <span class="prop-type">GridSlotsComponentsProps</span>                                                                                                                                  |         | Overrideable components props dynamically passed to the component at rendering.                                    |
| <span class="prop-name required">forceUpdate<abbr title="required">\*</abbr></span>             | <span class="prop-type">Dispatch&lt;any&gt;</span>                                                                                                                                       |         | Allows forcing the grid to rerender after a state update.                                                          |
| <span class="prop-name required">getState<abbr title="required">\*</abbr></span>                | <span class="prop-type">(stateId?: string) =&gt; T</span>                                                                                                                                |         | Allows to get the whole state of the grid if stateId is null or to get a part of the state if stateId has a value. |
| <span class="prop-name required">setState<abbr title="required">\*</abbr></span>                | <span class="prop-type">(state: GridState \| (previousState: GridState) =&gt; GridState) =&gt; void</span>                                                                               |         | Allows to set/reset the whole state of the grid.                                                                   |
| <span class="prop-name required">state<abbr title="required">\*</abbr></span>                   | <span class="prop-type">GridState</span>                                                                                                                                                 |         | Property that contains the whole state of the grid.                                                                |
| <span class="prop-name required">setDensity<abbr title="required">\*</abbr></span>              | <span class="prop-type">(size: GridDensity, headerHeight?: any, rowHeight?: any) =&gt; void</span>                                                                                       |         | Set density of the grid.                                                                                           |
| <span class="prop-name required">resize<abbr title="required">\*</abbr></span>                  | <span class="prop-type">() =&gt; void</span>                                                                                                                                             |         | Trigger a resize of the component, and recalculation of width and height.                                          |
| <span class="prop-name required">getAllRowIds<abbr title="required">\*</abbr></span>            | <span class="prop-type">() =&gt; GridRowId[]</span>                                                                                                                                      |         | Return the list of row Ids.                                                                                        |
| <span class="prop-name required">getRowFromId<abbr title="required">\*</abbr></span>            | <span class="prop-type">(id: GridRowId) =&gt; GridRowData</span>                                                                                                                         |         | Get the GridRowModel of a given rowId.                                                                             |
| <span class="prop-name required">getRowIdFromRowIndex<abbr title="required">\*</abbr></span>    | <span class="prop-type">(index: number) =&gt; GridRowId</span>                                                                                                                           |         | Get the GridRowId of a row at a specific position.                                                                 |
| <span class="prop-name required">getRowIndexFromId<abbr title="required">\*</abbr></span>       | <span class="prop-type">(id: GridRowId) =&gt; number</span>                                                                                                                              |         | Get the row index of a row with a given id.                                                                        |
| <span class="prop-name required">getRowModels<abbr title="required">\*</abbr></span>            | <span class="prop-type">() =&gt; Map&lt;GridRowId, GridRowData&gt;</span>                                                                                                                |         | Get the full set of rows as Map&lt;GridRowId, GridRowModel&gt;.                                                    |
| <span class="prop-name required">getRowsCount<abbr title="required">\*</abbr></span>            | <span class="prop-type">() =&gt; number</span>                                                                                                                                           |         | Get the total number of rows in the grid.                                                                          |
| <span class="prop-name required">setRows<abbr title="required">\*</abbr></span>                 | <span class="prop-type">(rows: GridRowData[]) =&gt; void</span>                                                                                                                          |         | Set a new set of Rows.                                                                                             |
| <span class="prop-name required">updateRows<abbr title="required">\*</abbr></span>              | <span class="prop-type">(updates: GridRowModelUpdate&lt;&gt;[]) =&gt; void</span>                                                                                                        |         | Update any properties of the current set of GridRowData[].                                                         |
| <span class="prop-name required">commitCellChange<abbr title="required">\*</abbr></span>        | <span class="prop-type">(params: GridEditCellPropsParams) =&gt; void</span>                                                                                                              |         | Commit the cell value changes to update the cell value.                                                            |
| <span class="prop-name required">getCellMode<abbr title="required">\*</abbr></span>             | <span class="prop-type">(id: GridRowId, field: string) =&gt; GridCellMode</span>                                                                                                         |         | Get the cellMode of a cell.                                                                                        |
| <span class="prop-name required">getEditCellProps<abbr title="required">\*</abbr></span>        | <span class="prop-type">(rowId: GridRowId, field: string) =&gt; GridEditCellProps</span>                                                                                                 |         | Get the edit cell input props.                                                                                     |
| <span class="prop-name required">getEditCellPropsParams<abbr title="required">\*</abbr></span>  | <span class="prop-type">(rowId: GridRowId, field: string) =&gt; GridEditCellPropsParams</span>                                                                                           |         | Get the edit cell input props params passed in handler.                                                            |
| <span class="prop-name required">getEditCellValueParams<abbr title="required">\*</abbr></span>  | <span class="prop-type">(rowId: GridRowId, field: string) =&gt; GridEditCellValueParams</span>                                                                                           |         | Get the edit cell value params.                                                                                    |
| <span class="prop-name required">getEditRowsModel<abbr title="required">\*</abbr></span>        | <span class="prop-type">() =&gt; GridEditRowsModel</span>                                                                                                                                |         | Get the edit rows model of the grid.                                                                               |
| <span class="prop-name required">isCellEditable<abbr title="required">\*</abbr></span>          | <span class="prop-type">(params: GridCellParams) =&gt; boolean</span>                                                                                                                    |         | Returns true if the cell is editable.                                                                              |
| <span class="prop-name required">setCellMode<abbr title="required">\*</abbr></span>             | <span class="prop-type">(id: GridRowId, field: string, mode: GridCellMode) =&gt; void</span>                                                                                             |         | Set the cellMode of a cell.                                                                                        |
| <span class="prop-name required">setCellValue<abbr title="required">\*</abbr></span>            | <span class="prop-type">(params: GridEditCellValueParams) =&gt; void</span>                                                                                                              |         | Set the cell value.                                                                                                |
| <span class="prop-name required">setEditCellProps<abbr title="required">\*</abbr></span>        | <span class="prop-type">(params: GridEditCellPropsParams) =&gt; void</span>                                                                                                              |         | Set the edit cell input props.                                                                                     |
| <span class="prop-name required">setEditRowsModel<abbr title="required">\*</abbr></span>        | <span class="prop-type">(model: GridEditRowsModel) =&gt; void</span>                                                                                                                     |         | Set the edit rows model of the grid.                                                                               |
| <span class="prop-name required">getCellElement<abbr title="required">\*</abbr></span>          | <span class="prop-type">(id: GridRowId, field: string) =&gt; \| HTMLDivElement</span>                                                                                                    |         | Get the cell DOM element.                                                                                          |
| <span class="prop-name required">getCellParams<abbr title="required">\*</abbr></span>           | <span class="prop-type">(id: GridRowId, field: string) =&gt; GridCellParams</span>                                                                                                       |         | Get the cell params that are passed in events.                                                                     |
| <span class="prop-name required">getCellValue<abbr title="required">\*</abbr></span>            | <span class="prop-type">(id: GridRowId, field: string) =&gt; GridCellValue</span>                                                                                                        |         | Get the cell value of a row and field.                                                                             |
| <span class="prop-name required">getColumnHeaderElement<abbr title="required">\*</abbr></span>  | <span class="prop-type">(field: string) =&gt; \| HTMLDivElement</span>                                                                                                                   |         | Get the column header DOM element.                                                                                 |
| <span class="prop-name required">getColumnHeaderParams<abbr title="required">\*</abbr></span>   | <span class="prop-type">(field: string) =&gt; GridColumnHeaderParams</span>                                                                                                              |         | Get the header params that are passed in events.                                                                   |
| <span class="prop-name required">getRowElement<abbr title="required">\*</abbr></span>           | <span class="prop-type">(id: GridRowId) =&gt; \| HTMLDivElement</span>                                                                                                                   |         | Get the row DOM element.                                                                                           |
| <span class="prop-name required">getRowParams<abbr title="required">\*</abbr></span>            | <span class="prop-type">(id: GridRowId) =&gt; GridRowParams</span>                                                                                                                       |         | Get the row params that are passed in events.                                                                      |
| <span class="prop-name required">getAllColumns<abbr title="required">\*</abbr></span>           | <span class="prop-type">() =&gt; GridColumns</span>                                                                                                                                      |         | Get all the GridColumns.                                                                                           |
| <span class="prop-name required">getColumnFromField<abbr title="required">\*</abbr></span>      | <span class="prop-type">(field: string) =&gt; GridColDef</span>                                                                                                                          |         | Retrieve a column from its field.                                                                                  |
| <span class="prop-name required">getColumnIndex<abbr title="required">\*</abbr></span>          | <span class="prop-type">(field: string, useVisibleColumns?: boolean) =&gt; number</span>                                                                                                 |         | Get the index position of the column in the array of [GridColDef](/api/grid-col-def).                              |
| <span class="prop-name required">getColumnPosition<abbr title="required">\*</abbr></span>       | <span class="prop-type">(field: string) =&gt; number</span>                                                                                                                              |         | Get the column left position in pixel relative to the left grid inner border.                                      |
| <span class="prop-name required">getColumnsMeta<abbr title="required">\*</abbr></span>          | <span class="prop-type">() =&gt; GridColumnsMeta</span>                                                                                                                                  |         | Get the columns meta data.                                                                                         |
| <span class="prop-name required">getVisibleColumns<abbr title="required">\*</abbr></span>       | <span class="prop-type">() =&gt; GridColumns</span>                                                                                                                                      |         | Get the currently visible columns.                                                                                 |
| <span class="prop-name required">setColumnIndex<abbr title="required">\*</abbr></span>          | <span class="prop-type">(field: string, targetIndexPosition: number) =&gt; void</span>                                                                                                   |         | Allows to move a column to another position in the column array.                                                   |
| <span class="prop-name required">setColumnWidth<abbr title="required">\*</abbr></span>          | <span class="prop-type">(field: string, width: number) =&gt; void</span>                                                                                                                 |         | Allows to set target column width.                                                                                 |
| <span class="prop-name required">toggleColumn<abbr title="required">\*</abbr></span>            | <span class="prop-type">(field: string, forceHide?: boolean) =&gt; void</span>                                                                                                           |         | Allows to toggle a column.                                                                                         |
| <span class="prop-name required">updateColumn<abbr title="required">\*</abbr></span>            | <span class="prop-type">(col: GridColDef) =&gt; void</span>                                                                                                                              |         | Allows to update a column [GridColDef](/api/grid-col-def) model.                                                   |
| <span class="prop-name required">updateColumns<abbr title="required">\*</abbr></span>           | <span class="prop-type">(cols: GridColDef[], resetColumnState?: boolean) =&gt; void</span>                                                                                               |         | Allows to batch update multiple columns at the same time.                                                          |
| <span class="prop-name required">getSelectedRows<abbr title="required">\*</abbr></span>         | <span class="prop-type">() =&gt; Map&lt;GridRowId, GridRowData&gt;</span>                                                                                                                |         | Get an array of selected rows.                                                                                     |
| <span class="prop-name required">selectRow<abbr title="required">\*</abbr></span>               | <span class="prop-type">(id: GridRowId, isSelected?: boolean, allowMultiple?: boolean) =&gt; void</span>                                                                                 |         | Toggle the row selected state.                                                                                     |
| <span class="prop-name required">selectRows<abbr title="required">\*</abbr></span>              | <span class="prop-type">(ids: GridRowId[], isSelected?: boolean, deselectOtherRows?: boolean) =&gt; void</span>                                                                          |         | Batch toggle rows selected state.                                                                                  |
| <span class="prop-name required">setSelectionModel<abbr title="required">\*</abbr></span>       | <span class="prop-type">(rowIds: GridRowId[]) =&gt; void</span>                                                                                                                          |         | Reset the selected rows to the array of ids passed in parameter                                                    |
| <span class="prop-name required">applySorting<abbr title="required">\*</abbr></span>            | <span class="prop-type">() =&gt; void</span>                                                                                                                                             |         | Apply the current sorting model to the rows.                                                                       |
| <span class="prop-name required">getSortModel<abbr title="required">\*</abbr></span>            | <span class="prop-type">() =&gt; GridSortModel</span>                                                                                                                                    |         | Get the sort model currently applied to the grid.                                                                  |
| <span class="prop-name required">getSortedRowIds<abbr title="required">\*</abbr></span>         | <span class="prop-type">() =&gt; GridRowId[]</span>                                                                                                                                      |         | Get the full set of sorted row ids as GridRowId.                                                                   |
| <span class="prop-name required">getSortedRows<abbr title="required">\*</abbr></span>           | <span class="prop-type">() =&gt; GridRowData[]</span>                                                                                                                                    |         | Get the full set of sorted rows as GridRowModel.                                                                   |
| <span class="prop-name required">setSortModel<abbr title="required">\*</abbr></span>            | <span class="prop-type">(model: GridSortModel) =&gt; void</span>                                                                                                                         |         | Set the sort model and trigger the sorting of rows.                                                                |
| <span class="prop-name required">sortColumn<abbr title="required">\*</abbr></span>              | <span class="prop-type">(column: GridColDef, direction?: GridSortDirection, allowMultipleSorting?: boolean) =&gt; void</span>                                                            |         | Set the sort direction of a column.                                                                                |
| <span class="prop-name required">getContainerPropsState<abbr title="required">\*</abbr></span>  | <span class="prop-type">() =&gt; \| GridContainerProps</span>                                                                                                                            |         | Get the current containerProps.                                                                                    |
| <span class="prop-name required">getRenderContextState<abbr title="required">\*</abbr></span>   | <span class="prop-type">() =&gt; undefined \| Partial&lt;GridRenderContextProps&gt;</span>                                                                                               |         | Get the current renderContext.                                                                                     |
| <span class="prop-name required">getScrollPosition<abbr title="required">\*</abbr></span>       | <span class="prop-type">() =&gt; GridScrollParams</span>                                                                                                                                 |         | Get the current scroll position.                                                                                   |
| <span class="prop-name required">isColumnVisibleInWindow<abbr title="required">\*</abbr></span> | <span class="prop-type">(colIndex: number) =&gt; boolean</span>                                                                                                                          |         | Check if a column at index is currently visible in the viewport.                                                   |
| <span class="prop-name required">scroll<abbr title="required">\*</abbr></span>                  | <span class="prop-type">(params: Partial&lt;GridScrollParams&gt;) =&gt; void</span>                                                                                                      |         | Trigger the grid viewport to scroll to the position in pixel.                                                      |
| <span class="prop-name required">scrollToIndexes<abbr title="required">\*</abbr></span>         | <span class="prop-type">(params: Optional&lt;GridCellIndexCoordinates, &gt;) =&gt; boolean</span>                                                                                        |         | Trigger the grid viewport to scroll to a row of x y indexes.                                                       |
| <span class="prop-name required">updateViewport<abbr title="required">\*</abbr></span>          | <span class="prop-type">(forceRender?: boolean) =&gt; void</span>                                                                                                                        |         | Refresh the viewport cells according to the scroll positions                                                       |
| <span class="prop-name required">setPage<abbr title="required">\*</abbr></span>                 | <span class="prop-type">(page: number) =&gt; void</span>                                                                                                                                 |         | Set the displayed page.                                                                                            |
| <span class="prop-name required">setPageSize<abbr title="required">\*</abbr></span>             | <span class="prop-type">(pageSize: number) =&gt; void</span>                                                                                                                             |         | Set the number of rows in one page.                                                                                |
| <span class="prop-name required">exportDataAsCsv<abbr title="required">\*</abbr></span>         | <span class="prop-type">() =&gt; void</span>                                                                                                                                             |         | Export the grid data as CSV.                                                                                       |
| <span class="prop-name required">getDataAsCsv<abbr title="required">\*</abbr></span>            | <span class="prop-type">() =&gt; string</span>                                                                                                                                           |         | Get the grid data as CSV.                                                                                          |
| <span class="prop-name required">getLocaleText<abbr title="required">\*</abbr></span>           | <span class="prop-type">(key: T) =&gt; </span>                                                                                                                                           |         | Get grid text.                                                                                                     |