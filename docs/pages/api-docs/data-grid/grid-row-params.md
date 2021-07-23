# GridRowParams Interface

<p class="description">Object passed as parameter in the column <a href="/api/data-grid/grid-col-def/">GridColDef</a> cell renderer.</p>

## Import

```js
import { GridRowParams } from '@material-ui/x-grid';
// or
import { GridRowParams } from '@material-ui/data-grid';
```

## Properties

| Name                                    | Type                                                                              | Description                                                |
| :-------------------------------------- | :-------------------------------------------------------------------------------- | :--------------------------------------------------------- |
| <span class="prop-name">api</span>      | <span class="prop-type">GridApi&lt;&gt;</span>                                    | GridApiRef that let you manipulate the grid.               |
| <span class="prop-name">columns</span>  | <span class="prop-type">GridColumns</span>                                        | All grid columns.                                          |
| <span class="prop-name">getValue</span> | <span class="prop-type">(id: GridRowId, field: string) =&gt; GridCellValue</span> | Get the cell value of a row and field.                     |
| <span class="prop-name">id</span>       | <span class="prop-type">GridRowId</span>                                          | The grid row id.                                           |
| <span class="prop-name">row</span>      | <span class="prop-type">GridRowData</span>                                        | The row model of the row that the current cell belongs to. |
