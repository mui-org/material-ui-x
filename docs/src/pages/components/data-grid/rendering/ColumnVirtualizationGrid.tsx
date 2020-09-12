import * as React from 'react';
import { DataGrid, ColDef, RowId } from '@material-ui/data-grid';

export interface DataRowModel {
  id: RowId;
  [price: string]: number | string;
}

export interface GridData {
  columns: ColDef[];
  rows: DataRowModel[];
}

function useData(rowLength, columnsLenght) {
  const [data, setData] = React.useState<GridData>({ columns: [], rows: [] });

  React.useEffect(() => {
    const rows: DataRowModel[] = [];

    for (let i = 0; i < rowLength; i += 1) {
      const row = {
        id: i,
      };

      for (let j = 1; j <= columnsLenght; j += 1) {
        row[`price${j}M`] = `${i.toString()}, ${j} `;
      }

      rows.push(row);
    }

    const columns: ColDef[] = [{ field: 'id', hide: true }];

    for (let j = 1; j <= columnsLenght; j += 1) {
      columns.push({ field: `price${j}M`, headerName: `${j}M` });
    }

    setData({
      rows,
      columns,
    });
  }, [rowLength, columnsLenght]);

  return data;
}

export default function ColumnVirtualizationGrid() {
  const data = useData(50, 1000);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} columnBuffer={2} />
    </div>
  );
}
