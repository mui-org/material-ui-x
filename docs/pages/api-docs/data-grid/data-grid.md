# DataGrid API

<p class="description">The API documentation of the DataGrid React component. Learn more about the props and the CSS customization points.</p>

## Import

```js
import { DataGrid } from '@material-ui/data-grid';
```

## Props


| Name | Type | Default | Description |
|:-----|:-----|:--------|:------------|
| <span class="prop-name required">columns<abbr title="required">*</abbr></span> | <span class="prop-type">GridColumns</span> |   | Set of columns of type 'GridColumns'. |
| <span class="prop-name required">rows<abbr title="required">*</abbr></span> | <span class="prop-type">GridRowsProp</span> |  | Set of rows of type 'GridRowsProp'. |
| <span class="prop-name">aria-label</span> | <span class="prop-type">string</span> |  | The label of the grid. |
| <span class="prop-name">aria-labelledby</span> | <span class="prop-type">string</span> |  | The id of the element containing a label for the grid. |
| <span class="prop-name">autoHeight</span> | <span class="prop-type">boolean</span> | false | If `true`, the grid height is dynamic and follow the number of rows in the grid. |
| <span class="prop-name">autoPageSize</span> | <span class="prop-type">boolean</span> | false | If `true`, the pageSize is calculated according to the container size and the max number of rows to avoid rendering a vertical scroll bar. |
| <span class="prop-name">checkboxSelection</span> | <span class="prop-type">boolean</span> | false | If `true`, the grid get a first column with a checkbox that allows to select rows. |
| <span class="prop-name">classes</span> | <span class="prop-type">GridClasses</span> |   | Override or extend the styles applied to the component. See [CSS API](/api/data-grid/data-grid/#css) below for more details. |
| <span class="prop-name">className</span> | <span class="prop-type">string</span> |   | CSS classname to add on the outer container. |
| <span class="prop-name">columnBuffer</span> | <span class="prop-type">number</span> | 2 | Number of columns rendered outside the grid viewport. |
| <span class="prop-name">columnTypes</span> | <span class="prop-type">GridColumnTypesRecord</span> |   | Extend native column types with your new column types. |
| <span class="prop-name">components</span> | <span class="prop-type">GridSlotsComponent</span> |   | Overrideable components. |
| <span class="prop-name">componentsProps</span> | <span class="prop-type">GridSlotsComponentsProps</span> |   | Overrideable components props dynamically passed to the component at rendering. |
| <span class="prop-name">density</span> | <span class="prop-type">Density</span> | standard | Sets the density of the grid. |
| <span class="prop-name">disableColumnFilter</span> | <span class="prop-type">boolean</span> | false | If `true`, column filters are disabled. |
| <span class="prop-name">disableColumnMenu</span> | <span class="prop-type">boolean</span> | false | If `true`, the column menu is disabled. |
| <span class="prop-name">disableColumnSelector</span> | <span class="prop-type">boolean</span> | false | If `true`, the column selector is disabled. |
| <span class="prop-name">disableDensitySelector</span> | <span class="prop-type">boolean</span> | false | If `true`, the density selector is disabled. |
| <span class="prop-name">disableExtendRowFullWidth</span> | <span class="prop-type">boolean</span> | false | If `true`, rows will not be extended to fill the full width of the grid container. |
| <span class="prop-name">disableSelectionOnClick</span> | <span class="prop-type">boolean</span> | false | If `true`, the selection on click on a row or cell is disabled. |
| <span class="prop-name">error</span> | <span class="prop-type">any</span> |   | An error that will turn the grid into its error state and display the error component. |
| <span class="prop-name">editRowsModel</span> | <span class="prop-type">GridEditRowsModel</span> | undefined  | Set the edit rows model of the grid. |
| <span class="prop-name">filterMode</span> | <span class="prop-type">GridFeatureMode</span> | 'client' | Filtering can be processed on the server or client-side. Set it to `server` if you would like to handle filtering on the server-side. |
| <span class="prop-name">filterModel</span> | <span class="prop-type">GridFilterModel</span> |   | Set the filter model of the grid. |
| <span class="prop-name">getCellClassName</span> | <span class="prop-type">(params: GridCellParams) => string</span> |   | Function that applies CSS classes dynamically on cells. |
| <span class="prop-name">getRowClassName</span> | <span class="prop-type">(params: GridRowParams) => string</span> |   | Function that applies CSS classes dynamically on rows. |
| <span class="prop-name">getRowId</span> | <span class="prop-type">GridRowIdGetter</span> | (row)=> row.id   | A function that allows the grid to retrieve the row id. |
| <span class="prop-name">headerHeight</span> | <span class="prop-type">number</span> | 56 | Set the height in pixel of the column headers in the grid. |
| <span class="prop-name">hideFooter</span> | <span class="prop-type">boolean</span> | false | If `true`, the footer component is hidden. |
| <span class="prop-name">hideFooterPagination</span> | <span class="prop-type">boolean</span> | false | If `true`, the pagination component in the footer is hidden. |
| <span class="prop-name">hideFooterRowCount</span> | <span class="prop-type">boolean</span> | false | If `true`, the row count in the footer is hidden. |
| <span class="prop-name">hideFooterSelectedRowCount</span> | <span class="prop-type">boolean</span> | false | If `true`, the selected row count in the footer is hidden. |
| <span class="prop-name">icons</span> | <span class="prop-type">IconsOptions</span> |   | Set of icons used in the grid. |
| <span class="prop-name">isCellEditable</span> | <span class="prop-type">(params: GridCellParams) => boolean</span> |   | Callback fired when a cell is rendered, returns `true` if the cell is editable. |
| <span class="prop-name">isRowSelectable</span> | <span class="prop-type">(params: GridRowParams) => boolean</span> |   | Determines if a row can be selected. |
| <span class="prop-name">loading</span> | <span class="prop-type">boolean</span> |  false | If `true`, a  loading overlay is displayed. |
| <span class="prop-name">localeText</span> | <span class="prop-type">GridLocaleText</span> |   | Set of text labels used in the grid. You can find all the translation keys supported in [the source](https://github.com/mui-org/material-ui-x/blob/HEAD/packages/grid/_modules_/grid/constants/localeTextConstants.ts) in the GitHub repository. |
| <span class="prop-name">logger</span> | <span class="prop-type">Logger</span> | null | Pass a custom logger in the components that implements the 'Logger' interface. |
| <span class="prop-name">logLevel</span> | <span class="prop-type">string \| false</span> | false | Allows to pass the logging level or false to turn off logging. |
| <span class="prop-name">nonce</span> | <span class="prop-type">string</span> |   | Nonce of the inline styles for [Content Security Policy](https://www.w3.org/TR/2016/REC-CSP2-20161215/#script-src-the-nonce-attribute). |
| <span class="prop-name">onCellBlur</span> | <span class="prop-type">(params: GridCellParams, event: React.FocusEvent) => void</span> |   | Callback fired when the active element leaves a cell. |
| <span class="prop-name">onCellClick</span> | <span class="prop-type">(params: GridCellParams, event: React.MouseEvent) => void</span> |   | Callback fired when a click event comes from a cell element. |
| <span class="prop-name">onCellDoubleClick</span> | <span class="prop-type">(params: GridCellParams, event: React.MouseEvent) => void</span> |   | Callback fired when a double click event comes from a cell element. |
| <span class="prop-name">onCellFocusOut</span> | <span class="prop-type">(params: GridCellParams, event?: MuiEvent<MouseEvent>) => void</span> |   | Callback fired when a cell loses focus. |
| <span class="prop-name">onCellKeyDown</span> | <span class="prop-type">(params: GridCellParams, event: React.KeyboardEvent) => void</span> |   |  Callback fired when a keydown event comes from a cell element. |
| <span class="prop-name">onCellOver</span> | <span class="prop-type">(params: GridCellParams, event: React.MouseEvent) => void</span> |   | Callback fired when a mouse over event comes from a cell element. |
| <span class="prop-name">onCellOut</span> | <span class="prop-type">(params: GridCellParams, event: React.MouseEvent) => void</span> |   | Callback fired when a mouse out comes from a cell element. |
| <span class="prop-name">onCellEnter</span> | <span class="prop-type">(params: GridCellParams, event: React.MouseEvent) => void</span> |   | Callback fired when a mouse enter event comes from a cell element. |
| <span class="prop-name">onCellLeave</span> | <span class="prop-type">(params: GridCellParams, event: React.MouseEvent) => void</span> |   | Callback fired when a mouse leave event comes from a cell element. |
| <span class="prop-name">onCellModeChange</span> | <span class="prop-type">(params: GridCellModeChangeParams) => void |   | Callback fired when the cell mode changed. |
| <span class="prop-name">onColumnHeaderClick</span> | <span class="prop-type">(param: GridColumnHeaderParams, event: React.MouseEvent) => void</span> |   | Callback fired when a click event comes from a column header element. |
| <span class="prop-name">onColumnHeaderDoubleClick</span> | <span class="prop-type">(param: GridColumnHeaderParams, event: React.MouseEvent) => void</span> |   | Callback fired when a double click event comes from a column header element. |
| <span class="prop-name">onColumnHeaderOver</span> | <span class="prop-type">(param: GridColumnHeaderParams, event: React.MouseEvent) => void</span> |   | Callback fired when a mouseover event comes from a column header element. |
| <span class="prop-name">onColumnHeaderOut</span> | <span class="prop-type">(param: GridColumnHeaderParams, event: React.MouseEvent) => void</span> |   | Callback fired when a mouseout event comes from a column header element. |
| <span class="prop-name">onColumnHeaderEnter</span> | <span class="prop-type">(param: GridColumnHeaderParams, event: React.MouseEvent) => void</span> |   | Callback fired when a mouse enter event comes from a column header element. |
| <span class="prop-name">onColumnHeaderLeave</span> | <span class="prop-type">(param: GridColumnHeaderParams, event: React.MouseEvent) => void</span> |   | Callback fired when a mouse leave event comes from a column header element. |
| <span class="prop-name">onColumnOrderChange</span> | <span class="prop-type">(param: GridColumnOrderChangeParams, event: React.MouseEvent) => void</span> |   | Callback fired when a column is reordered. |
| <span class="prop-name">onColumnResize</span> | <span class="prop-type">(param: GridColumnResizeParams) => void</span> |   | Callback fired while a column is being resized. |
| <span class="prop-name">onColumnWidthChange</span> | <span class="prop-type">(param: GridColumnResizeParams) => void</span> |   | Callback fired when the width of a column is changed. |
| <span class="prop-name">onColumnVisibilityChange</span> | <span class="prop-type">(param: GridColumnVisibilityChangeParams) => void</span> |   | Callback fired when a column visibility changes. |
| <span class="prop-name">onError</span> | <span class="prop-type">(args: any) => void</span> |   | Callback fired when an exception is thrown in the grid, or when the `showError` API method is called. |
| <span class="prop-name">onEditCellPropsChange</span> | <span class="prop-type">(params: GridEditCellPropsParams, event: React.SyntheticEvent) => void</span> |   |  Callback fired when the edit cell value changes. |
| <span class="prop-name">onCellEditCommit</span> | <span class="prop-type">(params: GridEditCellPropsParams, event: React.SyntheticEvent) => void</span> |   | Callback fired when the cell changes are going to be committed. |
| <span class="prop-name">onEditRowModelChange</span> | <span class="prop-type">(params: GridEditRowModelParams) => void</span> |   |  Callback fired when the EditRowModel changed. |
| <span class="prop-name">onFilterModelChange</span> | <span class="prop-type">(model: GridFilterModel) => void</span> |   | Callback fired when the Filter model changes before the filters are applied. |
| <span class="prop-name">onPageChange</span> | <span class="prop-type">(page: number) => void</span> |   | Callback fired when the current page has changed. |
| <span class="prop-name">onPageSizeChange</span> | <span class="prop-type">(pageSize: number) => void</span> |   | Callback fired when the page size has changed. |
| <span class="prop-name">onResize</span> | <span class="prop-type">(param: GridResizeParams) => void</span> |   | Callback fired when the grid is being resized. |
| <span class="prop-name">onRowClick</span> | <span class="prop-type">(param: GridRowParams, event: React.MouseEvent) => void</span> |   | Callback fired when a click event comes from a row container element. |
| <span class="prop-name">onRowDoubleClick</span> | <span class="prop-type">(param: GridRowParams, event: React.MouseEvent) => void</span> |   | Callback fired when a double click event comes from a row container element. |
| <span class="prop-name">onRowOver</span> | <span class="prop-type">(param: GridRowParams, event: React.MouseEvent) => void</span> |   | Callback fired when a mouse over comes from a row container element. |
| <span class="prop-name">onRowOut</span> | <span class="prop-type">(param: GridRowParams, event: React.MouseEvent) => void</span> |   | Callback fired when a mouse out comes from a row container element. |
| <span class="prop-name">onRowEnter</span> | <span class="prop-type">(param: GridRowParams, event: React.MouseEvent) => void</span> |   | Callback fired when a mouse enter comes from a row container element. |
| <span class="prop-name">onRowLeave</span> | <span class="prop-type">(param: GridRowParams, event: React.MouseEvent) => void</span> |   | Callback fired when a mouse leave event comes from a row container element. |
| <span class="prop-name">onSelectionModelChange</span> | <span class="prop-type">(model: GridSelectionModel) => void</span> |   | Callback fired when the selection state of one or multiple rows changes. |
| <span class="prop-name">onSortModelChange</span> | <span class="prop-type">(model: GridSortModel) => void</span> |   | Callback fired when the sort model changes before a column is sorted. |
| <span class="prop-name">page</span> | <span class="prop-type">number</span> | 1   |  Set the current page. |
| <span class="prop-name">pageSize</span> | <span class="prop-type">number</span> | 100 | Set the number of rows in one page. |
| <span class="prop-name">paginationMode</span> | <span class="prop-type">GridFeatureMode</span> | 'client' | Pagination can be processed on the server or client-side. Set it to 'client' if you would like to handle the pagination on the client-side. Set it to 'server' if you would like to handle the pagination on the server-side. |
| <span class="prop-name">rowCount</span> | <span class="prop-type">number</span> |   |  Set the total number of rows, if it is different than the length of the value `rows` prop. |
| <span class="prop-name">rowHeight</span> | <span class="prop-type">number</span> | 52 | Set the height in pixel of a row in the grid. |
| <span class="prop-name">rowsPerPageOptions</span> | <span class="prop-type">number[]</span> | [25, 50, 100] | Select the pageSize dynamically using the component UI. |
| <span class="prop-name">scrollbarSize</span> | <span class="prop-type">number</span> | 15 | Set the height/width of the grid inner scrollbar. |
| <span class="prop-name">selectionModel</span> | <span class="prop-type">GridSelectionModel</span> |   | Set the selection model of the grid. |
| <span class="prop-name">showCellRightBorder</span> | <span class="prop-type">boolean</span> | false | If `true`, the right border of the cells are displayed. |
| <span class="prop-name">showColumnRightBorder</span> | <span class="prop-type">boolean</span> | false | If `true`, the right border of the column headers are displayed. |
| <span class="prop-name">sortingMode</span> | <span class="prop-type">GridFeatureMode</span> | 'client' |  Sorting can be processed on the server or client-side. Set it to 'client' if you would like to handle sorting on the client-side. Set it to 'server' if you would like to handle sorting on the server-side. |
| <span class="prop-name">sortingOrder</span> | <span class="prop-type">GridSortDirection[]</span> | ['asc', 'desc', null] | The order of the sorting sequence. |
| <span class="prop-name">sortModel</span> | <span class="prop-type">GridSortModel</span> |   | Set the sort model of the grid. |

The `ref` is forwarded to the root element.

## Slots

Api of the `components` props of type `GridSlotsComponent`

| Name | Type | Default | Description |
|:-----|:-----|:--------|:------------|
| <span class="prop-name">Checkbox</span> | <span class="prop-type">elementType</span> | <span class="prop-type">Checkbox</span> | Checkbox component used in the grid for both header and cells. Default it uses the Material UI core Checkbox component.|
| <span class="prop-name">ColumnMenu</span> | <span class="prop-type">elementType&lt;GridColumnMenuProps></span> | <span class="prop-type">GridColumnMenu</span> | Column menu component rendered by clicking on the 3 dots "kebab" icon in column headers.|
| <span class="prop-name">ColumnsPanel</span> | <span class="prop-type">elementType</span> | <span class="prop-type">ColumnsPanel</span> | GridColumns panel component rendered when clicking the columns button.|
| <span class="prop-name">ErrorOverlay</span> | <span class="prop-type">elementType&lt;ErrorOverlayProps></span> | <span class="prop-type">ErrorOverlay</span> | Error overlay component rendered above the grid when an error is caught.|
| <span class="prop-name">FilterPanel</span> | <span class="prop-type">elementType</span> | <span class="prop-type">FilterPanel</span> | Filter panel component rendered when clicking the filter button.|
| <span class="prop-name">Footer</span> | <span class="prop-type">elementType</span> | <span class="prop-type">GridFooter</span> | Footer component rendered at the bottom of the grid viewport.|
| <span class="prop-name">Toolbar</span> | <span class="prop-type">elementType</span> | <span class="prop-type">GridToolbar</span> | Toolbar component rendered above the grid column header bar.|
| <span class="prop-name">PreferencesPanel</span> | <span class="prop-type">elementType</span> | <span class="prop-type">PreferencesPanel</span> | PreferencesPanel component that renders the ColumnSelector or FilterPanel within a Panel component.|
| <span class="prop-name">LoadingOverlay</span> | <span class="prop-type">elementType</span> | <span class="prop-type">LoadingOverlay</span> | Loading overlay component rendered when the grid is in a loading state.|
| <span class="prop-name">NoResultsOverlay</span> | <span class="prop-type">elementType</span> | <span class="prop-type">NoResultsOverlay </span> | No results overlay component rendered when the grid has no results after filtering.|
| <span class="prop-name">NoRowsOverlay</span> | <span class="prop-type">elementType</span> | <span class="prop-type">NoRowsOverlay</span> | No rows overlay component rendered when the grid has no rows.|
| <span class="prop-name">Pagination</span> | <span class="prop-type">elementType</span> | <span class="prop-type">Pagination</span> | Pagination component rendered in the grid footer by default.|
| <span class="prop-name">Panel</span> | <span class="prop-type">elementType&lt;GridPanelProps></span> | <span class="prop-type">Panel</span> | Panel component wrapping the filters and columns panels. |

### Icons Slots

| Name | Type | Default | Description |
|:-----|:-----|:--------|:------------|
| <span class="prop-name">ColumnMenuIcon</span> | <span class="prop-type">elementType </span> | <span class="prop-type">TripleDotsVerticalIcon</span> | Icon displayed on the side of the column header title to display the filter input component. |
| <span class="prop-name">ColumnFilteredIcon</span> | <span class="prop-type">elementType </span> | <span class="prop-type">FilterAltIcon</span> | Icon displayed on the column header menu to show that a filer has been applied to the column. |
| <span class="prop-name">ColumnSelectorIcon</span> | <span class="prop-type">elementType </span> | <span class="prop-type">ColumnIcon</span> | Icon displayed on the column menu selector tab. |
| <span class="prop-name">ColumnUnsortedIcon</span> | <span class="prop-type">React.ElementType<br>&#124;&nbsp;null </span> | <span class="prop-type">GridColumnUnsortedIcon</span> | Icon displayed on the side of the column header title when unsorted. |
| <span class="prop-name">ColumnSortedAscendingIcon</span> | <span class="prop-type">elementType </span> | <span class="prop-type">ArrowUpwardIcon</span> | Icon displayed on the side of the column header title when sorted in Ascending order. |
| <span class="prop-name">ColumnSortedDescendingIcon</span> | <span class="prop-type">elementType </span> | <span class="prop-type">ArrowDownwardIcon</span> | Icon displayed on the side of the column header title when sorted in Descending order.|
| <span class="prop-name">ColumnResizeIcon</span> | <span class="prop-type">elementType </span> | <span class="prop-type">SeparatorIcon</span> |  Icon displayed in between two column headers that allows to resize the column header. |
| <span class="prop-name">DensityCompactIcon</span> | <span class="prop-type">elementType </span> | <span class="prop-type">ViewHeadlineIcon</span> | Icon displayed on the compact density option in the toolbar. |
| <span class="prop-name">DensityStandardIcon</span> | <span class="prop-type">elementType </span> | <span class="prop-type">TableRowsIcon</span> | Icon displayed on the standard density option in the toolbar. |
| <span class="prop-name">DensityComfortableIcon</span> | <span class="prop-type">elementType </span> | <span class="prop-type">ViewStreamIcon</span> | Icon displayed on the comfortable density option in the toolbar. |
| <span class="prop-name">ExportIcon</span> | <span class="prop-type">elementType </span> | <span class="prop-type">GridSaveAltIcon</span> | Icon displayed on the export button in the toolbar. |
| <span class="prop-name">OpenFilterButtonIcon</span> | <span class="prop-type">elementType </span> | <span class="prop-type">FilterListIcon</span> | Icon displayed on the open filter button present in the toolbar by default. |

## CSS

| Rule name | Global class | Description |
|:-----|:-------------|:------------|
| <span class="prop-name">root</span> | <span class="prop-name">.MuiDataGrid-root</span> | Styles applied to the root element. |
|  | <span class="prop-name">.MuiDataGrid-mainGridContainer</span> | Styles applied to the main container element.|
|  | <span class="prop-name">.MuiDataGrid-overlay</span> | Styles applied to the outer overlay element.|
|  | <span class="prop-name">.MuiDataGrid-columnsContainer</span> | Styles applied to the outer columns container element.|
|  | <span class="prop-name">.MuiDataGrid-columnHeaderWrapper</span> | Styles applied to the outer columns header cells container element.|
| <span class="prop-name">columnHeader</span> | <span class="prop-name">.MuiDataGrid-columnHeader</span> | Styles applied to the header cell element.|
| <span class="prop-name">cell</span> | <span class="prop-name">.MuiDataGrid-cell</span> | Styles applied to the cell element.|
|  | <span class="prop-name">.MuiDataGrid-columnHeaderCheckbox</span> | Styles applied to the header checkbox cell element.|
|  | <span class="prop-name">.MuiDataGrid-cellCheckbox</span> | Styles applied to the cell checkbox element.|
|  | <span class="prop-name">.MuiDataGrid-columnHeader--sortable</span> | Styles applied to the sortable header cell element.|
|  | <span class="prop-name">.MuiDataGrid-sortIcon</span> | Styles applied to the sort icon element.|
|  | <span class="prop-name">.MuiDataGrid-columnHeader--alignCenter</span> | Styles applied to the centered header cell element.|
|  | <span class="prop-name">.MuiDataGrid-columnHeader--alignRight</span> | Styles applied to the aligned right header cell element.|
|  | <span class="prop-name">.MuiDataGrid-columnHeaderTitle</span> | Styles applied to the header cell title element.|
|  | <span class="prop-name">.MuiDataGrid-columnSeparator</span> | Styles applied to the header cell separator element.|
|  | <span class="prop-name">.MuiDataGrid-iconSeparator</span> | Styles applied to the header cell separator icon element.|
|  | <span class="prop-name">.MuiDataGrid-dataContainer</span> | Styles applied to the data container element.|
|  | <span class="prop-name">.MuiDataGrid-window</span> | Styles applied to the window element.|
|  | <span class="prop-name">.MuiDataGrid-viewport</span> | Styles applied to the viewport element.|
| <span class="prop-name">row</span> | <span class="prop-name">.MuiDataGrid-row</span> | Styles applied to the row element.|
|  | <span class="prop-name">.MuiDataGrid-cell--withRenderer</span> | Styles applied to the customized cell element.|
|  | <span class="prop-name">.MuiDataGrid-withBorder</span> | Styles applied to the cell element that has right border displayed.|
|  | <span class="prop-name">.MuiDataGrid-cell--textLeft</span> | Styles applied to the aligned left cell element.|
|  | <span class="prop-name">.MuiDataGrid-cell--textRight</span> | Styles applied to the aligned right cell element.|
|  | <span class="prop-name">.MuiDataGrid-cell--textCenter</span> | Styles applied to the centered cell element.|
|  | <span class="prop-name">.MuiDataGrid-rowCount</span> | Styles applied to the footer row count element.|
|  | <span class="prop-name">.MuiDataGrid-selectedRowCount</span> | Styles applied to the footer selected row count element.|

You can override the style of the component thanks to one of these customization points:

- With a rule name of the [`classes` object prop](/customization/components/#overriding-styles-with-classes).
- With a [global class name](/customization/components/#overriding-styles-with-global-class-names).
- With a theme and an [`overrides` property](/customization/globals/#css).

If that's not sufficient, you can check the [implementation of the component style](https://github.com/mui-org/material-ui-x/blob/master/packages/grid/_modules_/grid/components/containers/GridRootStyles.ts) for more detail.

## Demos

- [DataGrid](/components/data-grid/#mit-version)
