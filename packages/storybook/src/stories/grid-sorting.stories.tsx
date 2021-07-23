import * as React from 'react';
import Button from '@material-ui/core/Button';
import { randomInt } from '@material-ui/x-grid-data-generator';
import {
  GridColDef,
  XGrid,
  GridRowsProp,
  GridSortModel,
  useGridApiRef,
  getInitialGridSortingState,
} from '@material-ui/x-grid';
import { action } from '@storybook/addon-actions';

export default {
  title: 'X-Grid Tests/Sorting',
  component: XGrid,
  parameters: {
    options: { selectedPanel: 'storybook/action/panel' },
    docs: {
      page: null,
    },
  },
};

const getColumns: () => GridColDef[] = () => [
  { field: 'id', type: 'number' },
  { field: 'name', type: 'string' },
  { field: 'age', type: 'number', width: 100 },
  { field: 'born', type: 'date' },
  { field: 'updatedOn', type: 'dateTime', width: 180 },
];

const getRows = () => [
  {
    id: 1,
    name: 'alice',
    age: 40,
    born: new Date(1990, 10, 8),
    updatedOn: new Date(2020, 6, 21, 21, 0, 0),
  },
  {
    id: 2,
    name: 'bob',
    age: 30,
    born: new Date(1990, 9, 8),
    updatedOn: new Date(2020, 6, 21, 20, 0, 0),
  },
  {
    id: 3,
    name: 'igor',
    age: 40,
    born: new Date(1990, 10, 7),
    updatedOn: new Date(2020, 6, 21, 19, 50, 0),
  },
  {
    id: 4,
    name: 'clara',
    age: 40,
    born: new Date(1989, 1, 30),
    updatedOn: new Date(2020, 5, 18, 10, 11, 0),
  },
  {
    id: 5,
    name: 'clara',
    age: null,
    born: new Date(1984, 6, 11),
    updatedOn: new Date(2020, 6, 8, 23, 33, 25),
  },
  { id: 6, name: null, age: 25, born: null, updatedOn: new Date(2020, 6, 11, 11, 45, 53) },
  { id: 7, name: '', age: 42, born: new Date(2010, 12, 25), updatedOn: null },
];

export const HeadersClick = () => {
  return (
    <React.Fragment>
      <p>Click column headers to sort</p>
      <div className="grid-container">
        <XGrid rows={getRows()} columns={getColumns()} />
      </div>
    </React.Fragment>
  );
};

export const SortingOrderOverrideOption = () => {
  return (
    <React.Fragment>
      <p>Click column headers to sort</p>
      <div className="grid-container">
        <XGrid rows={getRows()} columns={getColumns()} {...{ sortingOrder: ['desc', 'asc'] }} />
      </div>
    </React.Fragment>
  );
};

export const StringSortingAsc = () => {
  const columns = getColumns();

  return (
    <div className="grid-container">
      <XGrid
        rows={getRows()}
        columns={columns}
        sortModel={[{ field: columns[1].field, sort: 'asc' }]}
      />
    </div>
  );
};
export const StringSortingDesc = () => {
  const columns = getColumns();

  return (
    <div className="grid-container">
      <XGrid
        rows={getRows()}
        columns={columns}
        sortModel={[{ field: columns[1].field, sort: 'desc' }]}
      />
    </div>
  );
};
export const NumberSortingAsc = () => {
  const columns = getColumns();
  return (
    <div className="grid-container">
      <XGrid
        rows={getRows()}
        columns={columns}
        sortModel={[{ field: columns[2].field, sort: 'asc' }]}
      />
    </div>
  );
};
export const NumberSortingDesc = () => {
  const columns = getColumns();

  return (
    <div className="grid-container">
      <XGrid
        rows={getRows()}
        columns={columns}
        sortModel={[{ field: columns[2].field, sort: 'desc' }]}
      />
    </div>
  );
};
export const DateSortingAsc = () => {
  const columns = getColumns();
  return (
    <div className="grid-container">
      <XGrid
        rows={getRows()}
        columns={columns}
        sortModel={[{ field: columns[3].field, sort: 'asc' }]}
      />
    </div>
  );
};
export const DateSortingDesc = () => {
  const columns = getColumns();

  return (
    <div className="grid-container">
      <XGrid
        rows={getRows()}
        columns={columns}
        sortModel={[{ field: columns[3].field, sort: 'desc' }]}
      />
    </div>
  );
};
export const DateTimeSortingAsc = () => {
  const columns = getColumns();

  return (
    <div className="grid-container">
      <XGrid
        rows={getRows()}
        columns={columns}
        sortModel={[{ field: columns[4].field, sort: 'asc' }]}
      />
    </div>
  );
};
export const DateTimeSortingDesc = () => {
  const columns = getColumns();

  return (
    <div className="grid-container">
      <XGrid
        rows={getRows()}
        columns={columns}
        sortModel={[{ field: columns[4].field, sort: 'desc' }]}
      />
    </div>
  );
};

export const MultipleSorting = () => {
  const columns = getColumns();
  return (
    <div className="grid-container">
      <XGrid
        rows={getRows()}
        columns={columns}
        sortModel={[
          { field: columns[1].field, sort: 'asc' },
          { field: columns[2].field, sort: 'desc' },
        ]}
      />
    </div>
  );
};

export const MultipleAndSortIndex = () => {
  const columns = getColumns();

  return (
    <div className="grid-container">
      <XGrid
        rows={getRows()}
        columns={columns}
        sortModel={[
          { field: columns[2].field, sort: 'desc' },
          { field: columns[1].field, sort: 'asc' },
        ]}
      />
    </div>
  );
};

export const UnsortableLastCol = () => {
  const columns = getColumns();
  columns[columns.length] = {
    field: 'username',
    sortable: false,
    valueGetter: (params) =>
      `${params.getValue(params.id, 'name') || 'unknown'}_${
        params.getValue(params.id, 'age') || 'x'
      }`,
    width: 150,
  };

  return (
    <div className="grid-container">
      <XGrid rows={getRows()} columns={columns} />
    </div>
  );
};

export const CustomComparator = () => {
  const columns = getColumns();
  columns[columns.length] = {
    field: 'username',
    valueGetter: (params) =>
      `${params.getValue(params.id, 'name') || 'unknown'}_${
        params.getValue(params.id, 'age') || 'x'
      }`,
    sortComparator: (v1, v2, cellParams1, cellParams2) =>
      (cellParams1.api.getCellValue(cellParams1.id, 'age') as number) -
      (cellParams2.api.getCellValue(cellParams2.id, 'age') as number),
    width: 150,
  };

  return (
    <div className="grid-container">
      <XGrid
        rows={getRows()}
        columns={columns}
        sortModel={[{ field: columns[columns.length - 1].field, sort: 'asc' }]}
      />
    </div>
  );
};

export const SortingWithFormatter = () => {
  const columns = getColumns();
  columns[2] = {
    ...columns[2],
    valueFormatter: (params) => (params.value ? `${params.value} years ` : 'unknown'),
  };

  return (
    <div className="grid-container">
      <XGrid
        rows={getRows()}
        columns={columns}
        sortModel={[{ field: columns[2].field, sort: 'desc' }]}
      />
    </div>
  );
};

export const SortModelOptionsMultiple = () => {
  const sortModel: GridSortModel = React.useMemo(
    () => [
      { field: 'age', sort: 'desc' },
      { field: 'name', sort: 'asc' },
    ],
    [],
  );

  return (
    <div className="grid-container">
      <XGrid rows={getRows()} columns={getColumns()} {...{ sortModel }} />
    </div>
  );
};
export const ApiSingleSorted = () => {
  const apiRef = useGridApiRef();
  React.useEffect(() => {
    apiRef.current.setSortModel([{ field: 'name', sort: 'asc' }]);
  }, [apiRef]);

  return (
    <div className="grid-container">
      <XGrid rows={getRows()} columns={getColumns()} apiRef={apiRef} />
    </div>
  );
};
export const ApiMultipleSorted = () => {
  const apiRef = useGridApiRef();
  React.useEffect(() => {
    apiRef.current.setSortModel([
      { field: 'age', sort: 'desc' },
      { field: 'name', sort: 'asc' },
    ]);
  }, [apiRef]);

  return (
    <div className="grid-container">
      <XGrid rows={getRows()} columns={getColumns()} apiRef={apiRef} />
    </div>
  );
};

export const SortedEventsApi = () => {
  const apiRef = useGridApiRef();
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);
  const [loggedEvents, setEvents] = React.useState<any[]>([]);

  const handleEvent = React.useCallback((name, params) => {
    action(name)(params);
    setEvents((prev: any[]) => [...prev, name]);
  }, []);

  const handleOnSortModelChange = React.useCallback(
    (params) => handleEvent('onSortModelChange', params),
    [handleEvent],
  );

  React.useEffect(() => {
    apiRef.current.setSortModel([
      { field: 'age', sort: 'desc' },
      { field: 'name', sort: 'asc' },
    ]);
  }, [apiRef, handleEvent]);

  // We had the ol so we can test it with image snapshots
  return (
    <React.Fragment>
      <div>
        <h1 style={{ fontSize: '16pt' }}>Triggered Events in order </h1>
        <ol>
          {loggedEvents.map((event, idx) => (
            <li key={event + idx}>{event}</li>
          ))}
        </ol>
      </div>
      <div className="grid-container">
        <XGrid
          rows={rows}
          columns={cols}
          onSortModelChange={handleOnSortModelChange}
          apiRef={apiRef}
        />
      </div>
    </React.Fragment>
  );
};
export const SortedEventsOptions = () => {
  const rows = React.useMemo(() => getRows(), []);
  const cols = React.useMemo(() => getColumns(), []);
  const [loggedEvents, setEvents] = React.useState<any[]>([]);

  const handleEvent = React.useCallback((name, params) => {
    action(name)(params);
    setEvents((prev: any[]) => [...prev, name]);
  }, []);

  const onSortModelChange = React.useCallback(
    (params) => handleEvent('onSortModelChange', params),
    [handleEvent],
  );
  const sortModel = React.useMemo(
    () =>
      [
        { field: 'age', sort: 'desc' },
        { field: 'name', sort: 'asc' },
      ] as GridSortModel,
    [],
  );

  // We had the ol so we can test it with image snapshots
  return (
    <React.Fragment>
      <div>
        <h1 style={{ fontSize: '16pt' }}>Triggered Events in order </h1>
        <ol>
          {loggedEvents.map((event, idx) => (
            <li key={event + idx}>{event}</li>
          ))}
        </ol>
      </div>
      <div className="grid-container">
        <XGrid
          rows={rows}
          columns={cols}
          {...{
            onSortModelChange,
            sortModel,
          }}
        />
      </div>
    </React.Fragment>
  );
};

function sortServerRows(
  rows: Readonly<any[]>,
  sortModel: GridSortModel,
  columns: GridColDef[],
): Promise<any[]> {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      if (sortModel.length === 0) {
        resolve(getRows());
        return;
      }
      const sortedCol = sortModel[0];
      const comparator = columns.find((col) => col.field === sortedCol.field)!.sortComparator!;
      const clonedRows = [...rows];
      let sortedRows = clonedRows.sort((a, b) =>
        comparator(a[sortedCol.field], b[sortedCol.field], a, b),
      );

      if (sortModel[0].sort === 'desc') {
        sortedRows = sortedRows.reverse();
      }

      resolve(sortedRows);
    }, 500);
  });
}

export const ServerSideSorting = () => {
  const apiRef = useGridApiRef();
  const [rows, setRows] = React.useState<GridRowsProp>(getRows());
  const [sortModel, setSortModel] = React.useState<GridSortModel>([{ field: 'age', sort: 'desc' }]);
  const [columns] = React.useState<GridColDef[]>(getColumns());
  const [loading, setLoading] = React.useState<boolean>(false);

  const onSortModelChange = React.useCallback(
    async (model: GridSortModel) => {
      setLoading(true);
      action('onSortModelChange')(model);

      setSortModel(model);
      const newRows = await sortServerRows(rows, model, apiRef.current.getVisibleColumns());
      setRows(newRows);
      setLoading(false);
    },
    [apiRef, rows],
  );

  return (
    <div className="grid-container">
      <XGrid
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        onSortModelChange={onSortModelChange}
        sortingMode="server"
        disableMultipleColumnsSorting
        sortModel={sortModel}
        loading={loading}
      />
    </div>
  );
};

export const ResetSortingRows = () => {
  const columns = [
    {
      field: 'name',
      width: 200,
    },
    {
      field: 'team',
      width: 200,
      type: 'number',
    },
  ];
  const [rows, setRows] = React.useState<GridRowsProp>([]);

  const createRandomRows = () => {
    const randomRows: any[] = [];

    for (let i = 0; i < 10; i += 1) {
      const id = randomInt(0, 100000).toString();
      randomRows.push({ id, name: 'name test', team: id });
    }

    setRows(randomRows);
  };

  return (
    <div className="grid-container" style={{ flexDirection: 'column' }}>
      <Button onClick={() => createRandomRows()}>Random Rows</Button>
      <XGrid rows={rows} columns={columns} sortModel={[{ field: 'team', sort: 'asc' }]} />
    </div>
  );
};

export const OriginalOrder = () => {
  const idOnlyCols = [{ field: 'id' }];
  const simpleRows = [{ id: 10 }, { id: 0 }, { id: 5 }];

  return (
    <div className="grid-container" style={{ flexDirection: 'column' }}>
      <XGrid rows={simpleRows} columns={idOnlyCols} />
    </div>
  );
};

export function SimpleModelWithOnChangeControlSort() {
  const [simpleColumns] = React.useState([
    {
      field: 'id',
    },
    { field: 'name' },
  ]);
  const [simpleRows] = React.useState([
    {
      id: '1',
      name: 'Paris',
    },
    {
      id: '2',
      name: 'Nice',
    },
    {
      id: '3',
      name: 'London',
    },
  ]);

  const [simpleSortModel, setSortModel] = React.useState<GridSortModel>(
    getInitialGridSortingState().sortModel,
  );
  const handleSortChange = React.useCallback((model) => {
    setSortModel(model);
  }, []);

  return (
    <XGrid
      rows={simpleRows}
      columns={simpleColumns}
      sortModel={simpleSortModel}
      onSortModelChange={handleSortChange}
    />
  );
}
export function SimpleModelControlSort() {
  const [simpleColumns] = React.useState([
    {
      field: 'id',
    },
    { field: 'name' },
  ]);
  const [simpleRows] = React.useState([
    {
      id: '1',
      name: 'Paris',
    },
    {
      id: '2',
      name: 'Nice',
    },
    {
      id: '3',
      name: 'London',
    },
  ]);

  const [simpleSortModel] = React.useState<GridSortModel>([{ field: 'name', sort: 'desc' }]);

  return <XGrid rows={simpleRows} columns={simpleColumns} sortModel={simpleSortModel} />;
}
export function SimpleOnChangeControlSort() {
  const [simpleColumns] = React.useState([
    {
      field: 'id',
    },
    { field: 'name' },
  ]);
  const [simpleRows] = React.useState([
    {
      id: '1',
      name: 'Paris',
    },
    {
      id: '2',
      name: 'Nice',
    },
    {
      id: '3',
      name: 'London',
    },
  ]);

  const handleSortChange = React.useCallback((model) => {
    // eslint-disable-next-line no-console
    console.log('Sort model changed to', model);
  }, []);

  return <XGrid rows={simpleRows} columns={simpleColumns} onSortModelChange={handleSortChange} />;
}
