import {
  getGridColDef,
  getGridDefaultColumnTypes,
  GRID_STRING_COL_DEF,
  gridCheckboxSelectionColDef,
  GridColDef,
  GridColumnLookup,
  GridColumns,
  GridColumnTypesRecord,
  GridColumnsState,
  GridLocaleText,
  GridStateColDef,
  GridTranslationKeys,
  Logger,
} from '../../../models';
import { mergeGridColTypes } from '../../../utils';

export type RawGridColumnsState = Omit<GridColumnsState, 'lookup'> & {
  lookup: { [field: string]: GridColDef | GridStateColDef };
};

export function getStateColumns(
  columns: (GridColDef | GridStateColDef)[],
  viewportWidth: number,
): GridStateColDef[] {
  let totalFlexUnits = 0;
  let widthToAllocateInFlex = viewportWidth;

  const stateColumns: GridStateColDef[] = [];

  // Compute the width of non-flex columns and how much width must be allocated between the flex columns
  for (let i = 0; i < columns.length; i += 1) {
    const column = { ...columns[i] } as GridStateColDef;

    if (column.hide) {
      column.computedWidth = 0;
    } else {
      const minWidth = column.minWidth ?? GRID_STRING_COL_DEF.minWidth!;

      if (column.flex && column.flex > 0) {
        totalFlexUnits += column.flex;
        column.computedWidth = minWidth;
      } else {
        const computedWidth = Math.max(column.width ?? GRID_STRING_COL_DEF.width!, minWidth);
        column.computedWidth = computedWidth;
        widthToAllocateInFlex -= computedWidth;
      }
    }

    stateColumns.push(column);
  }

  // Compute the width of flex columns
  if (totalFlexUnits && widthToAllocateInFlex > 0) {
    const widthPerFlexUnit = totalFlexUnits > 0 ? widthToAllocateInFlex / totalFlexUnits : 0;

    for (let i = 0; i < stateColumns.length; i += 1) {
      const column = stateColumns[i];

      if (!column.hide && column.flex && column.flex > 0) {
        stateColumns[i].computedWidth = Math.max(
          widthPerFlexUnit * column.flex,
          column.computedWidth,
        );
      }
    }
  }

  return stateColumns;
}

export function hydrateColumns(
  columns: GridColumns,
  columnTypes: GridColumnTypesRecord,
  withCheckboxSelection: boolean,
  logger: Logger,
  getLocaleText: <T extends GridTranslationKeys>(key: T) => GridLocaleText[T],
): GridColumns {
  logger.debug('Hydrating GridColumns with default definitions');
  const mergedColTypes = mergeGridColTypes(getGridDefaultColumnTypes(), columnTypes);
  const extendedColumns = columns.map((c) => ({ ...getGridColDef(mergedColTypes, c.type), ...c }));

  if (withCheckboxSelection) {
    const checkboxSelection = { ...gridCheckboxSelectionColDef };
    checkboxSelection.headerName = getLocaleText('checkboxSelectionHeaderName');
    return [checkboxSelection, ...extendedColumns];
  }

  return extendedColumns;
}

export function toLookup(logger: Logger, allColumns: GridStateColDef[]): GridColumnLookup {
  logger.debug('Building columns lookup');
  return allColumns.reduce((lookup, col) => {
    lookup[col.field] = col;
    return lookup;
  }, {});
}

export const upsertColumnsState = (
  columnUpdates: GridColDef[],
  prevColumnsState?: GridColumnsState,
) => {
  const newState: RawGridColumnsState = {
    all: [...(prevColumnsState?.all ?? [])],
    lookup: { ...(prevColumnsState?.lookup ?? {}) },
  };

  columnUpdates.forEach((newColumn) => {
    if (newState.lookup[newColumn.field] == null) {
      // New Column
      newState.lookup[newColumn.field] = newColumn;
      newState.all.push(newColumn.field);
    } else {
      newState.lookup[newColumn.field] = { ...newState.lookup[newColumn.field], ...newColumn };
    }
  });

  return newState;
};
