import * as React from 'react';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  screen,
  // @ts-expect-error need to migrate helpers to TypeScript
  waitFor,
} from 'test/utils';
import { expect } from 'chai';
import {
  DataGrid,
  DataGridProps,
  DEFAULT_GRID_OPTIONS,
  GridRowsProp,
} from '@material-ui/data-grid';
import { getColumnValues, getRows } from 'test/utils/helperFn';
import { spy } from 'sinon';
import { useData } from 'packages/storybook/src/hooks/useData';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Pagination', () => {
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

  describe('pagination', () => {
    it('should apply the page prop correctly', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...baselineProps} page={1} pageSize={1} />
        </div>,
      );
      expect(getColumnValues()).to.deep.equal(['Adidas']);
    });

    it('should react to an update of rowCount', () => {
      const Test = (props) => {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...baselineProps} rowCount={5} {...props} />
          </div>
        );
      };

      const { setProps } = render(<Test />);
      expect(document.querySelector('.MuiTablePagination-root')).to.have.text(
        'Rows per page:1001-5 of 5',
      );
      setProps({ rowCount: 21 });
      expect(document.querySelector('.MuiTablePagination-root')).to.have.text(
        'Rows per page:1001-21 of 21',
      );
    });

    it('should trigger onPageChange when clicking on next page', () => {
      const onPageChange = spy();

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...baselineProps} onPageChange={onPageChange} pageSize={1} />
        </div>,
      );
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(onPageChange.callCount).to.equal(1);

      fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
      expect(onPageChange.callCount).to.equal(2);
    });

    it('should trigger onPageChange with correct page param when page prop is supplied i.e in controlled mode', () => {
      const onPageChange = spy();

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...baselineProps} page={1} onPageChange={onPageChange} pageSize={1} />
        </div>,
      );

      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(onPageChange.lastCall.args[0].page).to.equal(2);
      fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
      expect(onPageChange.lastCall.args[0].page).to.equal(0);
    });

    it('should trigger onPageChange when clicking on next page in Server mode', () => {
      const onPageChange = spy();

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            onPageChange={onPageChange}
            pageSize={1}
            paginationMode="server"
          />
        </div>,
      );
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(onPageChange.callCount).to.equal(1);
      fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
      expect(onPageChange.callCount).to.equal(2);
    });

    it('should not trigger onPageChange on initialisation or on page prop change', () => {
      const onPageChange = spy();

      function Test(props: Partial<DataGridProps>) {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...baselineProps} {...props} />
          </div>
        );
      }

      const { setProps } = render(<Test page={1} pageSize={1} onPageChange={onPageChange} />);
      expect(onPageChange.callCount).to.equal(0);
      setProps({ page: 2 });
      expect(onPageChange.callCount).to.equal(0);
    });

    it('should not trigger onPageSizeChange on initialisation or on pageSize prop change', () => {
      const onPageSizeChange = spy();

      function Test(props: Partial<DataGridProps>) {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...baselineProps} {...props} />
          </div>
        );
      }

      const { setProps } = render(
        <Test onPageSizeChange={onPageSizeChange} pageSize={1} page={1} />,
      );
      expect(onPageSizeChange.callCount).to.equal(0);
      setProps({ pageSize: 2 });
      expect(onPageSizeChange.callCount).to.equal(0);
    });

    it('should support server side pagination', () => {
      const ServerPaginationGrid = () => {
        const [page, setPage] = React.useState(0);
        const [rows, setRows] = React.useState<GridRowsProp>([]);

        const handlePageChange = (params) => {
          setPage(params.page);
        };

        React.useEffect(() => {
          let active = true;

          (async () => {
            const newRows = [
              {
                id: page,
                brand: `Nike ${page}`,
              },
            ];

            if (!active) {
              return;
            }

            setRows(newRows);
          })();

          return () => {
            active = false;
          };
        }, [page]);

        return (
          <div style={{ height: 300, width: 300 }}>
            <DataGrid
              {...baselineProps}
              rows={rows}
              pagination
              pageSize={1}
              rowCount={3}
              paginationMode="server"
              onPageChange={handlePageChange}
            />
          </div>
        );
      };

      render(<ServerPaginationGrid />);
      expect(getColumnValues()).to.deep.equal(['Nike 0']);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getColumnValues()).to.deep.equal(['Nike 1']);
    });

    it('should not change the page when clicking on the next page and a page prop is provided', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...baselineProps} page={0} pageSize={1} />
        </div>,
      );
      expect(getColumnValues()).to.deep.equal(['Nike']);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getColumnValues()).to.deep.equal(['Nike']);
    });

    it('should show filtered data if the user applies filter on an intermediate page and the resulted filter data is less than the rows per page', () => {
      const TestCasePaginationFilteredData = () => {
        const data = useData(200, 2);

        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid
              autoHeight={isJSDOM}
              columns={data.columns}
              rows={data.rows}
              pagination
              page={1}
              pageSize={25}
              filterModel={{
                items: [
                  {
                    columnField: 'currencyPair',
                    value: 'BTCUSD',
                    operatorValue: 'equals',
                  },
                ],
              }}
            />
          </div>
        );
      };
      render(<TestCasePaginationFilteredData />);
      expect(getColumnValues(1)).to.deep.equal(['BTCUSD', 'BTCUSD', 'BTCUSD', 'BTCUSD']);
    });

    describe('prop: autoPageSize', () => {
      before(function beforeHook() {
        if (isJSDOM) {
          // Need layouting
          this.skip();
        }
      });

      it('should always render the same amount of rows and fit the viewport', () => {
        const TestCaseAutoPageSize = (props: { nbRows: number; height?: number }) => {
          const data = useData(props.nbRows, 10);

          return (
            <div style={{ width: 300, height: props.height }}>
              <DataGrid columns={data.columns} rows={data.rows} autoPageSize pagination />
            </div>
          );
        };
        const nbRows = 27;
        const height = 780;
        render(<TestCaseAutoPageSize nbRows={nbRows} height={height} />);

        const footerHeight = document.querySelector('.MuiDataGrid-footerContainer')!.clientHeight;
        const expectedViewportRowsLength = Math.floor(
          (height - DEFAULT_GRID_OPTIONS.headerHeight - footerHeight) /
            DEFAULT_GRID_OPTIONS.rowHeight,
        );

        let rows = getRows();
        expect(rows.length).to.equal(expectedViewportRowsLength);

        fireEvent.click(screen.getByRole('button', { name: /next page/i }));
        rows = getRows();
        expect(rows.length).to.equal(expectedViewportRowsLength);

        fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
        rows = getRows();
        expect(rows.length).to.equal(expectedViewportRowsLength);

        fireEvent.click(screen.getByRole('button', { name: /next page/i }));
        fireEvent.click(screen.getByRole('button', { name: /next page/i }));
        rows = getRows();
        expect(rows.length).to.equal(nbRows % expectedViewportRowsLength);

        // make sure there is no more pages.
        const nextPageBtn = document.querySelector('.MuiTablePagination-actions button:last-child');
        expect(nextPageBtn!.getAttribute('disabled')).to.not.equal(
          null,
          'next page should be disabled.',
        );
      });

      it('should be compatible with controlled page', () => {
        const rows = [
          { id: 1, x: 1 },
          { id: 2, x: 2 },
          { id: 3, x: 3 },
          { id: 4, x: 4 },
          { id: 5, x: 5 },
          { id: 6, x: 6 },
          { id: 7, x: 7 },
          { id: 8, x: 8 },
        ];
        const columns = [{ field: 'x', type: 'number' }];
        render(
          <div style={{ height: 300, width: 400 }}>
            <DataGrid pagination autoPageSize rows={rows} columns={columns} page={2} />
          </div>,
        );
        expect(getColumnValues(0)).to.deep.equal(['7', '8']);
      });

      it('should update the amount of rows rendered and call onPageSizeChange when changing the table height', async () => {
        const onPageSizeChange = spy();

        const TestCaseAutoPageSize = (props: { nbRows: number; height?: number }) => {
          const data = useData(props.nbRows, 10);

          return (
            <div style={{ width: 300, height: props.height }}>
              <DataGrid
                columns={data.columns}
                rows={data.rows}
                autoPageSize
                pagination
                onPageSizeChange={onPageSizeChange}
              />
            </div>
          );
        };

        const nbRows = 27;
        const heightBefore = 780;
        const heightAfter = 360;

        const { setProps } = render(<TestCaseAutoPageSize nbRows={nbRows} height={heightBefore} />);

        const footerHeight = document.querySelector('.MuiDataGrid-footerContainer')!.clientHeight;
        const expectedViewportRowsLengthBefore = Math.floor(
          (heightBefore - DEFAULT_GRID_OPTIONS.headerHeight - footerHeight) /
            DEFAULT_GRID_OPTIONS.rowHeight,
        );
        const expectedViewportRowsLengthAfter = Math.floor(
          (heightAfter - DEFAULT_GRID_OPTIONS.headerHeight - footerHeight) /
            DEFAULT_GRID_OPTIONS.rowHeight,
        );

        let rows = document.querySelectorAll('.MuiDataGrid-viewport [role="row"]');
        expect(rows.length).to.equal(expectedViewportRowsLengthBefore);

        setProps({ height: heightAfter });

        await waitFor(() =>
          expect(document.querySelector('.MuiTablePagination-caption')!.innerHTML).to.equal(
            `1-${expectedViewportRowsLengthAfter} of ${nbRows}`,
          ),
        );

        rows = document.querySelectorAll('.MuiDataGrid-viewport [role="row"]');
        expect(rows.length).to.equal(expectedViewportRowsLengthAfter);

        expect(onPageSizeChange.lastCall.args[0].pageSize).to.equal(
          expectedViewportRowsLengthAfter,
        );
      });
    });
  });
});
