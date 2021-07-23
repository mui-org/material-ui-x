import * as React from 'react';
import { GridApiRef } from '../../../models';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridPageSizeApi } from '../../../models/api/gridPageSizeApi';
import { useGridApiMethod } from '../../root';
import { GRID_PAGE_SIZE_CHANGE } from '../../../constants';
import { useLogger } from '../../utils';
import { useGridSelector, useGridState } from '../core';
import { visibleGridRowCountSelector } from '../filter';
import { gridContainerSizesSelector } from '../../root/gridContainerSizesSelector';

export const useGridPageSize = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'pageSize' | 'onPageSizeChange' | 'autoPageSize'>,
) => {
  const logger = useLogger('useGridPageSize');
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const visibleRowCount = useGridSelector(apiRef, visibleGridRowCountSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);

  const setPageSize = React.useCallback(
    (pageSize: number) => {
      logger.debug(`Setting page size to ${pageSize}`);

      setGridState((oldState) => ({
        ...oldState,
        pagination: {
          ...oldState.pagination,
          pageSize,
        },
      }));
      forceUpdate();
    },
    [setGridState, forceUpdate, logger],
  );

  React.useEffect(() => {
    apiRef.current.updateControlState({
      stateId: 'pageSize',
      propModel: props.pageSize,
      propOnChange: props.onPageSizeChange,
      stateSelector: (state) => state.pagination.pageSize,
      onChangeCallback: (pageSize) => {
        apiRef.current.publishEvent(GRID_PAGE_SIZE_CHANGE, pageSize);
      },
    });
  }, [apiRef, props.pageSize, props.onPageSizeChange]);

  React.useEffect(() => {
    const autoPageSize = containerSizes?.viewportPageSize;
    const prevPageSize = apiRef.current.getState().pagination.pageSize;

    let pageSize = prevPageSize;

    if (props.pageSize != null) {
      pageSize = props.pageSize;
    } else if (props.autoPageSize) {
      pageSize = autoPageSize ?? 0;
    }

    if (pageSize !== prevPageSize) {
      if (props.autoPageSize) {
        apiRef.current.publishEvent(GRID_PAGE_SIZE_CHANGE, autoPageSize);
      }

      setGridState((oldState) => ({
        ...oldState,
        pagination: {
          ...oldState.pagination,
          pageSize,
        },
      }));
      forceUpdate();
    }
  }, [
    apiRef,
    setGridState,
    forceUpdate,
    visibleRowCount,
    props.autoPageSize,
    props.pageSize,
    containerSizes?.viewportPageSize,
  ]);

  const pageSizeApi: GridPageSizeApi = {
    setPageSize,
  };

  useGridApiMethod(apiRef, pageSizeApi, 'GridPageSizeApi');
};
