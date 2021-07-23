import { createSelector } from 'reselect';
import {
  GridColumnLookup,
  GridColumnsMeta,
  GridStateColDef,
} from '../../../models/colDef/gridColDef';
import { GridState } from '../core/gridState';

export const gridColumnsSelector = (state: GridState) => state.columns;
export const allGridColumnsFieldsSelector = (state: GridState) => state.columns.all;
export const gridColumnLookupSelector = (state: GridState) => state.columns.lookup;
export const allGridColumnsSelector = createSelector<
  GridState,
  string[],
  GridColumnLookup,
  GridStateColDef[]
>(allGridColumnsFieldsSelector, gridColumnLookupSelector, (allFields, lookup) =>
  allFields.map((field) => lookup[field]),
);
export const visibleGridColumnsSelector = createSelector<
  GridState,
  GridStateColDef[],
  GridStateColDef[]
>(allGridColumnsSelector, (columns) => columns.filter((c) => c.field != null && !c.hide));

export const gridColumnsMetaSelector = createSelector<
  GridState,
  GridStateColDef[],
  GridColumnsMeta
>(visibleGridColumnsSelector, (visibleColumns) => {
  const positions: number[] = [];

  const totalWidth = visibleColumns.reduce((totalW, curCol) => {
    positions.push(totalW);
    return totalW + curCol.computedWidth;
  }, 0);

  return { totalWidth, positions };
});

export const filterableGridColumnsSelector = createSelector<
  GridState,
  GridStateColDef[],
  GridStateColDef[]
>(allGridColumnsSelector, (columns) => columns.filter((col) => col.filterable));
export const filterableGridColumnsIdsSelector = createSelector<
  GridState,
  GridStateColDef[],
  string[]
>(filterableGridColumnsSelector, (columns) => columns.map((col) => col.field));

export const visibleGridColumnsLengthSelector = createSelector<
  GridState,
  GridStateColDef[],
  number
>(visibleGridColumnsSelector, (visibleColumns) => visibleColumns.length);
export const gridColumnsTotalWidthSelector = createSelector<GridState, GridColumnsMeta, number>(
  gridColumnsMetaSelector,
  (meta: GridColumnsMeta) => meta.totalWidth,
);
