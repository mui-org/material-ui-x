import type { GridApiRef } from '../api';
import type { GridColDef } from '../colDef';

/**
 * Object passed as parameter of the column resize event.
 */
export interface GridColumnResizeParams {
  /**
   * The HTMLElement column header element.
   */
  element?: HTMLElement | null;
  /**
   * The column of the current header component.
   */
  colDef: GridColDef;
  /**
   * API ref that let you manipulate the grid.
   */
  api: GridApiRef;
  /**
   * The width of the column.
   */
  width: number;
}
