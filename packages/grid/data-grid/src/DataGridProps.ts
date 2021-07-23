import { GridComponentProps } from '../../_modules_/grid/GridComponentProps';

export const MAX_PAGE_SIZE = 100;

/**
 * The grid component react props interface.
 */
export type DataGridProps = Omit<
  GridComponentProps,
  | 'apiRef'
  | 'checkboxSelectionVisibleOnly'
  | 'disableColumnResize'
  | 'disableColumnReorder'
  | 'disableMultipleColumnsFiltering'
  | 'disableMultipleColumnsSorting'
  | 'disableMultipleSelection'
  | 'licenseStatus'
  | 'options'
  | 'onRowsScrollEnd'
  | 'pagination'
  | 'scrollEndThreshold'
> & {
  apiRef?: undefined;
  checkboxSelectionVisibleOnly?: false;
  disableColumnResize?: true;
  disableColumnReorder?: true;
  disableMultipleColumnsFiltering?: true;
  disableMultipleColumnsSorting?: true;
  disableMultipleSelection?: true;
  onRowsScrollEnd?: undefined;
  pagination?: true;
};
