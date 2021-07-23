import { GridState } from '../../hooks/features/core/gridState';
import { GridApi } from '../api';

export interface GridStateChangeParams {
  state: GridState;
  api: GridApi;
}
