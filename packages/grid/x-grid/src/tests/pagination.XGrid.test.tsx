import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  act,
} from 'test/utils';
import { getColumnValues } from 'test/utils/helperFn';
import * as React from 'react';
import { expect } from 'chai';
import { XGrid, useGridApiRef } from '@material-ui/x-grid';
import { useData } from 'packages/storybook/src/hooks/useData';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<XGrid /> - Pagination', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  describe('setPage', () => {
    it('should apply valid value', () => {
      let apiRef;
      const GridTest = () => {
        const basicData = useData(20, 2);
        apiRef = useGridApiRef();

        return (
          <div style={{ width: 300, height: 300 }}>
            <XGrid {...basicData} apiRef={apiRef} pagination pageSize={1} />
          </div>
        );
      };

      render(<GridTest />);

      expect(getColumnValues()).to.deep.equal(['0']);
      act(() => {
        apiRef.current.setPage(1);
      });

      expect(getColumnValues()).to.deep.equal(['1']);
    });

    it('should apply last page if trying to go to a non-existing page', () => {
      let apiRef;
      const GridTest = () => {
        const basicData = useData(20, 2);
        apiRef = useGridApiRef();

        return (
          <div style={{ width: 300, height: 300 }}>
            <XGrid {...basicData} apiRef={apiRef} pagination pageSize={1} />
          </div>
        );
      };

      render(<GridTest />);

      expect(getColumnValues()).to.deep.equal(['0']);
      act(() => {
        apiRef.current.setPage(50);
      });

      expect(getColumnValues()).to.deep.equal(['19']);
    });
  });

  describe('setPageSize', () => {
    it('should apply value', () => {
      let apiRef;
      const GridTest = () => {
        const [pageSize, setPageSize] = React.useState(5);
        const basicData = useData(20, 2);
        apiRef = useGridApiRef();

        return (
          <div style={{ width: 300, height: 300 }}>
            <XGrid
              {...basicData}
              apiRef={apiRef}
              autoHeight={isJSDOM}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              pagination
            />
          </div>
        );
      };

      render(<GridTest />);

      expect(getColumnValues()).to.deep.equal(['0', '1', '2', '3', '4']);
      act(() => {
        apiRef.current.setPageSize(2);
      });

      expect(getColumnValues()).to.deep.equal(['0', '1']);
    });
  });
});
