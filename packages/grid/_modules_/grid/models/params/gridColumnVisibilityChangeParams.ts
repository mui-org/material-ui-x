import type { GridApiRef } from '../api';
import type { GridColDef } from '../colDef';

/**
 * Object passed as parameter of the column visibility change event.
 */
export interface GridColumnVisibilityChangeParams {
  /**
   * The field of the column which visibility changed.
   */
  field: string;
  /**
   * The column of the current header component.
   */
  colDef: GridColDef;
  /**
   * API ref that let you manipulate the grid.
   */
  api: GridApiRef;
  /**
   * The visibility state of the column.
   */
  isVisible: boolean;
}
