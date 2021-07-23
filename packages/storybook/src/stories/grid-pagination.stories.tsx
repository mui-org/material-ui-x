import { DataGrid } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import * as React from 'react';
import { Story, Meta } from '@storybook/react';
import {
  GridApiRef,
  useGridApiRef,
  XGrid,
  GridPageChangeParams,
  GridRowsProp,
} from '@material-ui/x-grid';
import Button from '@material-ui/core/Button';
import Pagination from '@material-ui/lab/Pagination';
import { action } from '@storybook/addon-actions';
import { useData } from '../hooks/useData';
import { getData, GridData } from '../data/data-service';

export default {
  title: 'X-Grid Tests/Pagination',
  component: XGrid,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
  },
} as Meta;

export function PaginationDefault() {
  const data = useData(200, 20);

  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={data.columns} pagination />
    </div>
  );
}

export function PageSize100() {
  const data = useData(2000, 20);

  return (
    <div className="grid-container">
      <DataGrid rows={data.rows} columns={data.columns} pagination pageSize={100} />
    </div>
  );
}

export const PaginationArgs: Story = (props) => {
  const { rowCount, ...others } = props;
  const data = useData(rowCount, 20);

  return <XGrid rows={data.rows} columns={data.columns} {...others} />;
};
PaginationArgs.args = {
  pagination: true,
  pageSize: 100,
  page: 0,
  rowCount: 2000,
  autoPageSize: false,
  rowsPerPageOptions: [10, 20, 50, 100, 200],
  hideFooterRowCount: false,
  hideFooterPagination: false,
  hideFooter: false,
};

export function HiddenPagination() {
  const data = useData(200, 20);

  return (
    <div className="grid-container">
      <XGrid
        rows={data.rows}
        columns={data.columns}
        pageSize={100}
        pagination
        hideFooterPagination
      />
    </div>
  );
}

export function PaginationApiTests() {
  const apiRef: GridApiRef = useGridApiRef();
  const data = useData(2000, 200);
  const [autosize, setAutoSize] = React.useState(false);

  const backToFirstPage = () => {
    apiRef.current.setPage(0);
  };
  const [myPageSize, setPageSize] = React.useState(33);
  const changePageSizeWithOptionProp = () => {
    const newPageSize = myPageSize === 33 ? 50 : 33;
    setAutoSize(false);
    setPageSize(newPageSize);
  };
  const changePageSizeWithApi = () => {
    setAutoSize(false);
    apiRef.current.setPageSize(105);
  };
  return (
    <React.Fragment>
      <div>
        <Button component="button" color="primary" variant="outlined" onClick={backToFirstPage}>
          Back to first page
        </Button>
        <Button
          component="button"
          color="primary"
          variant="outlined"
          onClick={changePageSizeWithOptionProp}
        >
          Change pageSize with Options
        </Button>
        <Button
          component="button"
          color="primary"
          variant="outlined"
          onClick={changePageSizeWithApi}
        >
          Change pageSize with Api
        </Button>
        <Button color="primary" variant="outlined" onClick={() => setAutoSize((p) => !p)}>
          toggle pageAutoSize
        </Button>
      </div>
      <div className="grid-container">
        <XGrid
          apiRef={apiRef}
          rows={data.rows}
          columns={data.columns}
          pagination
          pageSize={myPageSize}
          autoPageSize={autosize}
          onPageChange={action('prop: onPageChange')}
          onPageSizeChange={action('prop: onPageSizeChange')}
          components={{
            Pagination: ({ state }) => (
              <Pagination
                className="my-custom-pagination"
                page={state.pagination.page + 1}
                count={state.pagination.pageCount}
                onChange={(e, value) => apiRef.current.setPage(value - 1)}
              />
            ),
          }}
        />
      </div>
    </React.Fragment>
  );
}

export function AutoPagination() {
  const [size, setSize] = React.useState({ width: 800, height: 600 });
  const data = useData(2000, 200);

  return (
    <React.Fragment>
      <div>
        <Button
          component="button"
          color="primary"
          variant="outlined"
          onClick={() => setSize({ width: size.height, height: size.width })}
        >
          Invert Sizes
        </Button>
        <Button
          component="button"
          color="primary"
          variant="outlined"
          onClick={() => setSize((p) => ({ ...p, height: p.height + 20 }))}
        >
          Add 20px height
        </Button>
      </div>
      <div style={{ width: size.width, height: size.height }}>
        <XGrid rows={data.rows} columns={data.columns} autoPageSize pagination />
      </div>
    </React.Fragment>
  );
}

function loadServerRows(params: { page: number; pageSize: number }): Promise<GridData> {
  return new Promise<GridData>((resolve) => {
    const data = getData(params.pageSize * 5, 10);

    setTimeout(() => {
      const minId = params.page * params.pageSize;
      data.rows.forEach((row) => {
        row.id = (Number(row.id) + minId).toString();
      });
      resolve(data);
    }, 500);
  });
}

export function ServerPaginationWithApi() {
  const apiRef: GridApiRef = useGridApiRef();
  const data = useData(1000, 10);
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const defaultPageSize = 50;

  const loadRows = React.useCallback((params: { page: number; pageSize: number }) => {
    setLoading(true);
    loadServerRows(params).then((newData) => {
      setRows(newData.rows);
      setLoading(false);
    });
  }, []);

  const handleOnPageChange = React.useCallback(
    (params) => {
      action('onPageChange')(params);
      loadRows(params);
    },
    [loadRows],
  );

  React.useEffect(() => {
    loadRows({ page: 0, pageSize: defaultPageSize });
  }, [apiRef, data, loadRows]);

  return (
    <div className="grid-container">
      <XGrid
        rows={rows}
        columns={data.columns}
        apiRef={apiRef}
        pagination
        onPageChange={handleOnPageChange}
        pageSize={defaultPageSize}
        rowCount={1000}
        paginationMode={'server'}
        loading={loading}
      />
    </div>
  );
}

export function ServerPaginationWithEventHandler() {
  const apiRef: GridApiRef = useGridApiRef();
  const data = useData(100, 10);
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const defaultPageSize = 50;

  const loadRows = React.useCallback((params: { page: number; pageSize: number }) => {
    setLoading(true);
    loadServerRows(params).then((newData) => {
      setRows(newData.rows);
      setLoading(false);
    });
  }, []);

  const onPageChange = React.useCallback(
    (params) => {
      action('onPageChange')(params);
      loadRows(params);
    },
    [loadRows],
  );

  React.useEffect(() => {
    loadRows({ page: 0, pageSize: defaultPageSize });
  }, [apiRef, data, loadRows]);

  return (
    <div className="grid-container">
      <XGrid
        rows={rows}
        columns={data.columns}
        apiRef={apiRef}
        pagination
        pageSize={defaultPageSize}
        rowCount={552}
        paginationMode={'server'}
        onPageChange={onPageChange}
        loading={loading}
      />
    </div>
  );
}
export function Page1Prop() {
  const data = useData(2000, 200);

  return (
    <div className="grid-container">
      <XGrid
        rows={data.rows}
        columns={data.columns}
        pagination
        pageSize={50}
        page={0}
        onPageChange={(p) => action('pageChange')(p)}
      />
    </div>
  );
}
export function Page2Prop() {
  const data = useData(2000, 200);

  return (
    <div className="grid-container">
      <XGrid
        rows={data.rows}
        columns={data.columns}
        pagination
        pageSize={50}
        page={1}
        onPageChange={(p) => action('pageChange')(p)}
      />
    </div>
  );
}
export function Page2Api() {
  const data = useData(2000, 200);
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    apiRef.current.setPage(1);
  }, [apiRef]);

  return (
    <div className="grid-container">
      <XGrid
        apiRef={apiRef}
        rows={data.rows}
        columns={data.columns}
        pagination
        pageSize={50}
        onPageChange={(p) => action('pageChange')(p)}
      />
    </div>
  );
}

const gridTestRows = [
  {
    id: 0,
    brand: 'Nike',
  },
  {
    id: 1,
    brand: 'Addidas',
  },
  {
    id: 2,
    brand: 'Puma',
  },
];

const columns = [{ field: 'brand' }];

export const GridTest = () => {
  const apiRef = useGridApiRef();
  React.useEffect(() => {
    apiRef.current.setPage(2);
  }, [apiRef]);
  return (
    <div style={{ width: 300, height: 300 }}>
      <XGrid
        rows={gridTestRows}
        apiRef={apiRef}
        columns={columns}
        pagination
        pageSize={1}
        hideFooter
      />
    </div>
  );
};
function loadDocsDemoServerRows(page: number, data: any): Promise<any> {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve(data.rows.slice(page * 5, (page + 1) * 5));
    }, Math.random() * 500 + 100); // simulate network latency
  });
}

export function ServerPaginationDocsDemo() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });
  const [page, setPage] = React.useState(0);
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handlePageChange = (params: GridPageChangeParams) => {
    setPage(params.page);
  };

  React.useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      const newRows = await loadDocsDemoServerRows(page, data);

      if (!active) {
        return;
      }

      setRows(newRows);
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
        loading={loading}
      />
    </div>
  );
}
export function CommodityAutoPageSizeSnap() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 500,
  });
  return (
    <div className="grid-container">
      <DataGrid rows={data.rows} columns={data.columns} pagination autoPageSize />
    </div>
  );
}
const xyRows = [
  { id: 1, x: 1, y: 1 },
  { id: 2, x: 1, y: 2 },
  { id: 3, x: 1, y: 3 },
  { id: 4, x: 1, y: 4 },
  { id: 5, x: 1, y: 5 },
  { id: 6, x: 1, y: 6 },
  { id: 7, x: 1, y: 7 },
  { id: 8, x: 1, y: 8 },
  { id: 9, x: 1, y: 9 },
];

const xyColumns = [
  { field: 'x', type: 'number' },
  { field: 'y', type: 'number' },
];

export function SmallAutoPageSizeLastPageSnap() {
  return (
    <div style={{ height: 400, width: 400 }}>
      <DataGrid pagination autoPageSize rows={xyRows} columns={xyColumns} page={1} />
    </div>
  );
}
