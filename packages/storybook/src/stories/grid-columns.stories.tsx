import { useDemoData } from '@material-ui/x-grid-data-generator';
import * as React from 'react';
import { GridColDef, XGrid, GridColTypeDef, GridValueGetterParams } from '@material-ui/x-grid';
import CreateIcon from '@material-ui/icons/Create';
import Button from '@material-ui/core/Button';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/Columns',
  component: XGrid,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

export function SmallColSizes() {
  const data = useData(100, 20);
  const transformColSizes = (columns: GridColDef[]) => columns.map((c) => ({ ...c, width: 60 }));

  return <XGrid rows={data.rows} columns={transformColSizes(data.columns)} />;
}

export function VerySmallColSizes() {
  const data = useData(100, 20);
  const transformColSizes = (columns: GridColDef[]) => columns.map((c) => ({ ...c, width: 50 }));
  return <XGrid rows={data.rows} columns={transformColSizes(data.columns)} />;
}
export function ColumnDescriptionTooltip() {
  const data = useData(100, 20);
  const transformColSizes = (columns: GridColDef[]) =>
    columns.map((c) => {
      if (c.field === 'currencyPair') {
        return { ...c, width: 80, description: 'This is the currency pair column' };
      }
      return c;
    });

  return <XGrid rows={data.rows} columns={transformColSizes(data.columns)} />;
}

export function HiddenColumns() {
  const data = useData(100, 20);
  const transformColSizes = (columns: GridColDef[]) =>
    columns.map((c, idx) => ({ ...c, hide: idx % 2 === 0 }));
  return <XGrid rows={data.rows} columns={transformColSizes(data.columns)} />;
}

export function UpdateColumnsBtn() {
  const columns: GridColDef[] = [
    { field: 'id' },
    { field: 'firstName' },
    { field: 'lastName' },
    { field: 'age' },
    { field: 'age1' },
    { field: 'age2' },
    { field: 'age3' },
    { field: 'age4' },
    { field: 'fullName' },
    { field: 'isRegistered' },
    { field: 'registerDate' },
    { field: 'lastLoginDate' },
  ];

  const rows = [
    { id: 1, firstName: 'alice', age: 40 },
    {
      id: 2,
      lastName: 'Smith',
      firstName: 'bob',
      isRegistered: true,
      age: 30,
      age1: 23,
      age2: 54,
      age3: 24,
      age4: 342,
      registerDate: new Date(2011, 2, 11),
      lastLoginDate: new Date(2020, 4, 28, 11, 30, 25),
    },
    {
      id: 3,
      lastName: 'Smith',
      firstName: 'igor',
      isRegistered: false,
      age: 40,
      registerDate: new Date(2011, 5, 9),
    },
    {
      id: 4,
      lastName: 'James',
      firstName: 'clara',
      isRegistered: true,
      age: 40,
      registerDate: new Date(2013, 8, 1),
      lastLoginDate: new Date(2020, 4, 24, 8, 30, 25),
    },
    {
      id: 5,
      lastName: 'Bobby',
      firstName: 'clara',
      isRegistered: false,
      age: null,
      registerDate: new Date(2014, 6, 1),
      lastLoginDate: new Date(2020, 2, 24, 12, 10, 25),
    },
    {
      id: 6,
      lastName: 'James',
      firstName: null,
      isRegistered: false,
      age: 40,
      registerDate: new Date(2004, 2, 15),
      lastLoginDate: new Date(2020, 7, 4, 2, 10, 25),
    },
    { id: 7, lastName: 'Smith', firstName: '', isRegistered: true, age: 40 },
  ];

  const [cols, setCols] = React.useState(columns);
  const changeCols = () => {
    if (cols.length === columns.length) {
      const newCols = columns.filter((c) => c.field.indexOf('age') === -1);
      newCols.forEach((c) => {
        c.resizable = false;
      });
      setCols(newCols);
    } else {
      setCols(columns);
    }
  };

  return (
    <React.Fragment>
      <div>
        <Button onClick={changeCols} id="action-btn">
          Change cols
        </Button>
      </div>
      <div className="grid-container">
        <XGrid rows={rows} columns={cols} />
      </div>
    </React.Fragment>
  );
}

export function HeaderComponent() {
  const data = useData(100, 5);

  const transformCols = React.useCallback((cols) => {
    if (cols.length > 0) {
      cols[0].renderHeader = () => <CreateIcon className="icon" />;
    }
    return cols;
  }, []);

  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={transformCols(data.columns)} />
    </div>
  );
}

export function ColumnsAlign() {
  const data = useData(100, 5);

  const transformCols = React.useCallback((cols) => {
    if (cols.length > 0) {
      cols.forEach((col: GridColDef, idx: number) => {
        if (idx > 1 && idx % 2 === 1) {
          col.align = 'right';
          col.headerAlign = 'right';
        } else if (idx > 1 && idx % 2 === 0) {
          col.align = 'center';
          col.headerAlign = 'center';
        }
        col.width = 180;
      });
    }
    return cols;
  }, []);

  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={transformCols(data.columns)} />
    </div>
  );
}

const priceColumnType: GridColTypeDef = {
  extendType: 'number',
  valueFormatter: ({ value }) => `${value} USD`,
};
const unknownPriceColumnType: GridColTypeDef = { ...priceColumnType, cellClassName: 'unknown' };

export function NewColumnTypes() {
  const data = useData(100, 5);

  const transformCols = React.useCallback((cols) => {
    if (cols.length > 0) {
      cols.forEach((col: GridColDef, idx: number) => {
        if (idx > 1 && idx % 2 === 1) {
          col.type = 'price';
        } else if (idx > 1 && idx % 2 === 0) {
          col.type = 'unknownPrice';
        }
        col.width = 180;
      });
    }
    return cols;
  }, []);

  return (
    <div className="grid-container">
      <XGrid
        rows={data.rows}
        columns={transformCols(data.columns)}
        columnTypes={{ price: priceColumnType, unknownPrice: unknownPriceColumnType }}
      />
    </div>
  );
}

export const FlexColumnsWithCheckbox = () => {
  const data = useData(20, 3);
  const transformColSizes = React.useCallback(
    (columns: GridColDef[]) =>
      columns.map((col, index) =>
        index % 2 === 0 ? { ...col, flex: index + 1 } : { ...col, width: 200 },
      ),
    [],
  );

  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={transformColSizes(data.columns)} checkboxSelection />
    </div>
  );
};

export const FewFlexColumns = () => {
  const data = useData(20, 3);
  const transformColSizes = React.useCallback(
    (columns: GridColDef[]) =>
      columns.map((col, index) =>
        index % 2 === 0 ? { ...col, flex: index + 1 } : { ...col, width: 200 },
      ),
    [],
  );

  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={transformColSizes(data.columns)} />
    </div>
  );
};

export const SeveralFlexColumn = () => {
  const data = useData(20, 7);
  const transformColSizes = React.useCallback(
    (columns: GridColDef[]) =>
      columns.map((col, index) =>
        index % 3 !== 0 ? { ...col, flex: index } : { ...col, flex: 1 },
      ),
    [],
  );

  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={transformColSizes(data.columns)} />
    </div>
  );
};

export const FlexColumnWidth2000 = () => {
  const data = useData(20, 3);
  const transformColSizes = React.useCallback(
    (columns: GridColDef[]) =>
      columns.map((col, index) =>
        index % 2 !== 0 ? { ...col, width: 2000 } : { ...col, flex: index + 1 },
      ),
    [],
  );

  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={transformColSizes(data.columns)} />
    </div>
  );
};

export const ValueGetterAndFormatter = () => {
  const [data] = React.useState({
    rows: [
      { id: 1, first: 'mark', age: 1 },
      { id: 2, first: 'jack', age: 2 },
    ],
    columns: [
      { field: 'id', hide: true },
      {
        field: 'firstAge',
        valueGetter: (params: GridValueGetterParams) =>
          `${params.getValue(params.id, 'first')}_${params.getValue(params.id, 'age')}`,
      },
      {
        field: 'firstAgeFormatted',
        valueGetter: (params: GridValueGetterParams) =>
          `${params.getValue(params.id, 'first')}_${params.getValue(params.id, 'age')}`,
        valueFormatter: (params) => `${params.value} yrs`,
      },
    ],
  });

  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={data.columns} />
    </div>
  );
};

export const SingleSelectColumnType = () => {
  const countries = [
    {
      value: 'bg',
      label: 'Bulgaria',
    },
    {
      value: 'nl',
      label: 'Netherlands',
    },
    {
      value: 'fr',
      label: 'France',
    },
    {
      value: 'it',
      label: 'Italy',
    },
  ];

  const data = {
    rows: [
      { id: 0, country: 'bg' },
      { id: 1, country: 'nl' },
    ],
    columns: [
      {
        field: 'country',
        type: 'singleSelect',
        valueOptions: countries,
        valueFormatter: (params) => {
          const result = countries.find((country) => country.value === params.value);
          return result!.label;
        },
        editable: true,
        width: 200,
      },
    ],
  };

  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={data.columns} />
    </div>
  );
};
export function FlexLayoutGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 15,
    maxColumns: 6,
  });

  const tmpData = JSON.parse(JSON.stringify(data));
  tmpData.columns.forEach((item) => {
    item.flex = 1;
  });
  return (
    <div style={{ height: '400px', width: '400px' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <XGrid
            autoHeight
            showCellRightBorder
            showColumnRightBorder
            disableExtendRowFullWidth
            rows={tmpData.rows}
            columns={tmpData.columns}
          />
        </div>
      </div>
    </div>
  );
}
