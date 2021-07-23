import * as React from 'react';
import PropTypes from 'prop-types';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  ErrorBoundary,
} from 'test/utils';
import { useFakeTimers, stub } from 'sinon';
import { expect } from 'chai';
import {
  DataGrid,
  GridValueGetterParams,
  GridToolbar,
  DataGridProps,
} from '@material-ui/data-grid';
import { useData } from 'packages/storybook/src/hooks/useData';
import { getColumnHeaderCell, getColumnValues, raf } from 'test/utils/helperFn';

describe('<DataGrid /> - Layout & Warnings', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const baselineProps = {
    rows: [
      {
        id: 0,
        brand: 'Nike',
      },
      {
        id: 1,
        brand: 'Adidas',
      },
      {
        id: 2,
        brand: 'Puma',
      },
    ],
    columns: [{ field: 'brand' }],
  };

  it('should throw an error if rows props is being mutated', () => {
    expect(() => {
      // We don't want to freeze baselineProps.rows
      const rows = [...baselineProps.rows];
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...baselineProps} rows={rows} />
        </div>,
      );
      rows.push({ id: 3, brand: 'Louis Vuitton' });
    }).to.throw();
  });

  describe('Layout', () => {
    let clock;

    beforeEach(() => {
      clock = useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    before(function beforeHook() {
      if (/jsdom/.test(window.navigator.userAgent)) {
        // Need layouting
        this.skip();
      }
    });

    it('should resize the width of the columns', async () => {
      clock.restore();
      interface TestCaseProps {
        width?: number;
      }
      const TestCase = (props: TestCaseProps) => {
        const { width = 300 } = props;
        return (
          <div style={{ width, height: 300 }}>
            <DataGrid {...baselineProps} />
          </div>
        );
      };

      const { container, setProps } = render(<TestCase width={300} />);
      let rect;
      rect = container.querySelector('[role="row"][data-rowindex="0"]').getBoundingClientRect();
      expect(rect.width).to.equal(300 - 2);

      setProps({ width: 400 });
      await raf();

      rect = container.querySelector('[role="row"][data-rowindex="0"]').getBoundingClientRect();
      expect(rect.width).to.equal(400 - 2);
    });

    // Adapation of describeConformance()
    describe('Material-UI component API', () => {
      it(`attaches the ref`, () => {
        const ref = React.createRef<HTMLDivElement>();
        const { container } = render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...baselineProps} ref={ref} />
          </div>,
        );
        expect(ref.current).to.be.instanceof(window.HTMLDivElement);
        expect(ref.current).to.equal(container.firstChild.firstChild);
      });

      describe('Apply the `classes` prop', () => {
        it("should apply the `root` rule name's value as a class to the root grid component", () => {
          const classes = {
            root: 'my_class_name',
          };

          const { container } = render(
            <div style={{ width: 300, height: 300 }}>
              <DataGrid {...baselineProps} classes={{ root: classes.root }} />
            </div>,
          );

          expect(container.firstChild.firstChild).to.have.class(classes.root);
        });
      });

      it('applies the className to the root component', () => {
        function randomStringValue() {
          return `r${Math.random().toString(36).slice(2)}`;
        }

        const className = randomStringValue();

        const { container } = render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...baselineProps} className={className} />
          </div>,
        );

        expect(document.querySelector(`.${className}`)).to.equal(container.firstChild.firstChild);
      });

      it('should support columns.valueGetter', () => {
        const columns = [
          { field: 'id', hide: true },
          { field: 'firstName', hide: true },
          { field: 'lastName', hide: true },
          {
            field: 'fullName',
            valueGetter: (params) =>
              `${params.getValue(params.id, 'firstName') || ''} ${
                params.getValue(params.id, 'lastName') || ''
              }`,
          },
        ];

        const rows = [
          { id: 1, lastName: 'Snow', firstName: 'Jon' },
          { id: 2, lastName: 'Lannister', firstName: 'Cersei' },
        ];
        render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid rows={rows} columns={columns} />
          </div>,
        );
        expect(getColumnValues()).to.deep.equal(['Jon Snow', 'Cersei Lannister']);
      });
    });

    describe('warnings', () => {
      it('should warn if the container has no intrinsic height', () => {
        expect(() => {
          render(
            <div style={{ width: 300, height: 0 }}>
              <DataGrid {...baselineProps} />
            </div>,
          );
          // Use timeout to allow simpler tests in JSDOM.
          clock.tick(0);
          // @ts-expect-error need to migrate helpers to TypeScript
        }).toWarnDev(
          'Material-UI: useResizeContainer - The parent of the grid has an empty height.',
        );
      });

      it('should warn if the container has no intrinsic width', () => {
        expect(() => {
          render(
            <div style={{ width: 0 }}>
              <div style={{ width: '100%', height: 300 }}>
                <DataGrid {...baselineProps} />
              </div>
            </div>,
          );
          // Use timeout to allow simpler tests in JSDOM.
          clock.tick(0);
          // @ts-expect-error need to migrate helpers to TypeScript
        }).toWarnDev(
          'Material-UI: useResizeContainer - The parent of the grid has an empty width.',
        );
      });

      it('should warn when GridCellParams.valueGetter is called with a missing column', () => {
        const rows = [
          { id: 1, age: 1 },
          { id: 2, age: 2 },
        ];
        const columns = [
          { field: 'id', hide: true },
          {
            field: 'fullName',
            valueGetter: (params: GridValueGetterParams) => params.getValue(params.id, 'age'),
          },
        ];
        expect(() => {
          render(
            <div style={{ width: 300, height: 300 }}>
              <DataGrid rows={rows} columns={columns} />
            </div>,
          );
          // @ts-expect-error need to migrate helpers to TypeScript
        }).toWarnDev(["You are calling getValue('age') but the column `age` is not defined"]);
        expect(getColumnValues()).to.deep.equal(['1', '2']);
      });
    });

    describe('swallow warnings', () => {
      beforeEach(() => {
        stub(console, 'warn');
      });

      afterEach(() => {
        // @ts-expect-error beforeEach side effect
        console.warn.restore();
      });

      it('should have a stable height if the parent container has no intrinsic height', () => {
        const { getByRole } = render(
          <div>
            <p>The table keeps growing... and growing...</p>
            <DataGrid {...baselineProps} />
          </div>,
        );
        const firstHeight = getByRole('grid').clientHeight;
        clock.tick(10);
        const secondHeight = getByRole('grid').clientHeight;
        expect(firstHeight).to.equal(secondHeight);
      });
    });

    describe('column width', () => {
      it('should set the columns width to 100px by default', () => {
        const rows = [
          {
            id: 1,
            username: 'John Doe',
            age: 30,
          },
        ];

        const columns = [
          {
            field: 'id',
          },
          {
            field: 'name',
          },
          {
            field: 'age',
          },
        ];

        const { getAllByRole } = render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid columns={columns} rows={rows} />
          </div>,
        );

        getAllByRole('columnheader').forEach((col) => {
          // @ts-expect-error need to migrate helpers to TypeScript
          expect(col).toHaveInlineStyle({ width: '100px' });
        });
      });

      it('should set the columns width value to what is provided', () => {
        const rows = [
          {
            id: 1,
            username: 'John Doe',
            age: 30,
          },
        ];

        const colWidthValues = [50, 50, 200];
        const columns = [
          {
            field: 'id',
            width: colWidthValues[0],
          },
          {
            field: 'name',
            width: colWidthValues[1],
          },
          {
            field: 'age',
            width: colWidthValues[2],
          },
        ];

        const { getAllByRole } = render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid columns={columns} rows={rows} />
          </div>,
        );

        getAllByRole('columnheader').forEach((col, index) => {
          // @ts-expect-error need to migrate helpers to TypeScript
          expect(col).toHaveInlineStyle({ width: `${colWidthValues[index]}px` });
        });
      });

      it('should set the first column to be twice as wide as the second one', () => {
        const rows = [
          {
            id: 1,
            username: 'John Doe',
          },
        ];

        const columns = [
          {
            field: 'id',
            flex: 1,
          },
          {
            field: 'name',
            flex: 0.5,
          },
        ];

        render(
          <div style={{ width: 602, height: 300 }}>
            <DataGrid columns={columns} rows={rows} />
          </div>,
        );

        const firstColumn = getColumnHeaderCell(0);
        const secondColumn = getColumnHeaderCell(1);
        const secondColumnWidthVal = secondColumn.style.width.split('px')[0];
        // @ts-expect-error need to migrate helpers to TypeScript
        expect(firstColumn).toHaveInlineStyle({
          width: `${2 * Number(secondColumnWidthVal)}px`,
        });
      });

      it('should respect minWidth when a column is fluid', () => {
        const rows = [
          {
            id: 1,
            username: 'John Doe',
          },
        ];

        const columns = [
          {
            field: 'id',
            flex: 1,
            minWidth: 150,
          },
          {
            field: 'name',
            flex: 0.5,
          },
        ];

        render(
          <div style={{ width: 200, height: 300 }}>
            <DataGrid columns={columns} rows={rows} />
          </div>,
        );

        const firstColumn = getColumnHeaderCell(0);
        // @ts-expect-error need to migrate helpers to TypeScript
        expect(firstColumn).toHaveInlineStyle({
          width: '150px',
        });
      });

      it('should handle hidden columns', () => {
        const rows = [{ id: 1, firstName: 'Jon' }];
        const columns = [
          { field: 'id', headerName: 'ID', flex: 1 },
          {
            field: 'firstName',
            headerName: 'First name',
            hide: true,
          },
        ];

        render(
          <div style={{ width: 200, height: 300 }}>
            <DataGrid rows={rows} columns={columns} />
          </div>,
        );

        const firstColumn = getColumnHeaderCell(0);
        // @ts-expect-error need to migrate helpers to TypeScript
        expect(firstColumn).toHaveInlineStyle({
          width: '198px', // because of the 2px border
        });
      });

      it('should resize flex: 1 column when setting hide: false on a column to avoid exceeding grid width', () => {
        const TestCase = (props: DataGridProps) => (
          <div style={{ width: 300, height: 500 }}>
            <DataGrid {...props} />
          </div>
        );

        const { setProps } = render(
          <TestCase
            rows={[
              {
                id: 1,
                first: 'Mike',
                age: 11,
              },
              {
                id: 2,
                first: 'Jack',
                age: 11,
              },
              {
                id: 3,
                first: 'Mike',
                age: 20,
              },
            ]}
            columns={[
              { field: 'id', flex: 1 },
              { field: 'first', width: 100 },
              { field: 'age', width: 50, hide: true },
            ]}
          />,
        );

        let firstColumn = document.querySelector('[role="columnheader"][aria-colindex="1"]');
        // @ts-expect-error need to migrate helpers to TypeScript
        expect(firstColumn).toHaveInlineStyle({
          width: '198px', // because of the 2px border
        });

        setProps({
          columns: [
            { field: 'clientId', flex: 1 },
            { field: 'first', width: 100 },
            { field: 'age', width: 50 },
          ],
        });

        firstColumn = document.querySelector('[role="columnheader"][aria-colindex="1"]');
        // @ts-expect-error need to migrate helpers to TypeScript
        expect(firstColumn).toHaveInlineStyle({
          width: '148px', // because of the 2px border
        });
      });

      it('should be rerender invariant', () => {
        const Test = () => {
          const columns = [{ field: 'id', headerName: 'ID', flex: 1 }];
          return (
            <div style={{ width: 200, height: 300 }}>
              <DataGrid rows={[]} columns={columns} />
            </div>
          );
        };

        const { setProps } = render(<Test />);
        setProps();

        const firstColumn = getColumnHeaderCell(0);
        // @ts-expect-error need to migrate helpers to TypeScript
        expect(firstColumn).toHaveInlineStyle({
          width: '198px', // because of the 2px border
        });
      });

      it('should set the columns width so that if fills the remaining width when "checkboxSelection" is used and the columns have "flex" set', () => {
        const rows = [
          {
            id: 1,
            username: 'John Doe',
          },
        ];

        const columns = [
          {
            field: 'id',
            flex: 1,
          },
          {
            field: 'name',
            flex: 0.5,
          },
        ];

        const totalWidth = 700;

        render(
          <div style={{ width: totalWidth, height: 300 }}>
            <DataGrid columns={columns} rows={rows} checkboxSelection />
          </div>,
        );

        expect(
          Array.from(document.querySelectorAll('[role="columnheader"]')).reduce(
            (width, item) => width + item.clientWidth,
            0,
          ),
        ).to.equal(totalWidth - 2);
      });
    });

    it('should have the correct intrinsic height when autoHeight={true}', () => {
      render(
        <div style={{ width: 300 }}>
          <DataGrid {...baselineProps} headerHeight={40} rowHeight={30} autoHeight />
        </div>,
      );
      expect(document.querySelector('.MuiDataGrid-main')!.clientHeight).to.equal(
        40 + 30 * baselineProps.rows.length,
      );
    });

    // A function test counterpart of ScrollbarOverflowVerticalSnap.
    it('should not have a horizontal scrollbar if not needed', () => {
      const TestCase = () => {
        const data = useData(100, 1);
        return (
          <div style={{ width: 500, height: 300 }}>
            <DataGrid {...data} />
          </div>
        );
      };
      render(<TestCase />);
      const gridWindow = document.querySelector('.MuiDataGrid-window');
      // It should not have a horizontal scrollbar
      expect(gridWindow!.scrollWidth - gridWindow!.clientWidth).to.equal(0);
    });
  });

  describe('warnings', () => {
    before(() => {
      PropTypes.resetWarningCache();
    });

    it('should raise a warning if trying to use an enterprise feature', () => {
      expect(() => {
        PropTypes.checkPropTypes(
          // @ts-ignore
          DataGrid.propTypes,
          {
            pagination: false,
            columns: [],
            rows: [],
          },
          'prop',
          'MockedDataGrid',
        );
        // @ts-expect-error need to migrate helpers to TypeScript
      }).toErrorDev('Material-UI: `<DataGrid pagination={false} />` is not a valid prop.');
    });

    it('should throw if the rows has no id', function test() {
      // TODO is this fixed?
      if (!/jsdom/.test(window.navigator.userAgent)) {
        // can't catch render errors in the browser for unknown reason
        // tried try-catch + error boundary + window onError preventDefault
        this.skip();
      }

      const rows = [
        {
          brand: 'Nike',
        },
      ];

      const errorRef = React.createRef();
      expect(() => {
        render(
          <ErrorBoundary ref={errorRef}>
            <DataGrid {...baselineProps} rows={rows} />
          </ErrorBoundary>,
        );
        // @ts-expect-error need to migrate helpers to TypeScript
      }).toErrorDev([
        'The data grid component requires all rows to have a unique id property',
        'The above error occurred in the <ForwardRef(GridComponent)> component',
      ]);
      expect((errorRef.current as any).errors).to.have.length(1);
      expect((errorRef.current as any).errors[0].toString()).to.include(
        'The data grid component requires all rows to have a unique id property',
      );
    });
  });

  describe('localeText', () => {
    it('should replace the density selector button label text to "Size"', () => {
      const { getByText } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            components={{
              Toolbar: GridToolbar,
            }}
            localeText={{ toolbarDensity: 'Size' }}
          />
        </div>,
      );

      expect(getByText('Size')).not.to.equal(null);
    });
  });

  describe('Error', () => {
    it('should display error message when error prop set', () => {
      const message = 'Error can also be set in props!';
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid {...baselineProps} error={{ message }} />
        </div>,
      );
      expect(document.querySelectorAll('.MuiDataGrid-overlay')[0].textContent).to.equal(message);
    });
  });
});
