import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export default function ControlledPaginationGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });
  const [page, setPage] = React.useState(0);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        page={page}
        onPageChange={(newPage) => setPage(newPage)}
        pageSize={5}
        pagination
        {...data}
      />
    </div>
  );
}
