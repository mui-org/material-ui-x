import { GridCellMode, GridCellValue } from '../gridCell';
import { GridEditRowsModel, GridEditCellProps } from '../gridEditRowModel';
import { GridRowId } from '../gridRows';

export interface GridEditCellPropsParams {
  id: GridRowId;
  field: string;
  props: GridEditCellProps;
}

export interface GridEditCellValueParams {
  id: GridRowId;
  field: string;
  value: GridCellValue;
}

export interface GridCellModeChangeParams {
  id: GridRowId;
  field: string;
  api: any;
  mode: GridCellMode;
}

export interface GridEditRowModelParams {
  model: GridEditRowsModel;
  api: any;
}

export interface GridCommitCellChangeParams {
  id: GridRowId;
  field: string;
}

export interface GridCommitRowChangeParams {
  id: GridRowId;
}
