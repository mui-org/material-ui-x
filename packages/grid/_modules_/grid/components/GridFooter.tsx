import * as React from 'react';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { gridPaginationSelector } from '../hooks/features/pagination/gridPaginationSelector';
import { gridRowCountSelector } from '../hooks/features/rows/gridRowsSelector';
import { selectedGridRowsCountSelector } from '../hooks/features/selection/gridSelectionSelector';
import { visibleGridRowCountSelector } from '../hooks/features/filter/gridFilterSelector';
import { optionsSelector } from '../hooks/utils/optionsSelector';
import { useGridApiContext } from '../hooks/root/useGridApiContext';
import { GridRowCount } from './GridRowCount';
import { GridSelectedRowCount } from './GridSelectedRowCount';
import { GridFooterContainer, GridFooterContainerProps } from './containers/GridFooterContainer';

export const GridFooter = React.forwardRef<HTMLDivElement, GridFooterContainerProps>(
  function GridFooter(props, ref) {
    const apiRef = useGridApiContext();
    const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
    const options = useGridSelector(apiRef, optionsSelector);
    const selectedRowCount = useGridSelector(apiRef, selectedGridRowsCountSelector);
    const paginationState = useGridSelector(apiRef, gridPaginationSelector);
    const visibleRowCount = useGridSelector(apiRef, visibleGridRowCountSelector);

    const SelectedRowCountElement =
      !options.hideFooterSelectedRowCount && selectedRowCount > 0 ? (
        <GridSelectedRowCount selectedRowCount={selectedRowCount} />
      ) : (
        <div />
      );

    const RowCountElement =
      !options.hideFooterRowCount && !options.pagination ? (
        <GridRowCount rowCount={totalRowCount} visibleRowCount={visibleRowCount} />
      ) : null;

    const PaginationComponent =
      !!options.pagination &&
      paginationState.pageSize != null &&
      !options.hideFooterPagination &&
      apiRef?.current.components.Pagination;

    const PaginationElement = PaginationComponent && (
      <PaginationComponent {...apiRef?.current.componentsProps?.pagination} />
    );

    return (
      <GridFooterContainer ref={ref} {...props}>
        {SelectedRowCountElement}
        {RowCountElement}
        {PaginationElement}
      </GridFooterContainer>
    );
  },
);
