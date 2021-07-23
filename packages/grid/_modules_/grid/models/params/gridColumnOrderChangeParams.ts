import type { GridApi } from '../api';
import type { GridColDef } from '../colDef';

/**
 * Object passed as parameter of the column order change event.
 */
export interface GridColumnOrderChangeParams {
  /**
   * The HTMLElement column header element.
   */
  element?: HTMLElement | null;
  /**
   * The column field of the column that triggered the event.
   */
  field: string;
  /**
   * The column of the current header component.
   */
  colDef: GridColDef;
  /**
   * The target column index.
   */
  targetIndex: number;
  /**
   * The old column index.
   */
  oldIndex: number;
  /**
   * API ref that let you manipulate the grid.
   */
  api: GridApi;
}
