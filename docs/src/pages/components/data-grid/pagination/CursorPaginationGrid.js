import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

const PAGE_SIZE = 5;

function loadServerRows(cursor, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = cursor ? data.rows.findIndex((row) => row.id === cursor) : 0;
      const end = start + PAGE_SIZE;
      const rows = data.rows.slice(start, end);

      resolve({ rows, nextCursor: data.rows[end]?.id });
    }, Math.random() * 500 + 100); // simulate network latency
  });
}

export default function CursorPaginationGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const pagesNextCursor = React.useRef({});

  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const handlePageChange = (newPage) => {
    // We have the cursor, we can allow the page transition.
    if (newPage === 0 || pagesNextCursor.current[newPage - 1]) {
      setPage(newPage);
    }
  };

  React.useEffect(() => {
    let active = true;

    (async () => {
      const nextCursor = pagesNextCursor.current[page - 1];

      if (!nextCursor && page > 0) {
        return;
      }

      setLoading(true);
      const response = await loadServerRows(nextCursor, data);

      if (response.nextCursor) {
        pagesNextCursor.current[page] = response.nextCursor;
      }

      if (!active) {
        return;
      }

      setRows(response.rows);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [page, data]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={data.columns}
        pagination
        pageSize={5}
        rowCount={100}
        paginationMode="server"
        onPageChange={handlePageChange}
        page={page}
        loading={loading}
      />
    </div>
  );
}
