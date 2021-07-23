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
import { useFakeTimers, spy } from 'sinon';
import {
  GridApiRef,
  GridComponentProps,
  useGridApiRef,
  XGrid,
  GRID_COLUMN_HEADER_SEPARATOR_RESIZABLE_CSS_CLASS,
} from '@material-ui/x-grid';
import { getColumnHeaderCell, getCell } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<XGrid /> - Columns', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  let apiRef: GridApiRef;

  const baselineProps = {
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
      {
        id: 2,
        brand: 'Puma',
      },
    ],
    columns: [{ field: 'brand' }],
  };

  const Test = (props: Partial<GridComponentProps>) => {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <XGrid apiRef={apiRef} {...baselineProps} {...props} />
      </div>
    );
  };

  describe('showColumnMenu', () => {
    it('should open the column menu', async () => {
      render(<Test />);
      expect(screen.queryByRole('menu')).to.equal(null);
      apiRef!.current.showColumnMenu('brand');
      await waitFor(() => expect(screen.queryByRole('menu')).to.not.equal(null));
    });

    it('should set the correct id and aria-labelledby', async () => {
      render(<Test />);
      expect(screen.queryByRole('menu')).to.equal(null);
      apiRef!.current.showColumnMenu('brand');
      await waitFor(() => {
        const menu = screen.queryByRole('menu');
        expect(menu.id).to.match(/^mui-[0-9]+/);
        expect(menu.getAttribute('aria-labelledby')).to.match(/^mui-[0-9]+/);
      });
    });
  });

  describe('toggleColumnMenu', () => {
    it('should toggle the column menu', async () => {
      render(<Test />);
      expect(screen.queryByRole('menu')).to.equal(null);
      apiRef!.current.toggleColumnMenu('brand');
      await waitFor(() => expect(screen.queryByRole('menu')).to.not.equal(null));
      apiRef!.current.toggleColumnMenu('brand');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));
    });
  });

  describe('resizing', () => {
    const columns = [{ field: 'brand', width: 100 }];

    let clock;

    beforeEach(() => {
      clock = useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should allow to resize columns with the mouse', () => {
      render(<Test columns={columns} />);
      const separator = document.querySelector(
        `.${GRID_COLUMN_HEADER_SEPARATOR_RESIZABLE_CSS_CLASS}`,
      );
      fireEvent.mouseDown(separator, { clientX: 100 });
      fireEvent.mouseMove(separator, { clientX: 110, buttons: 1 });
      fireEvent.mouseUp(separator);
      // @ts-expect-error need to migrate helpers to TypeScript
      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '110px' });
      // @ts-expect-error need to migrate helpers to TypeScript
      expect(getCell(1, 0)).toHaveInlineStyle({ width: '110px' });
    });

    it('should allow to resize columns with the touch', function test() {
      // Only run in supported browsers
      if (typeof Touch === 'undefined') {
        this.skip();
      }
      render(<Test columns={columns} />);
      const separator = document.querySelector(
        `.${GRID_COLUMN_HEADER_SEPARATOR_RESIZABLE_CSS_CLASS}`,
      )!;
      const now = Date.now();
      fireEvent.touchStart(separator, {
        changedTouches: [new Touch({ identifier: now, target: separator, clientX: 100 })],
      });
      fireEvent.touchMove(separator, {
        changedTouches: [new Touch({ identifier: now, target: separator, clientX: 110 })],
      });
      fireEvent.touchEnd(separator, {
        changedTouches: [new Touch({ identifier: now, target: separator, clientX: 110 })],
      });
      // @ts-expect-error need to migrate helpers to TypeScript
      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '110px' });
      // @ts-expect-error need to migrate helpers to TypeScript
      expect(getCell(1, 0)).toHaveInlineStyle({ width: '110px' });
    });

    it('should call onColumnResize during resizing', () => {
      const onColumnResize = spy();
      render(<Test onColumnResize={onColumnResize} columns={columns} />);
      const separator = document.querySelector(
        `.${GRID_COLUMN_HEADER_SEPARATOR_RESIZABLE_CSS_CLASS}`,
      );
      fireEvent.mouseDown(separator, { clientX: 100 });
      fireEvent.mouseMove(separator, { clientX: 110, buttons: 1 });
      fireEvent.mouseMove(separator, { clientX: 120, buttons: 1 });
      fireEvent.mouseUp(separator);
      expect(onColumnResize.callCount).to.equal(2);
      expect(onColumnResize.args[0][0].width).to.equal(110);
      expect(onColumnResize.args[1][0].width).to.equal(120);
    });

    it('should call onColumnWidthChange after resizing', () => {
      const onColumnWidthChange = spy();
      render(<Test onColumnWidthChange={onColumnWidthChange} columns={columns} />);
      const separator = document.querySelector(
        `.${GRID_COLUMN_HEADER_SEPARATOR_RESIZABLE_CSS_CLASS}`,
      );
      fireEvent.mouseDown(separator, { clientX: 100 });
      fireEvent.mouseMove(separator, { clientX: 110, buttons: 1 });
      fireEvent.mouseMove(separator, { clientX: 120, buttons: 1 });
      expect(onColumnWidthChange.callCount).to.equal(0);
      fireEvent.mouseUp(separator);
      clock.tick(0);
      expect(onColumnWidthChange.callCount).to.equal(1);
      expect(onColumnWidthChange.args[0][0].width).to.equal(120);
    });

    describe('flex resizing', () => {
      before(function beforeHook() {
        if (isJSDOM) {
          // Need layouting
          this.skip();
        }
      });

      it('should resize the flex width after resizing another column with api', () => {
        const twoColumns = [
          { field: 'id', width: 100, flex: 1 },
          { field: 'brand', width: 100 },
        ];

        render(<Test columns={twoColumns} />);

        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '198px' });
        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '100px' });

        apiRef!.current.setColumnWidth('brand', 150);

        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '148px' });
        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '150px' });
      });

      it('should resize the flex width after resizing a column with the separator', () => {
        const twoColumns = [
          { field: 'id', width: 100, flex: 1 },
          { field: 'brand', width: 100 },
        ];

        render(<Test columns={twoColumns} />);

        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '198px' });
        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '100px' });

        const separator = getColumnHeaderCell(1).querySelector(
          `.${GRID_COLUMN_HEADER_SEPARATOR_RESIZABLE_CSS_CLASS}`,
        );

        fireEvent.mouseDown(separator, { clientX: 100 });
        fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
        fireEvent.mouseUp(separator);

        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '148px' });
        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '150px' });
      });

      it('should not resize a flex column under its minWidth property (api resize)', () => {
        const twoColumns = [
          { field: 'id', minWidth: 175, flex: 1 },
          { field: 'brand', width: 100 },
        ];

        render(<Test columns={twoColumns} />);

        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '198px' });
        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '100px' });

        apiRef!.current.setColumnWidth('brand', 150);

        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '175px' });
        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '150px' });
      });

      it('should not resize a flex column under its minWidth property (separator resize)', () => {
        const twoColumns = [
          { field: 'id', minWidth: 175, flex: 1 },
          { field: 'brand', width: 100 },
        ];

        render(<Test columns={twoColumns} />);

        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '198px' });
        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '100px' });

        const separator = getColumnHeaderCell(1).querySelector(
          `.${GRID_COLUMN_HEADER_SEPARATOR_RESIZABLE_CSS_CLASS}`,
        );

        fireEvent.mouseDown(separator, { clientX: 100 });
        fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
        fireEvent.mouseUp(separator);

        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '175px' });
        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '150px' });
      });

      it('should be able to resize a flex column under its width property (api resize)', () => {
        const twoColumns = [
          { field: 'id', width: 175, flex: 1 },
          { field: 'brand', width: 100 },
        ];

        render(<Test columns={twoColumns} />);

        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '198px' });
        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '100px' });

        apiRef!.current.setColumnWidth('brand', 150);

        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '148px' });
        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '150px' });
      });

      it('should be able to resize a flex column under its width property (separator resize)', () => {
        const twoColumns = [
          { field: 'id', width: 175, flex: 1 },
          { field: 'brand', width: 100 },
        ];

        render(<Test columns={twoColumns} />);

        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '198px' });
        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '100px' });

        const separator = getColumnHeaderCell(1).querySelector(
          `.${GRID_COLUMN_HEADER_SEPARATOR_RESIZABLE_CSS_CLASS}`,
        );

        fireEvent.mouseDown(separator, { clientX: 100 });
        fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
        fireEvent.mouseUp(separator);

        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '148px' });
        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '150px' });
      });
    });
  });
});
