import type { GridColumns } from '../colDef';
import type { GridApiRef } from '../api';

/**
 * Object passed as parameter in the onRowsScrollEnd callback.
 */
export interface GridRowScrollEndParams {
  /**
   * The number of rows that fit in the viewport.
   */
  viewportPageSize: number;
  /**
   * The number of rows allocated for the rendered zone.
   */
  virtualRowsCount: number;
  /**
   * The grid visible columns.
   */
  visibleColumns: GridColumns;
  /**
   * API ref that let you manipulate the grid.
   */
  api: GridApiRef;
}
