# GridCellParams Interface

<p class="description">Object passed as parameter in the column <a href="/api/data-grid/grid-col-def/">GridColDef</a> cell renderer.</p>

## Import

```js
import { GridCellParams } from '@material-ui/x-grid';
// or
import { GridCellParams } from '@material-ui/data-grid';
```

## Properties

| Name                                                                                         | Type                                                                              | Description                                                      |
| :------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| <span class="prop-name">api</span>                                                           | <span class="prop-type">GridApi&lt;&gt;</span>                                    | GridApi that let you manipulate the grid.                        |
| <span class="prop-name">cellMode</span>                                                      | <span class="prop-type">GridCellMode</span>                                       | The mode of the cell.                                            |
| <span class="prop-name">colDef</span>                                                        | <span class="prop-type">GridColDef</span>                                         | The column of the row that the current cell belongs to.          |
| <span class="prop-name">field</span>                                                         | <span class="prop-type">string</span>                                             | The column field of the cell that triggered the event            |
| <span class="prop-name">formattedValue</span>                                                | <span class="prop-type">GridCellValue</span>                                      | The cell value formatted with the column valueFormatter.         |
| <span class="prop-name">getValue</span>                                                      | <span class="prop-type">(id: GridRowId, field: string) =&gt; GridCellValue</span> | Get the cell value of a row and field.                           |
| <span class="prop-name">hasFocus</span>                                                      | <span class="prop-type">boolean</span>                                            | If true, the cell is the active element.                         |
| <span class="prop-name">id</span>                                                            | <span class="prop-type">GridRowId</span>                                          | The grid row id.                                                 |
| <span class="prop-name optional">isEditable<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">boolean</span>                                            | If true, the cell is editable.                                   |
| <span class="prop-name">row</span>                                                           | <span class="prop-type">GridRowData</span>                                        | The row model of the row that the current cell belongs to.       |
| <span class="prop-name">tabIndex</span>                                                      | <span class="prop-type">0 \| -1</span>                                            | the tabIndex value.                                              |
| <span class="prop-name">value</span>                                                         | <span class="prop-type">GridCellValue</span>                                      | The cell value, but if the column has valueGetter, use getValue. |
