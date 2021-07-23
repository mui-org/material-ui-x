import { GridColDef, GridColumnsMeta, GridStateColDef } from '../colDef/gridColDef';

/**
 * The column API interface that is available in the grid [[apiRef]].
 */
export interface GridColumnApi {
  /**
   * Returns the [[GridColDef]] for the given `field`.
   * @param {string} field The column field.
   * @returns {{GridStateColDef}} The [[GridStateColDef]].
   */
  getColumn: (field: string) => GridStateColDef;
  /**
   * Returns an array of [[GridColDef]] containing all the column definitions.
   * @returns {GridStateColDef[]} An array of [[GridStateColDef]].
   */
  getAllColumns: () => GridStateColDef[];
  /**
   * Returns the currently visible columns.
   * @returns {GridStateColDef[]} An array of [[GridStateColDef]].
   */
  getVisibleColumns: () => GridStateColDef[];
  /**
   * Returns the [[GridColumnsMeta]] for each column.
   * @returns {GridColumnsMeta[]} All [[GridColumnsMeta]] objects.
   */
  getColumnsMeta: () => GridColumnsMeta;
  /**
   * Returns the index position of a column. By default, only the visible columns are considered.
   * Pass `false` to `useVisibleColumns` to consider all columns.
   * @param {string} field The column field.
   * @param {boolean} useVisibleColumns Determines if all columns or the visible ones should be considered.
   * @returns {number} The index position.
   */
  getColumnIndex: (field: string, useVisibleColumns?: boolean) => number;
  /**
   * Returns the left-position of a column relative to the inner border of the grid.
   * @param {string} field The column field.
   * @returns {number} The position in pixels.
   */
  getColumnPosition: (field: string) => number;
  /**
   * Updates the definition of a column.
   * @param {GridColDef} col The new [[GridColDef]] object.
   */
  updateColumn: (col: GridColDef) => void;
  /**
   * Updates the definition of multiple columns at the same time.
   * @param {GridColDef[]} cols The new column [[GridColDef]] objects.
   */
  updateColumns: (cols: GridColDef[]) => void;
  /**
   * Changes the visibility of the column referred by `field`.
   * @param {string} field The column to change visibility.
   * @param {boolean} isVisible Pass `true` to show the column, or `false` to hide it.
   */
  setColumnVisibility: (field: string, isVisible: boolean) => void;
  /**
   * Moves a column from its original position to the position given by `targetIndexPosition`.
   * @param {string} field The field name
   * @param {number} targetIndexPosition The new position (0-based).
   */
  setColumnIndex: (field: string, targetIndexPosition: number) => void;
  /**
   * Updates the width of a column.
   * @param {string} field The column field.
   * @param {number} width The new width.
   */
  setColumnWidth: (field: string, width: number) => void;
}
