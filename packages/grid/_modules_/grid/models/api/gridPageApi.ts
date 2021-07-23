/**
 * The page API interface that is available in the grid [[apiRef]].
 */
export interface GridPageApi {
  /**
   * Sets the displayed page to the value given by `page`.
   * @param {number} page The new page number
   */
  setPage: (page: number) => void;
}
