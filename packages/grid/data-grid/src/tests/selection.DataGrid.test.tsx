import * as React from 'react';
// @ts-expect-error need to migrate helpers to TypeScript
import { fireEvent, screen, createClientRenderStrictMode } from 'test/utils';
import { expect } from 'chai';
import { spy } from 'sinon';
import { DataGrid } from '@material-ui/data-grid';
import { getCell, getRow } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Selection', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  describe('no checkboxSelection prop - selection/deselection', () => {
    const TestDataGridSelection = () => (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid
          rows={[
            {
              id: 0,
              brand: 'Nike',
            },
            {
              id: 1,
              brand: 'Adidas',
            },
          ]}
          columns={[{ field: 'brand', width: 100 }]}
        />
      </div>
    );

    it('should select one row at a time on click WITHOUT keypress', () => {
      render(<TestDataGridSelection />);
      const firstRow = getRow(0);
      const secondRow = getRow(1);
      fireEvent.click(getCell(0, 0));
      expect(firstRow).to.have.class('Mui-selected');
      fireEvent.click(getCell(1, 0));
      expect(firstRow).not.to.have.class('Mui-selected');
      expect(secondRow).to.have.class('Mui-selected');
    });

    ['metaKey', 'ctrlKey'].forEach((key) => {
      it(`should select one row at a time on click WITH ${key} pressed`, () => {
        render(<TestDataGridSelection />);
        const firstRow = getRow(0);
        const secondRow = getRow(1);
        fireEvent.click(getCell(0, 0), { [key]: true });
        expect(firstRow).to.have.class('Mui-selected');
        fireEvent.click(getCell(1, 0), { [key]: true });
        expect(firstRow).not.to.have.class('Mui-selected');
        expect(secondRow).to.have.class('Mui-selected');
      });

      it(`should deselect the selected row on click WITH ${key} pressed`, () => {
        render(<TestDataGridSelection />);
        const firstRow = getRow(0);
        fireEvent.click(getCell(0, 0));
        expect(firstRow).to.have.class('Mui-selected');
        fireEvent.click(getCell(0, 0), { [key]: true });
        expect(firstRow).not.to.have.class('Mui-selected');
      });
    });

    it('should not deselect the selected row on click WITHOUT keypress', () => {
      render(<TestDataGridSelection />);
      const firstRow = getRow(0);
      fireEvent.click(getCell(0, 0));
      expect(firstRow).to.have.class('Mui-selected');
      fireEvent.click(getCell(0, 0));
      expect(firstRow).to.have.class('Mui-selected');
    });
  });

  describe('prop: checkboxSelection', () => {
    it('should check and uncheck when double clicking the row', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            autoHeight={isJSDOM}
            rows={[
              {
                id: 0,
                brand: 'Nike',
              },
            ]}
            columns={[{ field: 'brand', width: 100 }]}
            checkboxSelection
            hideFooter
          />
        </div>,
      );
      const row = getRow(0);
      const checkbox = row!.querySelector('input');
      expect(row).not.to.have.class('Mui-selected');
      expect(checkbox).to.have.property('checked', false);

      fireEvent.click(screen.getByRole('cell', { name: 'Nike' }));
      expect(row!.classList.contains('Mui-selected')).to.equal(true, 'class mui-selected 1');
      expect(checkbox).to.have.property('checked', true);

      fireEvent.click(screen.getByRole('cell', { name: 'Nike' }));
      expect(row!.classList.contains('Mui-selected')).to.equal(false, 'class mui-selected 2');
      expect(checkbox).to.have.property('checked', false);
    });

    it('should select all visible rows regardless of pagination', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            rows={[
              {
                id: 0,
                brand: 'Nike',
              },
              {
                id: 1,
                brand: 'Puma',
              },
            ]}
            columns={[{ field: 'brand', width: 100 }]}
            checkboxSelection
            pagination
            pageSize={1}
          />
        </div>,
      );
      const selectAllCheckbox = document.querySelector('input[type="checkbox"]');
      fireEvent.click(selectAllCheckbox);
      expect(getRow(0)).to.have.class('Mui-selected');
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getRow(1)).to.have.class('Mui-selected');
    });

    it('with no rows, the checkbox should not be checked', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            autoHeight={isJSDOM}
            rows={[]}
            checkboxSelection
            columns={[{ field: 'brand', width: 100 }]}
          />
        </div>,
      );
      const selectAll = screen.getByRole('checkbox', {
        name: /select all rows checkbox/i,
      });
      expect(selectAll).to.have.property('checked', false);
    });

    it('should disable the checkbox if isRowSelectable returns false', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            autoHeight={isJSDOM}
            rows={[
              {
                id: 0,
                brand: 'Nike',
              },
              {
                id: 1,
                brand: 'Adidas',
              },
            ]}
            columns={[{ field: 'brand', width: 100 }]}
            isRowSelectable={(params) => params.id === 0}
            checkboxSelection
            hideFooter
          />
        </div>,
      );
      expect(getRow(0).querySelector('input')).to.have.property('disabled', false);
      expect(getRow(1).querySelector('input')).to.have.property('disabled', true);
    });
  });

  describe('props: selectionModel', () => {
    it('should select rows when initialised', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            autoHeight={isJSDOM}
            rows={[
              {
                id: 0,
                brand: 'Nike',
              },
              {
                id: 1,
                brand: 'Hugo Boss',
              },
            ]}
            columns={[{ field: 'brand', width: 100 }]}
            selectionModel={[1]}
          />
        </div>,
      );
      const row = getRow(1);
      expect(row).to.have.class('Mui-selected');
    });

    it('should deselect other selected rows', () => {
      const data = {
        rows: [
          {
            id: 0,
            brand: 'Nike',
          },
          {
            id: 1,
            brand: 'Hugo Boss',
          },
        ],
        columns: [{ field: 'brand', width: 100 }],
      };
      function Demo(props) {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid autoHeight={isJSDOM} {...data} selectionModel={props.selectionModel} />
          </div>
        );
      }

      const { setProps } = render(<Demo />);

      const row1 = getRow(1);
      expect(row1).not.to.have.class('Mui-selected');

      fireEvent.click(getCell(0, 0));
      const row0 = getRow(0);
      expect(row0).to.have.class('Mui-selected');

      setProps({ selectionModel: [1] });
      // TODO fix this assertion. The model is forced from the outside, hence shouldn't change.
      // https://github.com/mui-org/material-ui-x/issues/190
      expect(row0).not.to.have.class('Mui-selected');
      expect(row1).to.have.class('Mui-selected');
    });

    it('should not call onSelectionModelChange if the new value is the same', () => {
      const onSelectionModelChange = spy();
      const data = {
        rows: [
          {
            id: 0,
            brand: 'Nike',
          },
          {
            id: 1,
            brand: 'Hugo Boss',
          },
        ],
        columns: [{ field: 'brand', width: 100 }],
        checkboxSelection: true,
        onSelectionModelChange,
      };
      function Demo(props) {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...data} selectionModel={props.selectionModel} />
          </div>
        );
      }
      const selectionModel = [0];
      const { setProps } = render(<Demo selectionModel={selectionModel} />);
      expect(onSelectionModelChange.callCount).to.equal(0);
      const firstRow = getRow(0);
      expect(firstRow).to.have.class('Mui-selected');
      setProps({ selectionModel });
      expect(onSelectionModelChange.callCount).to.equal(0);
      expect(getRow(0)).to.have.class('Mui-selected');
    });

    it('should filter out unselectable rows when the selectionModel prop changes', () => {
      const data = {
        autoHeight: isJSDOM,
        rows: [
          {
            id: 0,
            brand: 'Nike',
          },
          {
            id: 1,
            brand: 'Adidas',
          },
        ],
        columns: [{ field: 'brand', width: 100 }],
        selectionModel: [1],
        isRowSelectable: (params) => params.id > 0,
      };

      function Demo(props) {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...props} />
          </div>
        );
      }

      const { setProps } = render(<Demo {...data} />);
      expect(getRow(0)).not.to.have.class('Mui-selected');
      expect(getRow(1)).to.have.class('Mui-selected');

      setProps({ selectionModel: [0] });
      expect(getRow(0)).to.have.class('Mui-selected');
      expect(getRow(1)).not.to.have.class('Mui-selected');
    });
  });

  describe('props: isRowSelectable', () => {
    it('should update the selected rows when the isRowSelectable prop changes', () => {
      const data = {
        autoHeight: isJSDOM,
        rows: [
          {
            id: 0,
            brand: 'Nike',
          },
          {
            id: 1,
            brand: 'Adidas',
          },
        ],
        columns: [{ field: 'brand', width: 100 }],
        isRowSelectable: () => true,
      };

      function Demo(props) {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...props} />
          </div>
        );
      }

      const { setProps } = render(<Demo {...data} />);
      fireEvent.click(getRow(0));
      expect(getRow(0)).to.have.class('Mui-selected');
      expect(getRow(1)).not.to.have.class('Mui-selected');

      setProps({ isRowSelectable: (params) => params.id > 0 });
      expect(getRow(0)).not.to.have.class('Mui-selected');
      expect(getRow(1)).not.to.have.class('Mui-selected');
    });
  });
});
