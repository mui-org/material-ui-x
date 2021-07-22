import {
  GRID_CELL_KEY_DOWN,
  GridApiRef,
  GridComponentProps,
  useGridApiRef,
  XGrid,
} from '@material-ui/x-grid';
import Portal from '@material-ui/unstyled/Portal';
import { expect } from 'chai';
import * as React from 'react';
import { getActiveCell, getCell, getColumnHeaderCell } from 'test/utils/helperFn';
import { stub, spy } from 'sinon';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  screen,
} from 'test/utils';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<XGrid /> - Edit Rows', () => {
  let baselineProps;

  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();
  beforeEach(() => {
    baselineProps = {
      autoHeight: isJSDOM,
      rows: [
        {
          id: 0,
          brand: 'Nike',
          year: 1941,
        },
        {
          id: 1,
          brand: 'Adidas',
          year: 1961,
        },
        {
          id: 2,
          brand: 'Puma',
          year: 1921,
        },
      ],
      columns: [
        { field: 'brand', editable: true },
        { field: 'year', editable: true },
      ],
    };
  });

  let apiRef: GridApiRef;

  const TestCase = (props: Partial<GridComponentProps>) => {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <XGrid {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  };

  it('isCellEditable should add the class MuiDataGrid-cell--editable to editable cells but not prevent a cell from switching mode', () => {
    render(<TestCase isCellEditable={(params) => params.value === 'Adidas'} />);
    const cellNike = getCell(0, 0);
    expect(cellNike).not.to.have.class('MuiDataGrid-cell--editable');
    const cellAdidas = getCell(1, 0);
    expect(cellAdidas).to.have.class('MuiDataGrid-cell--editable');

    apiRef!.current.setCellMode(0, 'brand', 'edit');
    expect(cellNike).to.have.class('MuiDataGrid-cell--editing');
  });

  it('should allow to switch between cell mode', () => {
    render(<TestCase />);
    apiRef!.current.setCellMode(1, 'brand', 'edit');
    const cell = getCell(1, 0);

    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
    expect(cell.querySelector('input')!.value).to.equal('Adidas');

    apiRef!.current.setCellMode(1, 'brand', 'view');
    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell.querySelector('input')).to.equal(null);
  });

  it('should allow to switch between cell mode using double click', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();
    fireEvent.doubleClick(cell);

    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
    expect(cell.querySelector('input')!.value).to.equal('Adidas');
  });

  it('should allow to stop double click using stopPropagation', () => {
    render(
      <TestCase
        onCellDoubleClick={(params, event) => (event as React.SyntheticEvent).stopPropagation()}
      />,
    );
    const cell = getCell(1, 0);
    cell.focus();
    fireEvent.doubleClick(cell);

    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell.querySelector('input')).to.equal(null);
  });

  it('should be able to prevent the exit transition', () => {
    render(
      <TestCase
        onCellFocusOut={(params, event) => {
          (event as any).defaultMuiPrevented = true;
        }}
      />,
    );
    const cell = getCell(1, 1);
    cell.focus();
    fireEvent.doubleClick(cell);
    expect(cell).to.have.class('MuiDataGrid-cell--editing');

    const otherCell = getCell(2, 1);
    fireEvent.click(otherCell);
    fireEvent.focus(otherCell);
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
  });

  it('should allow to switch between cell mode using enter key', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();
    fireEvent.keyDown(cell, { key: 'Enter' });

    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
    expect(cell.querySelector('input')!.value).to.equal('Adidas');
  });

  it('should allow to delete a cell directly if editable using delete key', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();

    expect(cell).to.have.text('Adidas');
    fireEvent.keyDown(cell, { key: 'Delete' });
    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('');
  });

  it('should not allow to delete a cell directly if it is not editable', () => {
    render(<TestCase isCellEditable={() => false} />);
    const cell = getCell(1, 0);
    cell.focus();

    expect(cell).to.have.text('Adidas');
    fireEvent.keyDown(cell, { key: 'Delete' });
    expect(cell).not.to.have.class('MuiDataGrid-cell--editable');
    expect(cell).to.have.text('Adidas');
  });

  // Due to an issue with the keyDown event in test library, this test uses the apiRef to publish an event
  // https://github.com/testing-library/dom-testing-library/issues/405
  it('should allow to edit a cell value by typing an alpha char', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();
    expect(cell).to.have.text('Adidas');
    const params = apiRef.current.getCellParams(1, 'brand');
    apiRef.current.publishEvent(GRID_CELL_KEY_DOWN, params, {
      key: 'a',
      code: 1,
      target: cell,
      isPropagationStopped: () => false,
    } as any);
    // fireEvent.keyDown(cell, { key: 'a', code: 1, target: cell });

    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
    // we can't check input as we did not fire the real keyDown event
    // expect(cell.querySelector('input')!.value).to.equal('a');
  });

  it('should allow to rollback from edit changes using Escape', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('Adidas');

    fireEvent.change(input, { target: { value: 'n' } });
    expect(cell.querySelector('input')!.value).to.equal('n');

    fireEvent.keyDown(input, { key: 'Escape' });
    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('Adidas');
  });

  it('should allow to save an edit changes using Enter', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('Adidas');
    fireEvent.change(input, { target: { value: 'n' } });
    expect(cell.querySelector('input')!.value).to.equal('n');

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('n');
    expect(getActiveCell()).to.equal('2-0');
  });

  it('should allow to save an edit changes using Tab', () => {
    render(<TestCase />);
    const cell = getCell(1, 0);
    cell.focus();
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('Adidas');

    fireEvent.change(input, { target: { value: 'n' } });
    expect(cell.querySelector('input')!.value).to.equal('n');

    fireEvent.keyDown(input, { key: 'Tab' });
    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('n');
    expect(getActiveCell()).to.equal('1-1');
  });

  it('should allow to save an edit changes using shift+Tab', () => {
    render(<TestCase />);
    const cell = getCell(1, 1);
    cell.focus();
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('1961');

    fireEvent.change(input, { target: { value: '1970' } });
    expect(cell.querySelector('input')!.value).to.equal('1970');

    fireEvent.keyDown(input, { key: 'Tab', shiftKey: true });
    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('1970');
    expect(getActiveCell()).to.equal('1-0');
  });

  it('should allow to save changes by clicking outside', () => {
    render(<TestCase />);
    const cell = getCell(1, 1);
    cell.focus();
    expect(getActiveCell()).to.equal('1-1');
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('1961');

    fireEvent.change(input, { target: { value: '1970' } });
    expect(cell.querySelector('input')!.value).to.equal('1970');

    const otherCell = getCell(2, 1);
    fireEvent.click(otherCell);
    fireEvent.focus(otherCell);
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('1970');
    expect(getActiveCell()).to.equal('2-1');
  });

  it('should save changes when a column header is dragged', () => {
    render(<TestCase />);
    const cell = getCell(1, 1);
    cell.focus();
    expect(getActiveCell()).to.equal('1-1');
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('1961');

    fireEvent.change(input, { target: { value: '1970' } });
    expect(cell.querySelector('input')!.value).to.equal('1970');

    const columnHeader = getColumnHeaderCell(0);
    fireEvent.dragStart(columnHeader.firstChild);
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('1970');
  });

  it('should save changes when a column header is focused', () => {
    render(<TestCase />);
    const cell = getCell(1, 1);
    cell.focus();
    expect(getActiveCell()).to.equal('1-1');
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('1961');

    fireEvent.change(input, { target: { value: '1970' } });
    expect(cell.querySelector('input')!.value).to.equal('1970');

    fireEvent.focus(getColumnHeaderCell(1));
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('1970');
  });

  it('should work correctly when the cell editing was initiated programmatically', () => {
    render(<TestCase />);
    apiRef.current.setCellMode(1, 'year', 'edit');
    expect(getActiveCell()).to.equal('1-1');
    const cell = getCell(1, 1);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('1961');

    fireEvent.change(input, { target: { value: '1970' } });
    expect(cell.querySelector('input')!.value).to.equal('1970');

    const otherCell = getCell(2, 1);
    fireEvent.click(otherCell);
    fireEvent.focus(otherCell);
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('1970');
    expect(getActiveCell()).to.equal('2-1');
  });

  it('should apply the valueParser before saving the value', () => {
    const valueParser = stub().withArgs('62').returns(1962);
    render(
      <div style={{ width: 300, height: 300 }}>
        <XGrid
          {...baselineProps}
          columns={[
            { field: 'brand', editable: true },
            { field: 'year', editable: true, valueParser },
          ]}
        />
      </div>,
    );
    const cell = getCell(1, 1);
    cell.focus();
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('1961');

    fireEvent.change(input, { target: { value: '62' } });
    expect(cell.querySelector('input')!.value).to.equal('1962');

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('1962');
    expect(valueParser.callCount).to.equal(1);
    expect(valueParser.args[0][0]).to.equal('62');
    expect(valueParser.args[0][1]).to.deep.include({
      id: 1,
      field: 'year',
      value: 1961,
      row: {
        id: 1,
        brand: 'Adidas',
        year: 1961,
      },
    });
  });

  it('should stay in the edit mode when clicking in an element inside a portal', () => {
    render(
      <TestCase
        columns={[
          {
            field: 'brand',
            editable: true,
            renderEditCell: () => (
              <Portal>
                <button>Click me</button>
              </Portal>
            ),
          },
        ]}
      />,
    );
    const cell = getCell(0, 0);
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    fireEvent.doubleClick(cell);
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
    fireEvent.mouseUp(screen.getByRole('button', { name: /Click me/i }));
    fireEvent.click(screen.getByRole('button', { name: /Click me/i }));
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
  });

  it('should stay in the edit mode when the element inside the cell triggers click but no mouseup', () => {
    render(
      <TestCase
        columns={[
          {
            field: 'brand',
            editable: true,
            renderEditCell: () => <input type="checkbox" />,
          },
        ]}
      />,
    );
    const cell = getCell(0, 0);
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    fireEvent.doubleClick(cell);
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(cell).to.have.class('MuiDataGrid-cell--editing');
  });

  it('should support getRowId', () => {
    render(
      <TestCase
        getRowId={(row) => row.code}
        rows={baselineProps.rows.map((row) => ({ code: row.id, brand: row.brand }))}
      />,
    );
    expect(screen.queryAllByRole('row')).to.have.length(4);
    const cell = getCell(1, 0);
    cell.focus();
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('Adidas');
    fireEvent.change(input, { target: { value: 'n' } });
    expect(cell.querySelector('input')!.value).to.equal('n');

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(cell).to.have.class('MuiDataGrid-cell--editable');
    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('n');
    expect(screen.queryAllByRole('row')).to.have.length(4);
  });

  it('should call onEditCellPropsChange when the value in the edit cell is changed', () => {
    const onEditCellPropsChange = spy();
    render(<TestCase onEditCellPropsChange={onEditCellPropsChange} />);
    const cell = getCell(1, 1);
    cell.focus();
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    fireEvent.change(input, { target: { value: '1970' } });
    expect(onEditCellPropsChange.args[0][0]).to.deep.equal({
      id: 1,
      field: 'year',
      props: { value: '1970' },
    });
  });

  it('should change cell value correctly when column type is singleSelect and valueOptions is array of strings', () => {
    render(
      <div style={{ width: 300, height: 300 }}>
        <XGrid
          columns={[
            {
              field: 'brand',
              type: 'singleSelect',
              valueOptions: ['Nike', 'Adidas'],
              editable: true,
            },
          ]}
          rows={[
            {
              id: 0,
              brand: 'Nike',
            },
          ]}
        />
      </div>,
    );

    const cell = getCell(0, 0);
    fireEvent.doubleClick(cell);
    fireEvent.click(screen.queryAllByRole('option')[1]);

    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('Adidas');
  });

  it('should change cell value correctly when column type is singleSelect and valueOptions is array of objects', () => {
    const countries = [
      {
        value: 'fr',
        label: 'France',
      },
      {
        value: 'it',
        label: 'Italy',
      },
    ];

    render(
      <div style={{ width: 300, height: 300 }}>
        <XGrid
          columns={[
            {
              field: 'country',
              type: 'singleSelect',
              valueOptions: countries,
              valueFormatter: (params) => {
                const result = countries.find((country) => country.value === params.value);
                return result!.label;
              },
              editable: true,
            },
          ]}
          rows={[
            {
              id: 0,
              country: 'fr',
            },
          ]}
        />
      </div>,
    );

    const cell = getCell(0, 0);
    fireEvent.doubleClick(cell);
    fireEvent.click(screen.queryAllByRole('option')[1]);

    expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    expect(cell).to.have.text('Italy');
  });

  it('should keep the right type', () => {
    const Test = (props: Partial<GridComponentProps>) => {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid
            {...baselineProps}
            apiRef={apiRef}
            columns={[{ field: 'year', type: 'number', editable: true }]}
            {...props}
          />
        </div>
      );
    };
    render(<Test />);
    expect(screen.queryAllByRole('row')).to.have.length(4);
    const cell = getCell(0, 0);
    cell.focus();
    fireEvent.doubleClick(cell);
    const input = cell.querySelector('input')!;
    expect(input.value).to.equal('1941');
    fireEvent.change(input, { target: { value: '1942' } });

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(cell).to.have.text('1,942');
    expect(apiRef.current.getRow(baselineProps.rows[0].id)!.year).to.equal(1942);
  });

  describe('column type: date', () => {
    it('should call onEditCellPropsChange with the value entered as a Date', () => {
      const onEditCellPropsChange = spy();
      render(
        <TestCase
          rows={[{ id: 0, date: new Date(2021, 6, 5) }]}
          columns={[{ field: 'date', type: 'date', editable: true }]}
          onEditCellPropsChange={onEditCellPropsChange}
        />,
      );
      const cell = getCell(0, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: '2022-05-07' } });
      expect(onEditCellPropsChange.args[0][0].props.value.toISOString()).to.equal(
        new Date(2022, 4, 7).toISOString(),
      );
    });

    it('should call onEditCellPropsChange with null when entered an empty value', () => {
      const onEditCellPropsChange = spy();
      render(
        <TestCase
          rows={[{ id: 0, date: new Date(2021, 6, 5) }]}
          columns={[{ field: 'date', type: 'date', editable: true }]}
          onEditCellPropsChange={onEditCellPropsChange}
        />,
      );
      const cell = getCell(0, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: '' } });
      expect(onEditCellPropsChange.args[0][0].props.value).to.equal(null);
    });
  });

  describe('column type: dateTime', () => {
    it('should call onEditCellPropsChange with the value entered as a Date', () => {
      const onEditCellPropsChange = spy();
      render(
        <TestCase
          rows={[{ id: 0, date: new Date(2021, 6, 5, 14, 30) }]}
          columns={[{ field: 'date', type: 'dateTime', editable: true }]}
          onEditCellPropsChange={onEditCellPropsChange}
        />,
      );
      const cell = getCell(0, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: '2022-05-07T15:30:00' } });
      expect(onEditCellPropsChange.args[0][0].props.value.toISOString()).to.equal(
        new Date(2022, 4, 7, 15, 30).toISOString(),
      );
    });

    it('should call onEditCellPropsChange with null when entered an empty value', () => {
      const onEditCellPropsChange = spy();
      render(
        <TestCase
          rows={[{ id: 0, date: new Date(2021, 6, 5, 14, 30) }]}
          columns={[{ field: 'date', type: 'dateTime', editable: true }]}
          onEditCellPropsChange={onEditCellPropsChange}
        />,
      );
      const cell = getCell(0, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: '' } });
      expect(onEditCellPropsChange.args[0][0].props.value).to.equal(null);
    });
  });

  describe('validation', () => {
    it('should not allow to save an invalid value with Enter', () => {
      render(<TestCase />);
      const cell = getCell(1, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      expect(input).not.to.have.attribute('aria-invalid');
      fireEvent.change(input, { target: { value: 'n' } });
      apiRef.current.setEditRowsModel({ 1: { brand: { error: true, value: 'n' } } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(input).to.have.attribute('aria-invalid', 'true');
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
    });

    it('should not allow to save an invalid value with commitCellChange', () => {
      render(<TestCase />);
      const cell = getCell(1, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      expect(input).not.to.have.attribute('aria-invalid');
      fireEvent.change(input, { target: { value: 'n' } });
      apiRef.current.setEditRowsModel({ 1: { brand: { error: true, value: 'n' } } });
      apiRef.current.commitCellChange({ id: 1, field: 'brand' });
      apiRef.current.setCellMode(1, 'brand', 'view');
      expect(cell).to.have.text('Adidas');
    });

    it('should not call onCellEditCommit for invalid values', () => {
      const onCellEditCommit = spy();
      render(<TestCase onCellEditCommit={onCellEditCommit} />);
      const cell = getCell(1, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      expect(input).not.to.have.attribute('aria-invalid');
      fireEvent.change(input, { target: { value: 'n' } });
      apiRef.current.setEditRowsModel({ 1: { brand: { error: true, value: 'n' } } });
      apiRef.current.commitCellChange({ id: 1, field: 'brand' });
      apiRef.current.setCellMode(1, 'brand', 'view');
      expect(onCellEditCommit.callCount).to.equal(0);
    });
  });

  describe('control Editing', () => {
    it('should update the state when neither the model nor the onChange are set', () => {
      render(<TestCase />);
      const cell = getCell(1, 1);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('1961');
      fireEvent.change(input, { target: { value: '1970' } });
      expect(input.value).to.equal('1970');
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(cell).to.have.text('1970');
    });

    it('should not update the state when the editRowsModel prop is set', () => {
      render(<TestCase editRowsModel={{ 1: { year: { value: 1961 } } }} />);
      const cell = getCell(1, 1);
      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('1961');
      fireEvent.change(input, { target: { value: '1970' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(cell.querySelector('input')).not.to.equal(null);
    });

    it('should update the state when the model is not set, but the onChange is set', () => {
      const onEditRowsModelChange = spy();
      render(<TestCase onEditRowsModelChange={onEditRowsModelChange} />);
      const cell = getCell(1, 1);
      cell.focus();
      fireEvent.doubleClick(cell);
      expect(onEditRowsModelChange.callCount).to.equal(1);
      expect(onEditRowsModelChange.lastCall.firstArg).to.deep.equal({
        1: { year: { value: 1961 } },
      });
      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: 1970 } });
      expect(onEditRowsModelChange.lastCall.firstArg).to.deep.equal({
        1: { year: { value: '1970' } },
      });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(cell).to.have.text('1970');
      expect(onEditRowsModelChange.lastCall.firstArg).to.deep.equal({});
      expect(onEditRowsModelChange.callCount).to.equal(3);
      expect(cell.querySelector('input')).to.equal(null);
    });

    it('should control the state when the model and the onChange are set', () => {
      const onEditRowsModelChange = spy();
      const { setProps } = render(
        <TestCase
          editRowsModel={{ 1: { year: { value: 1961 } } }}
          onEditRowsModelChange={onEditRowsModelChange}
        />,
      );
      const cell = getCell(1, 1);
      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: 1970 } });
      expect(onEditRowsModelChange.lastCall.firstArg).to.deep.equal({
        1: { year: { value: '1970' } },
      });
      setProps({ editRowsModel: { 1: { year: { value: 1971 } } } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(onEditRowsModelChange.lastCall.firstArg).to.deep.equal({});
      setProps({ editRowsModel: {} });
      expect(cell).to.have.text('1971');
    });
  });
});
