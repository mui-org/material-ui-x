import { FilterModel } from '../../hooks/features/filter/FilterModelState';
import { FilterItem, LinkOperator } from '../filterItem';
import { FilterModelParams } from '../params/filterModelParams';

export interface FilterApi {
  showFilterPanel: (targetColumnField?: string) => void;
  upsertFilter: (item: FilterItem) => void;
  applyFilters: () => void;
  deleteFilter: (item: FilterItem) => void;
  applyFilterLinkOperator: (operator: LinkOperator) => void;
  onFilterModelChange: (handler: (params: FilterModelParams)=> void)=> void
  setFilterModel: (model: FilterModel)=> void;
}
