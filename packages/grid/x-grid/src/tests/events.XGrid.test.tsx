import * as React from 'react';
import {
  createClientRenderStrictMode,
  // @ts-ignore
  fireEvent,
  // @ts-ignore
  screen,
} from 'test/utils';
import { expect } from 'chai';
import {
  XGrid,
  GridColumnHeaderParams,
  useGridApiRef,
  XGridProps,
  GridRowParams,
  GridCellParams,
  GridRowsProp,
  GridColumns,
  GRID_ROWS_SCROLL,
} from '@material-ui/x-grid';
import { getCell, getColumnHeaderCell, getRow } from 'test/utils/helperFn';
import { spy } from 'sinon';
import { useData } from 'packages/storybook/src/hooks/useData';

describe('<XGrid /> - Events Params', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const baselineProps: { rows: GridRowsProp; columns: GridColumns } = {
    rows: [
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
    ],
    columns: [
      { field: 'id' },
      { field: 'first', editable: true },
      { field: 'age' },
      {
        field: 'firstAge',
        valueGetter: (params) => `${params.row.first}_${params.row.age}`,
        valueFormatter: (params) => `${params.value} yrs`,
      },
    ],
  };

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  let apiRef;
  const TestEvents = (props: Partial<XGridProps>) => {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <XGrid apiRef={apiRef} {...baselineProps} {...props} />
      </div>
    );
  };

  const TestVirtualization = (props: Partial<XGridProps>) => {
    apiRef = useGridApiRef();
    const data = useData(50, 10);
    return (
      <div style={{ width: 300, height: 300 }}>
        <XGrid rows={data.rows} columns={data.columns} apiRef={apiRef} {...props} />
      </div>
    );
  };

  describe('columnHeaderParams', () => {
    it('should include the correct params', () => {
      let eventArgs: { params: GridColumnHeaderParams; event: React.MouseEvent } | null = null;
      const handleClick = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onColumnHeaderClick={handleClick} />);

      const ageColumnElement = getColumnHeaderCell(2);
      fireEvent.click(ageColumnElement);

      expect(eventArgs!.params).to.deep.include({
        colDef: apiRef!.current.getColumn('age'),
        field: 'age',
        api: apiRef.current,
      });
    });
  });

  describe('RowsParams', () => {
    it('should include the correct params', () => {
      let eventArgs: { params: GridRowParams; event: React.MouseEvent } | null = null;

      const handleClick = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onRowClick={handleClick} />);

      const row1 = getRow(1);
      fireEvent.click(row1);

      expect(eventArgs!.params).to.deep.include({
        id: 2,
        row: baselineProps.rows[1],
        columns: apiRef!.current.getAllColumns(),
        api: apiRef.current,
        getValue: apiRef.current.getCellValue,
      });
    });
  });

  describe('CellsParams', () => {
    let eventArgs: { params: GridCellParams; event: React.MouseEvent } | null = null;
    let cell11;

    it('should include the correct params', () => {
      const handleClick = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onCellClick={handleClick} />);
      cell11 = getCell(1, 1);
      fireEvent.click(cell11);

      expect(eventArgs!.params).to.deep.include({
        id: 2,
        value: 'Jack',
        formattedValue: 'Jack',
        isEditable: true,
        row: baselineProps.rows[1],
        colDef: apiRef!.current.getColumn('first'),
        api: apiRef.current,
        hasFocus: false,
        tabIndex: -1,
        getValue: apiRef.current.getCellValue,
      });
    });

    it('should include the correct params when grid is sorted', () => {
      const handleClick = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onCellClick={handleClick} />);
      const header = screen
        .getByRole('columnheader', { name: 'first' })
        .querySelector('.MuiDataGrid-columnHeaderTitleContainer');
      fireEvent.click(header);

      const cell01 = getCell(0, 1);
      fireEvent.click(cell01);

      expect(eventArgs!.params).to.deep.include({
        id: 2,
        value: 'Jack',
        formattedValue: 'Jack',
        isEditable: true,
        row: baselineProps.rows[1],
        colDef: apiRef!.current.getColumn('first'),
        api: apiRef.current,
        hasFocus: false,
        tabIndex: -1,
        getValue: apiRef.current.getCellValue,
      });
    });

    it('should consider value getter', () => {
      const handleClick = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onCellClick={handleClick} />);
      const cellFirstAge = getCell(1, 3);
      fireEvent.click(cellFirstAge);

      expect(eventArgs!.params.value).to.equal('Jack_11');
    });

    it('should consider value formatter', () => {
      const handleClick = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onCellClick={handleClick} />);
      const cellFirstAge = getCell(1, 3);
      fireEvent.click(cellFirstAge);

      expect(eventArgs!.params.formattedValue).to.equal('Jack_11 yrs');
    });
  });

  describe('onCellClick', () => {
    let eventStack: string[] = [];
    const push = (name: string) => () => {
      eventStack.push(name);
    };

    beforeEach(() => {
      eventStack = [];
    });

    it('should bubble to the row', () => {
      render(<TestEvents onCellClick={push('cellClick')} onRowClick={push('rowClick')} />);

      const cell11 = getCell(1, 1);
      fireEvent.click(cell11);
      expect(eventStack).to.deep.equal(['cellClick', 'rowClick']);
    });

    it('should allow to stop propagation', () => {
      const stopClick = (params, event) => {
        event.stopPropagation();
      };
      render(<TestEvents onCellClick={stopClick} onSelectionModelChange={push('rowSelected')} />);

      const cell11 = getCell(1, 1);
      fireEvent.click(cell11);
      expect(eventStack).to.deep.equal([]);
    });

    it('should select a row by default', () => {
      const handleSelection = spy();
      render(<TestEvents onSelectionModelChange={handleSelection} />);

      const cell11 = getCell(1, 1);
      fireEvent.click(cell11);
      expect(handleSelection.callCount).to.equal(1);
      expect(handleSelection.lastCall.firstArg).to.deep.equal([2]);
    });

    it('should not select a row if options.disableSelectionOnClick', () => {
      const handleSelection = spy();
      render(<TestEvents onSelectionModelChange={handleSelection} disableSelectionOnClick />);
      const cell11 = getCell(1, 1);
      fireEvent.click(cell11);
      expect(handleSelection.callCount).to.equal(0);
    });
  });
  it('publishing GRID_ROWS_SCROLL should call onRowsScrollEnd callback', () => {
    const handleOnRowsScrollEnd = spy();

    render(<TestEvents onRowsScrollEnd={handleOnRowsScrollEnd} />);
    apiRef.current.publishEvent(GRID_ROWS_SCROLL);
    expect(handleOnRowsScrollEnd.callCount).to.equal(1);
  });

  it('call onRowsScrollEnd when viewport scroll reaches the bottom', () => {
    const handleOnRowsScrollEnd = spy();
    const data = {
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
        {
          id: 3,
          brand: 'Under Armor',
        },
        {
          id: 4,
          brand: 'Jordan',
        },
        {
          id: 5,
          brand: 'Reebok',
        },
      ],
      columns: [{ field: 'brand', width: 100 }],
    };

    const { container } = render(
      <div style={{ width: 300, height: 300 }}>
        <XGrid columns={data.columns} rows={data.rows} onRowsScrollEnd={handleOnRowsScrollEnd} />
      </div>,
    );
    const gridWindow = container.querySelector('.MuiDataGrid-window');
    // arbitrary number to make sure that the bottom of the grid window is reached.
    gridWindow.scrollTop = 12345;
    gridWindow.dispatchEvent(new Event('scroll'));
    expect(handleOnRowsScrollEnd.callCount).to.equal(1);
  });

  it('call onViewportRowsChange when the viewport rows change', () => {
    const handleOnViewportRowsChange = spy();
    const { container } = render(
      <div style={{ width: 300, height: 300 }}>
        <TestVirtualization onViewportRowsChange={handleOnViewportRowsChange} />
      </div>,
    );
    const gridWindow = container.querySelector('.MuiDataGrid-window');
    // scroll 10 rows.
    gridWindow.scrollTop = 12345;
    gridWindow.dispatchEvent(new Event('scroll'));

    expect(handleOnViewportRowsChange.callCount).to.equal(1);
    expect(handleOnViewportRowsChange.lastCall.args[0].firstRowIndex).to.equal(48);
    expect(handleOnViewportRowsChange.lastCall.args[0].lastRowIndex).to.equal(50);
  });
});
