import * as React from 'react';
import {
  GridContainerProps,
  GridOptions,
  GridRenderColumnsProps,
  GridVirtualizationApi,
  GridApiRef,
} from '../../../models/index';
import { isDeepEqual } from '../../../utils/utils';
import { useLogger } from '../../utils/useLogger';
import { GRID_COLUMNS_CHANGE, GRID_DEBOUNCED_RESIZE } from '../../../constants/eventsConstants';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import {
  gridColumnsMetaSelector,
  visibleGridColumnsSelector,
} from '../columns/gridColumnsSelector';
import { useGridSelector } from '../core/useGridSelector';

type UpdateRenderedColsFnType = (
  containerProps: GridContainerProps | null,
  scrollLeft: number,
) => boolean;
type UseVirtualColumnsReturnType = [
  React.MutableRefObject<GridRenderColumnsProps | null>,
  UpdateRenderedColsFnType,
];

// Uses binary search to avoid looping through all possible positions
function getIdxFromScroll(
  offset: number,
  positions: number[],
  sliceStart = 0,
  sliceEnd = positions.length,
): number {
  if (positions.length <= 0) {
    return -1;
  }

  if (sliceStart >= sliceEnd) {
    return sliceStart;
  }

  const pivot = sliceStart + Math.floor((sliceEnd - sliceStart) / 2);
  const itemOffset = positions[pivot];
  return offset <= itemOffset
    ? getIdxFromScroll(offset, positions, sliceStart, pivot)
    : getIdxFromScroll(offset, positions, pivot + 1, sliceEnd);
}

export const useGridVirtualColumns = (
  options: GridOptions,
  apiRef: GridApiRef,
): UseVirtualColumnsReturnType => {
  const logger = useLogger('useGridVirtualColumns');

  const renderedColRef = React.useRef<GridRenderColumnsProps | null>(null);
  const containerPropsRef = React.useRef<GridContainerProps | null>(null);
  const lastScrollLeftRef = React.useRef<number>(0);
  const columnsMeta = useGridSelector(apiRef, gridColumnsMetaSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);

  const getColumnIdxFromScroll = React.useCallback(
    (left: number) => getIdxFromScroll(left, columnsMeta.positions),
    [columnsMeta.positions],
  );

  const getColumnFromScroll = React.useCallback(
    (left: number) => {
      if (!visibleColumns.length) {
        return null;
      }
      return visibleColumns[getColumnIdxFromScroll(left)];
    },
    [getColumnIdxFromScroll, visibleColumns],
  );

  const updateRenderedCols: UpdateRenderedColsFnType = React.useCallback(
    (containerProps: GridContainerProps | null, scrollLeft: number) => {
      if (!containerProps) {
        return false;
      }

      containerPropsRef.current = containerProps;
      const windowWidth = containerProps.windowSizes.width;

      lastScrollLeftRef.current = scrollLeft;
      logger.debug(
        `GridColumns from ${getColumnFromScroll(scrollLeft)?.field} to ${
          getColumnFromScroll(scrollLeft + windowWidth)?.field
        }`,
      );
      const firstDisplayedIdx = getColumnIdxFromScroll(scrollLeft);
      const lastDisplayedIdx = getColumnIdxFromScroll(scrollLeft + windowWidth);
      const prevFirstColIdx = renderedColRef?.current?.firstColIdx || 0;
      const prevLastColIdx = renderedColRef?.current?.lastColIdx || 0;
      const columnBuffer = options.columnBuffer;
      const tolerance = columnBuffer > 1 ? columnBuffer - 1 : columnBuffer; // Math.floor(columnBuffer / 2);
      const diffFirst = Math.abs(firstDisplayedIdx - tolerance - prevFirstColIdx);
      const diffLast = Math.abs(lastDisplayedIdx + tolerance - prevLastColIdx);
      logger.debug(`Column buffer: ${columnBuffer}, tolerance: ${tolerance}`);
      logger.debug(`Previous values  => first: ${prevFirstColIdx}, last: ${prevLastColIdx}`);
      logger.debug(
        `Current displayed values  => first: ${firstDisplayedIdx}, last: ${lastDisplayedIdx}`,
      );
      logger.debug(`Difference with first: ${diffFirst} and last: ${diffLast} `);

      const lastVisibleColIdx = visibleColumns.length > 0 ? visibleColumns.length - 1 : 0;
      const firstColIdx =
        firstDisplayedIdx - columnBuffer >= 0 ? firstDisplayedIdx - columnBuffer : 0;
      const newRenderedColState = {
        leftEmptyWidth: columnsMeta.positions[firstColIdx],
        rightEmptyWidth: 0,
        firstColIdx,
        lastColIdx:
          lastDisplayedIdx + columnBuffer >= lastVisibleColIdx
            ? lastVisibleColIdx
            : lastDisplayedIdx + columnBuffer,
      };

      if (apiRef.current.state.scrollBar.hasScrollX) {
        newRenderedColState.rightEmptyWidth =
          columnsMeta.totalWidth -
          columnsMeta.positions[newRenderedColState.lastColIdx] -
          visibleColumns[newRenderedColState.lastColIdx].computedWidth;
      } else if (!options.disableExtendRowFullWidth) {
        newRenderedColState.rightEmptyWidth =
          apiRef.current.state.viewportSizes.width - columnsMeta.totalWidth;
      }

      if (!isDeepEqual(newRenderedColState, renderedColRef.current)) {
        renderedColRef.current = newRenderedColState;
        logger.debug('New columns state to render', newRenderedColState);
        return true;
      }
      logger.debug(`No rendering needed on columns`);
      return false;
    },
    [
      logger,
      getColumnFromScroll,
      getColumnIdxFromScroll,
      options.columnBuffer,
      options.disableExtendRowFullWidth,
      visibleColumns,
      columnsMeta.positions,
      columnsMeta.totalWidth,
      apiRef,
    ],
  );
  const virtualApi: Partial<GridVirtualizationApi> = {};
  useGridApiMethod(apiRef, virtualApi, 'ColumnVirtualizationApi');

  const resetRenderedColState = React.useCallback(() => {
    logger.debug('Clearing previous renderedColRef');
    renderedColRef.current = null;
  }, [logger, renderedColRef]);

  useGridApiEventHandler(apiRef, GRID_COLUMNS_CHANGE, resetRenderedColState);
  useGridApiEventHandler(apiRef, GRID_DEBOUNCED_RESIZE, resetRenderedColState);

  return [renderedColRef, updateRenderedCols];
};
