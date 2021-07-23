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
  GridLinkOperator,
  GridRowsProp,
} from '@material-ui/data-grid';
import { getColumnValues, getRows } from 'test/utils/helperFn';
import { spy } from 'sinon';
import { useData } from 'packages/storybook/src/hooks/useData';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Pagination', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const BaselineTestCase = (
    props: Omit<DataGridProps, 'rows' | 'columns'> & { height?: number },
  ) => {
    const { height = 300, ...other } = props;

    const basicData = useData(20, 2);

    return (
      <div style={{ width: 300, height }}>
        <DataGrid {...basicData} autoHeight={isJSDOM} pagination {...other} />
      </div>
    );
  };

  describe('prop: page and onPageChange', () => {
    it('should display the rows of page given in props', () => {
      render(<BaselineTestCase page={1} pageSize={1} />);
      expect(getColumnValues()).to.deep.equal(['1']);
    });

    it('should not call onPageChange on initialisation or on page prop change', () => {
      const onPageChange = spy();

      const { setProps } = render(
        <BaselineTestCase page={0} pageSize={1} onPageChange={onPageChange} />,
      );

      expect(onPageChange.callCount).to.equal(0);
      setProps({ page: 2 });

      expect(onPageChange.callCount).to.equal(0);
    });

    it('should allow to update the page from the outside', () => {
      const { setProps } = render(<BaselineTestCase pageSize={1} page={0} />);
      expect(getColumnValues()).to.deep.equal(['0']);
      setProps({ page: 1 });
      expect(getColumnValues()).to.deep.equal(['1']);
    });

    it('should apply new page when clicking on next / previous button and onPageChange is not defined and page is not controlled', () => {
      render(<BaselineTestCase pageSize={1} />);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getColumnValues()).to.deep.equal(['1']);

      fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
      expect(getColumnValues()).to.deep.equal(['0']);
    });

    it('should call onPageChange and apply new page when clicking on next / previous button and page is not controlled', () => {
      const onPageChange = spy();

      render(<BaselineTestCase onPageChange={onPageChange} pageSize={1} />);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(onPageChange.callCount).to.equal(1);
      expect(onPageChange.lastCall.args[0]).to.equal(1);
      expect(getColumnValues()).to.deep.equal(['1']);

      fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
      expect(onPageChange.callCount).to.equal(2);
      expect(onPageChange.lastCall.args[0]).to.equal(0);
      expect(getColumnValues()).to.deep.equal(['0']);
    });

    it('should call onPageChange with the correct page when clicking on next / previous button when page is controlled', () => {
      const onPageChange = spy();

      render(<BaselineTestCase page={1} onPageChange={onPageChange} pageSize={1} />);

      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(onPageChange.lastCall.args[0]).to.equal(2);
      expect(getColumnValues()).to.deep.equal(['1']);

      fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
      expect(onPageChange.lastCall.args[0]).to.equal(0);
      expect(getColumnValues()).to.deep.equal(['1']);
    });

    it('should call onPageChange when clicking on next / previous button in "server" mode', () => {
      const onPageChange = spy();

      render(<BaselineTestCase onPageChange={onPageChange} pageSize={1} paginationMode="server" />);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(onPageChange.callCount).to.equal(1);
      expect(onPageChange.lastCall.args[0]).to.equal(1);
      fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
      expect(onPageChange.lastCall.args[0]).to.equal(0);
    });

    it('should not change the page state when clicking on next button and a page prop is provided', () => {
      render(<BaselineTestCase page={0} pageSize={1} />);
      expect(getColumnValues()).to.deep.equal(['0']);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getColumnValues()).to.deep.equal(['0']);
    });

    it('should control page state when the prop and the onChange are set', () => {
      const ControlCase = () => {
        const [page, setPage] = React.useState(0);

        return (
          <BaselineTestCase page={page} onPageChange={(newPage) => setPage(newPage)} pageSize={1} />
        );
      };

      render(<ControlCase />);

      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getColumnValues()).to.deep.equal(['1']);

      fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
      expect(getColumnValues()).to.deep.equal(['0']);
    });

    it('should go to last page when page is controlled and the current page is greater than the last page', async () => {
      const TestCasePaginationFilteredData = () => {
        const [page, setPage] = React.useState(1);

        return (
          <BaselineTestCase
            pagination
            page={page}
            onPageChange={(newPage) => setPage(newPage)}
            pageSize={5}
            filterModel={{
              linkOperator: GridLinkOperator.And,
              items: [
                {
                  columnField: 'id',
                  operatorValue: '<=',
                  value: '3',
                },
              ],
            }}
          />
        );
      };
      render(<TestCasePaginationFilteredData />);

      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3']);
    });
  });

  describe('prop: pageSize and onPageSizeChange', () => {
    it('should display the amount of rows given in props', () => {
      render(<BaselineTestCase page={0} pageSize={2} />);
      expect(getColumnValues()).to.deep.equal(['0', '1']);
    });

    it('should not call onPageSizeChange on initialisation or on pageSize prop change', () => {
      const onPageSizeChange = spy();

      const { setProps } = render(
        <BaselineTestCase onPageSizeChange={onPageSizeChange} pageSize={1} page={1} />,
      );
      expect(onPageSizeChange.callCount).to.equal(0);
      setProps({ pageSize: 2 });
      expect(onPageSizeChange.callCount).to.equal(0);
    });

    it('should allow to update the pageSize from the outside', () => {
      const onPageSizeChange = spy();

      const { setProps } = render(
        <BaselineTestCase onPageSizeChange={onPageSizeChange} pageSize={1} page={0} />,
      );
      expect(getColumnValues()).to.deep.equal(['0']);
      setProps({ pageSize: 2 });
      expect(getColumnValues()).to.deep.equal(['0', '1']);
    });

    it('should allow to update both the page and pageSize from the outside at once', () => {
      const { setProps } = render(<BaselineTestCase pageSize={1} page={0} />);
      expect(getColumnValues()).to.deep.equal(['0']);
      setProps({ page: 1, pageSize: 2 });
      expect(getColumnValues()).to.deep.equal(['2', '3']);
    });

    it('should apply the new pageSize when clicking on a page size option and onPageSizeChanged is not defined and pageSize is not controlled', () => {
      render(<BaselineTestCase rowsPerPageOptions={[1, 2, 3, 100]} />);
      fireEvent.mouseDown(document.querySelector('.MuiSelect-selectMenu'));
      expect(screen.queryAllByRole('option').length).to.equal(4);

      fireEvent.click(screen.queryAllByRole('option')[1]);
      expect(getColumnValues()).to.deep.equal(['0', '1']);
    });

    it('should call onPageChange and apply the new pageSize when clicking on a page size option and pageSize is not controlled', () => {
      const onPageSizeChange = spy();

      render(
        <BaselineTestCase
          onPageSizeChange={onPageSizeChange}
          rowsPerPageOptions={[1, 2, 3, 100]}
        />,
      );
      fireEvent.mouseDown(document.querySelector('.MuiSelect-selectMenu'));
      expect(screen.queryAllByRole('option').length).to.equal(4);

      fireEvent.click(screen.queryAllByRole('option')[1]);
      expect(onPageSizeChange.callCount).to.equal(1);
      expect(onPageSizeChange.lastCall.args[0]).to.equal(2);
      expect(getColumnValues()).to.deep.equal(['0', '1']);
    });

    it('should call onPageSizeChange with the correct page when clicking on a page size option when pageSize is controlled', () => {
      const onPageSizeChange = spy();

      render(
        <BaselineTestCase
          onPageSizeChange={onPageSizeChange}
          pageSize={1}
          page={0}
          rowsPerPageOptions={[1, 2, 3]}
        />,
      );

      fireEvent.mouseDown(document.querySelector('.MuiSelect-selectMenu'));
      expect(screen.queryAllByRole('option').length).to.equal(3);

      fireEvent.click(screen.queryAllByRole('option')[1]);
      expect(onPageSizeChange.callCount).to.equal(1);
      expect(onPageSizeChange.lastCall.args[0]).to.equal(2);
    });

    it('should not change the pageSize state when clicking on a page size option when pageSize prop is provided', () => {
      render(<BaselineTestCase pageSize={1} page={0} rowsPerPageOptions={[1, 2, 3]} />);

      fireEvent.mouseDown(document.querySelector('.MuiSelect-selectMenu'));
      expect(screen.queryAllByRole('option').length).to.equal(3);

      fireEvent.click(screen.queryAllByRole('option')[1]);
      expect(getColumnValues()).to.deep.equal(['0']);
    });

    it('should control pageSize state when the prop and the onChange are set', () => {
      const ControlCase = () => {
        const [pageSize, setPageSize] = React.useState(1);

        return (
          <BaselineTestCase
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            page={0}
            rowsPerPageOptions={[1, 2, 3]}
          />
        );
      };

      render(<ControlCase />);

      fireEvent.mouseDown(document.querySelector('.MuiSelect-selectMenu'));
      expect(screen.queryAllByRole('option').length).to.equal(3);

      fireEvent.click(screen.queryAllByRole('option')[1]);
      expect(getColumnValues()).to.deep.equal(['0', '1']);
    });
  });

  describe('prop: autoPageSize', () => {
    before(function beforeHook() {
      if (isJSDOM) {
        // Need layouting
        this.skip();
      }
    });

    const TestCaseAutoPageSize = (
      props: Omit<DataGridProps, 'rows' | 'columns'> & { height: number; nbRows: number },
    ) => {
      const { height, nbRows, ...other } = props;

      const data = useData(nbRows, 10);

      return (
        <div style={{ width: 300, height: props.height }}>
          <DataGrid columns={data.columns} rows={data.rows} autoPageSize pagination {...other} />
        </div>
      );
    };

    it('should give priority to the controlled pageSize', () => {
      render(<BaselineTestCase autoPageSize pageSize={1} />);
      expect(getColumnValues(0)).to.deep.equal(['0']);
    });

    it('should be compatible with controlled page', () => {
      render(<BaselineTestCase autoPageSize page={2} />);
      expect(getColumnValues(0)).to.deep.equal(['6', '7', '8']);
    });

    it('should always render the same amount of rows and fit the viewport', () => {
      const nbRows = 27;
      const height = 780;
      render(<TestCaseAutoPageSize nbRows={nbRows} height={height} />);

      const footerHeight = document.querySelector('.MuiDataGrid-footerContainer')!.clientHeight;
      const expectedFullPageRowsLength = Math.floor(
        (height - DEFAULT_GRID_OPTIONS.headerHeight - footerHeight) /
          DEFAULT_GRID_OPTIONS.rowHeight,
      );

      let rows = getRows();
      expect(rows.length).to.equal(Math.min(expectedFullPageRowsLength, nbRows));

      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      rows = getRows();
      expect(rows.length).to.equal(
        Math.min(expectedFullPageRowsLength, nbRows - expectedFullPageRowsLength),
      );

      fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
      rows = getRows();
      expect(rows.length).to.equal(Math.min(expectedFullPageRowsLength, nbRows));

      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      rows = getRows();

      expect(rows.length).to.equal(
        Math.min(expectedFullPageRowsLength, nbRows - 2 * expectedFullPageRowsLength),
      );

      // make sure there is no more pages.
      const nextPageBtn = document.querySelector('.MuiTablePagination-actions button:last-child');
      expect(nextPageBtn!.getAttribute('disabled')).to.not.equal(
        null,
        'next page should be disabled.',
      );
    });

    it('should update the amount of rows rendered and call onPageSizeChange when changing the table height', async () => {
      const onPageSizeChange = spy();

      const nbRows = 27;

      const heightBefore = 780;
      const heightAfter = 360;

      const { setProps } = render(
        <TestCaseAutoPageSize
          nbRows={nbRows}
          height={heightBefore}
          onPageSizeChange={onPageSizeChange}
        />,
      );

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

      expect(onPageSizeChange.lastCall.args[0]).to.equal(expectedViewportRowsLengthAfter);
    });
  });

  it('should react to an update of rowCount', () => {
    const { setProps } = render(<BaselineTestCase rowCount={5} pageSize={1} page={0} />);
    expect(document.querySelector('.MuiTablePagination-root')).to.have.text('1-1 of 5');
    setProps({ rowCount: 21 });
    expect(document.querySelector('.MuiTablePagination-root')).to.have.text('1-1 of 21');
  });

  it('should support server side pagination', () => {
    const ServerPaginationGrid = () => {
      const [rows, setRows] = React.useState<GridRowsProp>([]);
      const [page, setPage] = React.useState(0);

      const handlePageChange = (newPage) => {
        setPage(newPage);
      };

      React.useEffect(() => {
        let active = true;

        (async () => {
          const newRows = [
            {
              id: page,
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
            columns={[{ field: 'id' }]}
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
    expect(getColumnValues()).to.deep.equal(['0']);
    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(getColumnValues()).to.deep.equal(['1']);
  });
});
