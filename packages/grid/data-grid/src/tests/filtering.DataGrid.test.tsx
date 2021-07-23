import * as React from 'react';
import {
  createClientRenderStrictMode, // @ts-expect-error need to migrate helpers to TypeScript
  screen,
} from 'test/utils';
import { expect } from 'chai';
import { DataGrid, GridToolbar, GridPreferencePanelsValue } from '@material-ui/data-grid';
import { getColumnValues } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Filter', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const baselineProps = {
    autoHeight: isJSDOM,
    rows: [
      {
        id: 0,
        brand: 'Nike',
        isPublished: false,
        country: 'United States',
        status: 0,
      },
      {
        id: 1,
        brand: 'Adidas',
        isPublished: true,
        country: 'Germany',
        status: 0,
      },
      {
        id: 2,
        brand: 'Puma',
        isPublished: true,
        country: 'Germany',
        status: 2,
      },
    ],
    columns: [
      { field: 'brand' },
      { field: 'isPublished', type: 'boolean' },
      {
        field: 'country',
        type: 'singleSelect',
        valueOptions: ['United States', 'Germany', 'France'],
      },
      {
        field: 'status',
        type: 'singleSelect',
        valueOptions: [
          { value: 0, label: 'Payment Pending' },
          { value: 1, label: 'Shipped' },
          { value: 2, label: 'Delivered' },
        ],
      },
    ],
  };

  const TestCase = (props: {
    rows?: any[];
    columns?: any[];
    operatorValue?: string;
    value?: any;
    field?: string;
    state?: any;
  }) => {
    const { operatorValue, value, rows, columns, field = 'brand', ...other } = props;
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid
          autoHeight={isJSDOM}
          columns={columns || baselineProps.columns}
          rows={rows || baselineProps.rows}
          filterModel={{
            items: [
              {
                columnField: field,
                value,
                operatorValue,
              },
            ],
          }}
          disableColumnFilter={false}
          {...other}
        />
      </div>
    );
  };

  it('should throw for more than one filter item', () => {
    expect(() => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid rows={[]} columns={[]} filterModel={{ items: [{ id: 0 }, { id: 1 }] }} />
        </div>,
      );
    })
      // @ts-expect-error need to migrate helpers to TypeScript
      .toErrorDev('`model.items` has more than 1 item');
  });

  it('should apply the filterModel prop correctly', () => {
    render(<TestCase value="a" operatorValue="contains" />);
    expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
  });

  it('should apply the filterModel prop correctly when row prop changes', () => {
    render(
      <TestCase
        value="a"
        operatorValue="contains"
        rows={[
          {
            id: 3,
            brand: 'Asics',
          },
          {
            id: 4,
            brand: 'RedBull',
          },
          {
            id: 5,
            brand: 'Hugo',
          },
        ]}
      />,
    );
    expect(getColumnValues()).to.deep.equal(['Asics']);
  });

  [
    { operatorValue: '', value: '2000-12-01' },
    { operatorValue: '', value: '' },
  ].forEach(({ operatorValue, value }) => {
    it(`should not filter when operatorValue='${operatorValue}' and value='${value}'`, () => {
      render(
        <TestCase
          value={value}
          operatorValue={operatorValue}
          rows={[
            {
              id: 3,
              brand: { date: new Date(2000, 11, 1) },
            },
            {
              id: 4,
              brand: { date: new Date(2001, 0, 1) },
            },
            {
              id: 5,
              brand: { date: new Date(2002, 0, 1) },
            },
          ]}
          columns={[
            {
              field: 'brand',
              type: 'date',
              valueGetter: (params) => params.value.date,
              valueFormatter: (params) => params.value.toLocaleDateString('en-US'),
            },
          ]}
        />,
      );
      expect(getColumnValues()).to.deep.equal(['12/1/2000', '1/1/2001', '1/1/2002']);
    });
  });

  describe('string operators', () => {
    it('should allow operator startsWith', () => {
      const { setProps } = render(<TestCase value="a" operatorValue="contains" />);
      setProps({
        operatorValue: 'startsWith',
      });
      expect(getColumnValues()).to.deep.equal(['Adidas']);
    });

    it('should allow operator endsWith', () => {
      const { setProps } = render(<TestCase value="a" operatorValue="contains" />);
      setProps({
        operatorValue: 'endsWith',
      });
      expect(getColumnValues()).to.deep.equal(['Puma']);
    });

    it('should allow operator equal', () => {
      const { setProps } = render(<TestCase value="a" operatorValue="contains" />);
      setProps({
        operatorValue: 'equals',
        value: 'nike',
      });
      expect(getColumnValues()).to.deep.equal(['Nike']);
    });

    it('should allow operator isEmpty', () => {
      const rows = [
        {
          id: 0,
          brand: 'Nike',
          country: 'United States',
        },
        {
          id: 1,
          brand: 'Adidas',
          country: null,
        },
        {
          id: 2,
          brand: 'Puma',
          country: '',
        },
      ];
      render(
        <TestCase
          operatorValue="isEmpty"
          field="country"
          columns={[{ field: 'brand' }, { field: 'country' }]}
          rows={rows}
        />,
      );
      expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
    });

    it('should allow operator isNotEmpty', () => {
      const rows = [
        {
          id: 0,
          brand: 'Nike',
          country: 'United States',
        },
        {
          id: 1,
          brand: 'Adidas',
          country: null,
        },
        {
          id: 2,
          brand: 'Puma',
          country: '',
        },
      ];
      render(
        <TestCase
          operatorValue="isNotEmpty"
          field="country"
          columns={[{ field: 'brand' }, { field: 'country' }]}
          rows={rows}
        />,
      );
      expect(getColumnValues()).to.deep.equal(['Nike']);
    });

    [
      { operatorValue: 'contains', value: 'a', expected: ['Asics'] },
      { operatorValue: 'startsWith', value: 'r', expected: ['RedBull'] },
      { operatorValue: 'equals', value: 'hugo', expected: ['Hugo'] },
      { operatorValue: 'endsWith', value: 'ics', expected: ['Asics'] },
    ].forEach(({ operatorValue, value, expected }) => {
      it(`should allow object as value and work with valueGetter, operatorValue: ${operatorValue}`, () => {
        render(
          <TestCase
            value={value}
            operatorValue={operatorValue}
            rows={[
              {
                id: 3,
                brand: { name: 'Asics' },
              },
              {
                id: 4,
                brand: { name: 'RedBull' },
              },
              {
                id: 5,
                brand: { name: 'Hugo' },
              },
            ]}
            columns={[{ field: 'brand', valueGetter: (params) => params.value.name }]}
          />,
        );
        expect(getColumnValues()).to.deep.equal(expected);
      });
    });

    describe('RegExp', () => {
      ['contains', 'startsWith', 'endsWith'].forEach((operatorValue) => {
        it('should escape RegExp characters if applied as filter values', () => {
          const regExpToEscape = '[-[]{}()*+?.,\\^$|#s]';
          render(<TestCase value={regExpToEscape} operatorValue={operatorValue} />);
          expect(getColumnValues()).to.deep.equal([]);
        });
      });

      it('should allow regex special as literals and return rows with the matched input', () => {
        render(
          <TestCase
            rows={[
              {
                id: 0,
                brand: 'Amazon',
              },
              {
                id: 1,
                brand: 'Amazon.com, Inc.',
              },
              {
                id: 2,
                brand: 'Amazon.com,',
              },
            ]}
            value=".com,"
            operatorValue="contains"
          />,
        );
        expect(getColumnValues()).to.deep.equal(['Amazon.com, Inc.', 'Amazon.com,']);
      });
    });
  });

  describe('numeric operators', () => {
    [
      { operatorValue: '=', value: 1984, expected: [1984] },
      { operatorValue: '!=', value: 1984, expected: [1954, 1974] },
      { operatorValue: '>', value: 1974, expected: [1984] },
      { operatorValue: '>=', value: 1974, expected: [1984, 1974] },
      { operatorValue: '<', value: 1974, expected: [1954] },
      { operatorValue: '<=', value: 1974, expected: [1954, 1974] },
    ].forEach(({ operatorValue, value, expected }) => {
      it(`should allow object as value and work with valueGetter, operatorValue: ${operatorValue}`, () => {
        render(
          <TestCase
            value={value.toString()}
            operatorValue={operatorValue}
            rows={[
              {
                id: 3,
                brand: { year: 1984 },
              },
              {
                id: 4,
                brand: { year: 1954 },
              },
              {
                id: 5,
                brand: { year: 1974 },
              },
            ]}
            columns={[
              { field: 'brand', valueGetter: (params) => params.value.year, type: 'number' },
            ]}
          />,
        );
        expect(getColumnValues()).to.deep.equal(expected.map((res) => res.toLocaleString()));
      });
    });
  });

  describe('date operators', () => {
    [
      { operatorValue: 'is', value: '' },
      { operatorValue: 'is', value: undefined },
    ].forEach(({ operatorValue, value }) => {
      it(`should not filter when operatorValue='${operatorValue}' and value='${value}'`, () => {
        render(
          <TestCase
            value={value}
            operatorValue={operatorValue}
            rows={[
              {
                id: 3,
                brand: { date: new Date(2000, 11, 1) },
              },
              {
                id: 4,
                brand: { date: new Date(2001, 0, 1) },
              },
              {
                id: 5,
                brand: { date: new Date(2002, 0, 1) },
              },
            ]}
            columns={[
              {
                field: 'brand',
                type: 'date',
                valueGetter: (params) => params.value.date,
                valueFormatter: (params) => params.value.toLocaleDateString('en-US'),
              },
            ]}
          />,
        );
        expect(getColumnValues()).to.deep.equal(['12/1/2000', '1/1/2001', '1/1/2002']);
      });
    });

    it('should filter out rows with invalid values', () => {
      render(
        <TestCase
          value="2001-01-01"
          operatorValue="before"
          rows={[
            {
              id: 3,
              brand: { date: new Date(2000, 11, 1) },
            },
            {
              id: 4,
              brand: { date: '' },
            },
            {
              id: 5,
              brand: { date: null },
            },
          ]}
          columns={[
            {
              field: 'brand',
              type: 'date',
              valueGetter: (params) => params.value.date,
              valueFormatter: (params) =>
                params.value instanceof Date
                  ? params.value.toLocaleDateString('en-US')
                  : params.value,
            },
          ]}
        />,
      );
      expect(getColumnValues()).to.deep.equal(['12/1/2000']);
    });

    [
      { operatorValue: 'is', value: '2000-12-01', expected: ['12/1/2000'] },
      { operatorValue: 'not', value: '2000-12-01', expected: ['1/1/2001', '1/1/2002'] },
      { operatorValue: 'after', value: '2001-01-01', expected: ['1/1/2002'] },
      { operatorValue: 'onOrAfter', value: '2001-01-01', expected: ['1/1/2001', '1/1/2002'] },
      { operatorValue: 'before', value: '2001-01-01', expected: ['12/1/2000'] },
      { operatorValue: 'onOrBefore', value: '2001-01-01', expected: ['12/1/2000', '1/1/2001'] },
    ].forEach(({ operatorValue, value, expected }) => {
      it(`should allow object as value and work with valueGetter, operatorValue: ${operatorValue}`, () => {
        render(
          <TestCase
            value={value}
            operatorValue={operatorValue}
            rows={[
              {
                id: 3,
                brand: { date: new Date(2000, 11, 1) },
              },
              {
                id: 4,
                brand: { date: new Date(2001, 0, 1) },
              },
              {
                id: 5,
                brand: { date: new Date(2002, 0, 1) },
              },
            ]}
            columns={[
              {
                field: 'brand',
                type: 'date',
                valueGetter: (params) => params.value.date,
                valueFormatter: (params) => params.value.toLocaleDateString('en-US'),
              },
            ]}
          />,
        );
        expect(getColumnValues()).to.deep.equal(expected);
      });
    });

    [
      {
        operatorValue: 'is',
        value: '2000-12-01',
        expected: ['12/1/2000, 12:00:00 AM', '12/1/2000, 8:30:00 AM'],
      },
      {
        operatorValue: 'not',
        value: '2000-12-01',
        expected: [
          '1/1/2001, 12:00:00 AM',
          '1/1/2001, 8:30:00 AM',
          '1/1/2002, 12:00:00 AM',
          '1/1/2002, 8:30:00 AM',
        ],
      },
      {
        operatorValue: 'after',
        value: '2001-01-01',
        expected: ['1/1/2002, 12:00:00 AM', '1/1/2002, 8:30:00 AM'],
      },
      {
        operatorValue: 'onOrAfter',
        value: '2001-01-01',
        expected: [
          '1/1/2001, 12:00:00 AM',
          '1/1/2001, 8:30:00 AM',
          '1/1/2002, 12:00:00 AM',
          '1/1/2002, 8:30:00 AM',
        ],
      },
      {
        operatorValue: 'before',
        value: '2001-01-01',
        expected: ['12/1/2000, 12:00:00 AM', '12/1/2000, 8:30:00 AM'],
      },
      {
        operatorValue: 'onOrBefore',
        value: '2001-01-01',
        expected: [
          '12/1/2000, 12:00:00 AM',
          '12/1/2000, 8:30:00 AM',
          '1/1/2001, 12:00:00 AM',
          '1/1/2001, 8:30:00 AM',
        ],
      },
    ].forEach(({ operatorValue, value, expected }) => {
      it(`should work with dates at different hours, operator ${operatorValue}`, () => {
        render(
          <TestCase
            value={value}
            operatorValue={operatorValue}
            rows={[
              {
                id: 3,
                brand: new Date(2000, 11, 1), // 12/1/2000, 12:00:00 AM
              },
              {
                id: 4,
                brand: new Date(2000, 11, 1, 8, 30), // 12/1/2000, 8:30:00 AM
              },
              {
                id: 5,
                brand: new Date(2001, 0, 1), // 1/1/2001, 12:00:00 AM
              },
              {
                id: 6,
                brand: new Date(2001, 0, 1, 8, 30), // 1/1/2001, 08:30:00 AM
              },
              {
                id: 7,
                brand: new Date(2002, 0, 1), // 1/1/2002, 12:00:00 AM
              },
              {
                id: 8,
                brand: new Date(2002, 0, 1, 8, 30), // 1/1/2002, 08:30:00 AM
              },
            ]}
            columns={[
              {
                field: 'brand',
                type: 'date',
                valueFormatter: (params) => params.value.toLocaleString('en-US'),
              },
            ]}
          />,
        );
        expect(getColumnValues()).to.deep.equal(expected);
      });
    });
  });

  describe('dateTime operators', () => {
    [
      {
        operatorValue: 'is',
        value: '2000-12-01T08:30',
        expected: ['12/1/2000, 8:30:15 AM'],
      },
      {
        operatorValue: 'not',
        value: '2000-12-01T08:30',
        expected: ['1/1/2001, 8:30:15 AM', '1/1/2002, 8:30:15 AM'],
      },
      {
        operatorValue: 'after',
        value: '2001-01-01T08:30',
        expected: ['1/1/2002, 8:30:15 AM'],
      },
      {
        operatorValue: 'onOrAfter',
        value: '2001-01-01T08:30',
        expected: ['1/1/2001, 8:30:15 AM', '1/1/2002, 8:30:15 AM'],
      },
      {
        operatorValue: 'before',
        value: '2001-01-01T08:30',
        expected: ['12/1/2000, 8:30:15 AM'],
      },
      {
        operatorValue: 'onOrBefore',
        value: '2001-01-01T08:30',
        expected: ['12/1/2000, 8:30:15 AM', '1/1/2001, 8:30:15 AM'],
      },
    ].forEach(({ operatorValue, value, expected }) => {
      it(`should work correctly with operatorValue=${operatorValue}`, () => {
        render(
          <TestCase
            value={value}
            operatorValue={operatorValue}
            rows={[
              {
                id: 3,
                brand: new Date(2000, 11, 1, 8, 30, 15, 20), // 12/1/2000, 8:30:15 AM
              },
              {
                id: 4,
                brand: new Date(2001, 0, 1, 8, 30, 15, 20), // 1/1/2001, 08:30:15 AM
              },
              {
                id: 5,
                brand: new Date(2002, 0, 1, 8, 30, 15, 20), // 1/1/2002, 08:30:15 AM
              },
            ]}
            columns={[
              {
                field: 'brand',
                type: 'dateTime',
                valueFormatter: (params) => params.value.toLocaleString('en-US'),
              },
            ]}
          />,
        );
        expect(getColumnValues()).to.deep.equal(expected);
      });
    });
  });

  describe('boolean operators', () => {
    it('should allow operator is', () => {
      const { setProps } = render(<TestCase value="a" operatorValue="contains" />);
      setProps({
        field: 'isPublished',
        operatorValue: 'is',
        value: 'false',
      });
      expect(getColumnValues()).to.deep.equal(['Nike']);
      setProps({
        field: 'isPublished',
        operatorValue: 'is',
        value: 'true',
      });
      expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
      setProps({
        field: 'isPublished',
        operatorValue: 'is',
        value: '',
      });
      expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    });
  });

  describe('singleSelect operators', () => {
    describe('simple options', () => {
      it('should allow operator is', () => {
        const { setProps } = render(<TestCase value="a" operatorValue="contains" />);
        setProps({
          field: 'country',
          operatorValue: 'is',
          value: 'United States',
        });
        expect(getColumnValues()).to.deep.equal(['Nike']);
        setProps({
          field: 'country',
          operatorValue: 'is',
          value: 'Germany',
        });
        expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
        setProps({
          field: 'country',
          operatorValue: 'is',
          value: '',
        });
        expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      });

      it('should allow operator not', () => {
        const { setProps } = render(<TestCase value="a" operatorValue="contains" />);
        setProps({
          field: 'country',
          operatorValue: 'not',
          value: 'United States',
        });
        expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
        setProps({
          field: 'country',
          operatorValue: 'not',
          value: 'Germany',
        });
        expect(getColumnValues()).to.deep.equal(['Nike']);
        setProps({
          field: 'country',
          operatorValue: 'not',
          value: '',
        });
        expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      });

      it('should work with numeric values', () => {
        const { setProps } = render(
          <TestCase
            rows={[
              { id: 1, name: 'Hair Dryer', voltage: 220 },
              { id: 2, name: 'Dishwasher', voltage: 110 },
              { id: 3, name: 'Microwave', voltage: 220 },
            ]}
            columns={[
              { field: 'name' },
              { field: 'voltage', type: 'singleSelect', valueOptions: [220, 110] },
            ]}
            field="voltage"
            operatorValue="is"
            state={{
              preferencePanel: {
                open: true,
                openedPanelValue: GridPreferencePanelsValue.filters,
              },
            }}
          />,
        );
        expect(getColumnValues()).to.deep.equal(['Hair Dryer', 'Dishwasher', 'Microwave']);
        setProps({ value: 220 });
        expect(getColumnValues()).to.deep.equal(['Hair Dryer', 'Microwave']);
      });
    });

    describe('complex options', () => {
      it('should allow operator is', () => {
        const { setProps } = render(<TestCase value="a" operatorValue="contains" />);
        setProps({
          field: 'status',
          operatorValue: 'is',
          value: 0,
        });
        expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas']);
        setProps({
          field: 'status',
          operatorValue: 'is',
          value: 2,
        });
        expect(getColumnValues()).to.deep.equal(['Puma']);
        setProps({
          field: 'status',
          operatorValue: 'is',
          value: '',
        });
        expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      });

      it('should allow operator not', () => {
        const { setProps } = render(<TestCase value="a" operatorValue="contains" />);
        setProps({
          field: 'status',
          operatorValue: 'not',
          value: 0,
        });
        expect(getColumnValues()).to.deep.equal(['Puma']);
        setProps({
          field: 'status',
          operatorValue: 'not',
          value: 2,
        });
        expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas']);
        setProps({
          field: 'status',
          operatorValue: 'not',
          value: '',
        });
        expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      });

      it('should work with numeric values', () => {
        const { setProps } = render(
          <TestCase
            field="status"
            operatorValue="is"
            state={{
              preferencePanel: {
                open: true,
                openedPanelValue: GridPreferencePanelsValue.filters,
              },
            }}
          />,
        );
        expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        setProps({ value: 2 });
        expect(getColumnValues()).to.deep.equal(['Puma']);
      });
    });
  });

  it('should support new dataset', () => {
    const { setProps } = render(<TestCase value="a" operatorValue="contains" />);
    expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
    setProps({
      rows: [
        {
          id: 0,
          country: 'France',
        },
        {
          id: 1,
          country: 'UK',
        },
        {
          id: 12,
          country: 'US',
        },
      ],
      columns: [{ field: 'country' }],
    });
    expect(getColumnValues()).to.deep.equal(['France', 'UK', 'US']);
  });

  it('should translate operators dynamically in toolbar without crashing ', () => {
    const Test = () => {
      return (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={[
              {
                id: 1,
                quantity: 1,
              },
            ]}
            columns={[{ field: 'quantity', type: 'number', width: 150 }]}
            filterModel={{
              items: [
                {
                  columnField: 'quantity',
                  id: 1619547587572,
                  operatorValue: '=',
                  value: '1',
                },
              ],
            }}
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </div>
      );
    };
    render(<Test />);
  });

  it('should apply the valueParser onto the filter value', () => {
    render(
      <TestCase
        rows={[
          {
            id: 1,
            amount: 0.5,
          },
          {
            id: 2,
            amount: 1,
          },
        ]}
        columns={[
          {
            field: 'amount',
            type: 'number',
            valueParser: (value) => (value as number) / 100,
          },
        ]}
        operatorValue="="
        value={50}
        field="amount"
      />,
    );
    expect(getColumnValues()).to.deep.equal(['0.5']);
  });

  it('should include value-less operators when displaying the number of active filters', () => {
    const rows = [
      {
        id: 0,
        brand: 'Nike',
        country: 'United States',
      },
      {
        id: 1,
        brand: 'Adidas',
        country: null,
      },
      {
        id: 2,
        brand: 'Puma',
        country: '',
      },
    ];
    render(
      <TestCase
        operatorValue="isNotEmpty"
        field="country"
        columns={[{ field: 'brand' }, { field: 'country' }]}
        rows={rows}
      />,
    );
    expect(screen.queryByTitle('1 active filter')).not.to.equal(null);
  });
});
