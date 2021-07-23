import * as React from 'react';
import { GridFilterInputValueProps } from '../components/panel/filterPanel/GridFilterInputValueProps';
import { GridFilterItem } from './gridFilterItem';
import { GridCellParams } from './params/gridCellParams';
import type { GridColDef } from './colDef';

export interface GridFilterOperator {
  label?: string;
  value: string;
  getApplyFilterFn: (
    filterItem: GridFilterItem,
    column: GridColDef,
  ) => null | ((params: GridCellParams) => boolean);
  InputComponent?: React.JSXElementConstructor<GridFilterInputValueProps>;
  InputComponentProps?: Record<string, any>;
}
