// TODO replace with { unstable_getScrollbarSize } from '@material-ui/utils'
import { ownerDocument } from '@material-ui/core/utils';
import * as React from 'react';
import { GridComponentProps } from '../../GridComponentProps';
import { GridApiRef } from '../../models/api/gridApiRef';
import { useEnhancedEffect } from '../../utils/material-ui-utils';
import { allGridColumnsSelector } from '../features/columns/gridColumnsSelector';
import { useGridSelector } from '../features/core/useGridSelector';
import { useGridState } from '../features/core/useGridState';
import { useLogger } from './useLogger';

export function getScrollbarSize(doc: Document, element: HTMLElement): number {
  const scrollDiv = doc.createElement('div');
  scrollDiv.style.width = '99px';
  scrollDiv.style.height = '99px';
  scrollDiv.style.position = 'absolute';
  scrollDiv.style.overflow = 'scroll';
  scrollDiv.className = 'scrollDiv';
  element.appendChild(scrollDiv);
  const scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  element.removeChild(scrollDiv);

  return scrollbarSize;
}

export function useGridScrollbarSizeDetector(
  apiRef: GridApiRef,
  { scrollbarSize }: Pick<GridComponentProps, 'scrollbarSize'>,
) {
  const logger = useLogger('useGridScrollbarSizeDetector');
  const [detectedScrollBarSize, setDetectedScrollBarSize] = React.useState<number>(0);
  const [, setGridState] = useGridState(apiRef);
  const hasColumns = useGridSelector(apiRef, allGridColumnsSelector).length > 0;

  const detectScrollbarSize = React.useCallback(() => {
    let measuredScrollbarSize = 0;
    if (apiRef.current?.rootElementRef?.current) {
      const doc = ownerDocument(apiRef.current.rootElementRef!.current as HTMLElement);
      measuredScrollbarSize = getScrollbarSize(
        doc,
        apiRef.current.rootElementRef!.current as HTMLElement,
      );
      logger.debug(`Detected scroll bar size ${measuredScrollbarSize}.`);
    }
    setDetectedScrollBarSize(measuredScrollbarSize);
  }, [apiRef, logger]);

  useEnhancedEffect(() => {
    if (hasColumns && scrollbarSize == null) {
      detectScrollbarSize();
    }
  }, [detectScrollbarSize, hasColumns, scrollbarSize]);

  React.useEffect(() => {
    if (scrollbarSize == null) {
      setGridState((state) => ({
        ...state,
        options: {
          ...state.options,
          scrollbarSize: detectedScrollBarSize,
        },
      }));
    }
  }, [scrollbarSize, detectedScrollBarSize, setGridState]);
}
