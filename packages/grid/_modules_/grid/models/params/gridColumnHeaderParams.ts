/**
 * Object passed as parameter in the column [[GridColDef]] header renderer.
 */
export interface GridColumnHeaderParams {
  /**
   * The HTMLElement column header element.
   */
  getElement: (field: string) => HTMLElement | null;
  /**
   * The column field of the column that triggered the event
   */
  field: string;
  /**
   * The column of the current header component.
   */
  colDef: any;
  /**
   * API ref that let you manipulate the grid.
   */
  api: any;
}
