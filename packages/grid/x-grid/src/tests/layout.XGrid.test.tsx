import * as React from 'react';
import { createClientRenderStrictMode } from 'test/utils';
import { expect } from 'chai';
import { GridApiRef, useGridApiRef, XGrid } from '@material-ui/x-grid';

describe('<XGrid /> - Layout', () => {
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
    columns: [{ field: 'brand', width: 100 }],
  };

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  // Adaptation of describeConformance()
  describe('Material-UI component API', () => {
    it(`attaches the ref`, () => {
      const ref = React.createRef<HTMLDivElement>();
      const { container } = render(
        <div style={{ width: 300, height: 300 }}>
          <XGrid {...baselineProps} ref={ref} />
        </div>,
      );
      expect(ref.current).to.be.instanceof(window.HTMLDivElement);
      expect(ref.current).to.equal(container.firstChild.firstChild);
    });

    function randomStringValue() {
      return `r${Math.random().toString(36).slice(2)}`;
    }

    it('applies the className to the root component', () => {
      const className = randomStringValue();

      const { container } = render(
        <div style={{ width: 300, height: 300 }}>
          <XGrid {...baselineProps} className={className} />
        </div>,
      );

      expect(container.firstChild.firstChild).to.have.class(className);
      expect(container.firstChild.firstChild).to.have.class('MuiDataGrid-root');
    });

    it('applies the style to the root component', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <XGrid
            {...baselineProps}
            style={{
              mixBlendMode: 'darken',
            }}
          />
        </div>,
      );

      // @ts-expect-error need to migrate helpers to TypeScript
      expect(document.querySelector('.MuiDataGrid-root')).toHaveInlineStyle({
        mixBlendMode: 'darken',
      });
    });
  });

  describe('columns width', () => {
    it('should resize flex: 1 column when changing column visibility to avoid exceeding grid width', () => {
      let apiRef: GridApiRef;

      const TestCase = (props) => {
        apiRef = useGridApiRef();

        return (
          <div style={{ width: 300, height: 500 }}>
            <XGrid {...props} apiRef={apiRef} />
          </div>
        );
      };

      render(
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

      apiRef!.current.setColumnVisibility('age', true);
      firstColumn = document.querySelector('[role="columnheader"][aria-colindex="1"]');
      // @ts-expect-error need to migrate helpers to TypeScript
      expect(firstColumn).toHaveInlineStyle({
        width: '148px', // because of the 2px border
      });
    });
  });
});
