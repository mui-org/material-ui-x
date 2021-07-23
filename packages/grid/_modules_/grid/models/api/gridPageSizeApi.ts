/**
 * The page size API interface that is available in the grid [[apiRef]].
 */
export interface GridPageSizeApi {
  /**
   * Sets the number of displayed rows to the value given by `pageSize`.
   * @param {number} pageSize The new number of displayed rows.
   */
  setPageSize: (pageSize: number) => void;
}
