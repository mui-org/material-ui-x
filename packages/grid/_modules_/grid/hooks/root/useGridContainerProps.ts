import * as React from 'react';
import { GRID_DEBOUNCED_RESIZE } from '../../constants/eventsConstants';
import { GridApiRef } from '../../models/api/gridApiRef';
import {
  GridContainerProps,
  GridScrollBarState,
  GridViewportSizeState,
} from '../../models/gridContainerProps';
import { ElementSize } from '../../models/elementSize';
import { isDeepEqual } from '../../utils/utils';
import { gridColumnsTotalWidthSelector } from '../features/columns/gridColumnsSelector';
import { GridState } from '../features/core/gridState';
import { useGridSelector } from '../features/core/useGridSelector';
import { useGridState } from '../features/core/useGridState';
import { gridDensityRowHeightSelector } from '../features/density/densitySelector';
import { visibleGridRowCountSelector } from '../features/filter/gridFilterSelector';
import { gridPaginationSelector } from '../features/pagination/gridPaginationSelector';
import { optionsSelector } from '../utils/optionsSelector';
import { useLogger } from '../utils/useLogger';
import { useGridApiEventHandler } from './useGridApiEventHandler';

export const useGridContainerProps = (apiRef: GridApiRef) => {
  const logger = useLogger('useGridContainerProps');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const windowSizesRef = React.useRef<ElementSize>({ width: 0, height: 0 });
  const options = useGridSelector(apiRef, optionsSelector);
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  const columnsTotalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
  const visibleRowsCount = useGridSelector(apiRef, visibleGridRowCountSelector);
  const paginationState = useGridSelector(apiRef, gridPaginationSelector);
  const windowRef = apiRef.current.windowRef;

  const getVirtualRowCount = React.useCallback(() => {
    logger.debug('Calculating virtual row count.');
    if (options.pagination && !options.autoPageSize) {
      const rowsLeft = visibleRowsCount - paginationState.page * paginationState.pageSize;
      return rowsLeft > paginationState.pageSize ? paginationState.pageSize : rowsLeft;
    }
    return visibleRowsCount;
  }, [
    logger,
    options.autoPageSize,
    options.pagination,
    paginationState.page,
    paginationState.pageSize,
    visibleRowsCount,
  ]);

  const getScrollBar = React.useCallback(
    (rowsCount: number) => {
      logger.debug('Calculating scrollbar sizes.');

      let hasScrollX = columnsTotalWidth > windowSizesRef.current.width;
      const scrollBarSize = {
        y: 0,
        x: hasScrollX ? options.scrollbarSize! : 0,
      };

      if (rowsCount === 0) {
        return { hasScrollX, hasScrollY: false, scrollBarSize };
      }

      const requiredSize = rowsCount * rowHeight;

      const hasScrollY =
        !options.autoPageSize &&
        !options.autoHeight &&
        requiredSize + scrollBarSize.x > windowSizesRef.current.height;

      scrollBarSize.y = hasScrollY ? options.scrollbarSize! : 0;

      // We recalculate the scroll x to consider the size of the y scrollbar.
      hasScrollX = columnsTotalWidth + scrollBarSize.y > windowSizesRef.current.width;
      scrollBarSize.x = hasScrollX ? options.scrollbarSize! : 0;

      logger.debug(`Scrollbar size on axis x: ${scrollBarSize.x}, y: ${scrollBarSize.y}`);

      return { hasScrollX, hasScrollY, scrollBarSize };
    },
    [
      logger,
      columnsTotalWidth,
      options.scrollbarSize,
      options.autoPageSize,
      options.autoHeight,
      rowHeight,
    ],
  );

  const getViewport = React.useCallback(
    (rowsCount: number, scrollBarState: GridScrollBarState) => {
      if (!windowRef?.current) {
        return null;
      }

      logger.debug('Calculating container sizes.');

      const window = windowRef.current.getBoundingClientRect();
      windowSizesRef.current = { width: window.width, height: window.height };

      logger.debug(
        `window Size - W: ${windowSizesRef.current.width} H: ${windowSizesRef.current.height} `,
      );

      const viewportSize = {
        width: windowSizesRef.current!.width - scrollBarState.scrollBarSize.y,
        height: options.autoHeight
          ? rowsCount * rowHeight
          : windowSizesRef.current!.height - scrollBarState.scrollBarSize.x,
      };
      return viewportSize;
    },
    [logger, options.autoHeight, rowHeight, windowRef],
  );

  const getContainerProps = React.useCallback(
    (
      rowsCount: number,
      viewportSizes: GridViewportSizeState,
      scrollBarState: GridScrollBarState,
    ): GridContainerProps | null => {
      if (
        !windowRef ||
        !windowRef.current ||
        columnsTotalWidth === 0 ||
        Number.isNaN(columnsTotalWidth)
      ) {
        return null;
      }

      const requiredSize = rowsCount * rowHeight;
      const diff = requiredSize - windowSizesRef.current.height;
      // we activate virtualization when we have more than 2 rows outside the viewport
      const isVirtualized = diff > rowHeight * 2;

      if (options.autoPageSize || options.autoHeight || !isVirtualized) {
        const viewportFitHeightSize = Math.floor(viewportSizes.height / rowHeight);
        const viewportPageSize =
          scrollBarState.hasScrollY || rowsCount < viewportFitHeightSize
            ? rowsCount
            : viewportFitHeightSize;

        const requiredHeight = Math.max(viewportPageSize * rowHeight, 1);

        const indexes: GridContainerProps = {
          isVirtualized: false,
          virtualRowsCount: viewportPageSize,
          renderingZonePageSize: viewportPageSize,
          viewportPageSize,
          totalSizes: {
            width: columnsTotalWidth,
            height: requiredHeight,
          },
          dataContainerSizes: {
            width: columnsTotalWidth,
            height: requiredHeight,
          },
          renderingZoneScrollHeight: requiredHeight - viewportSizes.height,
          renderingZone: {
            width: columnsTotalWidth,
            height: requiredHeight,
          },
          windowSizes: windowSizesRef.current,
          lastPage: 1,
        };
        logger.debug('Fixed container props', indexes);
        return indexes;
      }
      const viewportPageSize = Math.floor(viewportSizes.height / rowHeight);

      // Number of pages required to render the full set of rows in the viewport
      const viewportMaxPages =
        viewportPageSize > 0 ? Math.ceil(rowsCount / viewportPageSize) - 1 : 0;

      // We multiply by 2 for virtualization to work with useGridVirtualRows scroll system
      const renderingZonePageSize = viewportPageSize * 2;
      const renderingZoneHeight = renderingZonePageSize * rowHeight;
      const renderingZoneMaxScrollHeight = renderingZoneHeight - viewportSizes.height;

      let totalHeight = viewportMaxPages * renderingZoneMaxScrollHeight + viewportSizes.height;
      const rowsLeftOnLastPage = rowsCount % viewportPageSize;
      if (rowsLeftOnLastPage > 0) {
        totalHeight = totalHeight - renderingZoneMaxScrollHeight + rowsLeftOnLastPage * rowHeight;
      }

      const indexes: GridContainerProps = {
        isVirtualized,
        virtualRowsCount: rowsCount,
        viewportPageSize,
        totalSizes: {
          width: columnsTotalWidth,
          height: totalHeight,
        },
        dataContainerSizes: {
          width: columnsTotalWidth,
          height: totalHeight,
        },
        renderingZonePageSize,
        renderingZone: {
          width: columnsTotalWidth,
          height: renderingZoneHeight,
        },
        renderingZoneScrollHeight: renderingZoneMaxScrollHeight,
        windowSizes: windowSizesRef.current,
        lastPage: viewportMaxPages,
      };

      logger.debug('virtualized container props', indexes);
      return indexes;
    },
    [windowRef, columnsTotalWidth, rowHeight, options.autoPageSize, options.autoHeight, logger],
  );

  const updateStateIfChanged = React.useCallback(
    (
      shouldUpdate: (oldState: GridState) => boolean,
      newStateUpdate: (state: GridState) => GridState,
    ) => {
      let update = false;
      setGridState((state) => {
        update = shouldUpdate(state);
        if (update) {
          return newStateUpdate(state);
        }
        return state;
      });
      if (update) {
        forceUpdate();
      }
    },
    [forceUpdate, setGridState],
  );

  const refreshContainerSizes = React.useCallback(() => {
    logger.debug('Refreshing container sizes');
    const rowsCount = getVirtualRowCount();
    const scrollBar = getScrollBar(rowsCount);

    const viewportSizes = getViewport(rowsCount, scrollBar);
    if (!viewportSizes) {
      return;
    }

    updateStateIfChanged(
      (state) => state.scrollBar !== scrollBar,
      (state) => ({ ...state, scrollBar }),
    );

    updateStateIfChanged(
      (state) => state.viewportSizes !== viewportSizes,
      (state) => ({ ...state, viewportSizes }),
    );

    const containerState = getContainerProps(rowsCount, viewportSizes, scrollBar);
    updateStateIfChanged(
      (state) => !isDeepEqual(state.containerSizes, containerState),
      (state) => ({ ...state, containerSizes: containerState }),
    );
  }, [
    getContainerProps,
    getScrollBar,
    getViewport,
    getVirtualRowCount,
    logger,
    updateStateIfChanged,
  ]);

  React.useEffect(() => {
    refreshContainerSizes();
  }, [gridState.columns, gridState.options.hideFooter, refreshContainerSizes, visibleRowsCount]);

  useGridApiEventHandler(apiRef, GRID_DEBOUNCED_RESIZE, refreshContainerSizes);
};
