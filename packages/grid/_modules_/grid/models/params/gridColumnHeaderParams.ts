import type { GridApi } from '../api';
import type { GridColDef } from '../colDef';

/**
 * Object passed as parameter in the column [[GridColDef]] header renderer.
 */
export interface GridColumnHeaderParams {
  /**
   * The column field of the column that triggered the event
   */
  field: string;
  /**
   * The column of the current header component.
   */
  colDef: GridColDef;
  /**
   * API ref that let you manipulate the grid.
   */
  api: GridApi;
}
