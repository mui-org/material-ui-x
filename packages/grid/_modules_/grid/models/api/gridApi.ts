import { GridColumnApi } from './gridColumnApi';
import { GridColumnMenuApi } from './gridColumnMenuApi';
import { GridComponentsApi } from './gridComponentsApi';
import { GridControlStateApi } from './gridControlStateApi';
import { GridCoreApi } from './gridCoreApi';
import { GridClipboardApi } from './gridClipboardApi';
import { GridCsvExportApi } from './gridCsvExportApi';
import { GridDensityApi } from './gridDensityApi';
import { GridEditRowApi } from './gridEditRowApi';
import { GridEventsApi } from './gridEventsApi';
import { GridFilterApi } from './gridFilterApi';
import { GridFocusApi } from './gridFocusApi';
import { GridLocaleTextApi } from './gridLocaleTextApi';
import { GridPageApi } from './gridPageApi';
import { GridPageSizeApi } from './gridPageSizeApi';
import { GridParamsApi } from './gridParamsApi';
import { GridPreferencesPanelApi } from './gridPreferencesPanelApi';
import { GridRowApi } from './gridRowApi';
import { GridSelectionApi } from './gridSelectionApi';
import { GridSortApi } from './gridSortApi';
import { GridStateApi } from './gridStateApi';
import { GridVirtualizationApi } from './gridVirtualizationApi';

/**
 * The full grid API.
 */
export interface GridApi
  extends GridCoreApi,
    GridComponentsApi,
    GridStateApi,
    GridDensityApi,
    GridEventsApi,
    GridRowApi,
    GridEditRowApi,
    GridParamsApi,
    GridColumnApi,
    GridSelectionApi,
    GridSortApi,
    GridVirtualizationApi,
    GridPageApi,
    GridPageSizeApi,
    GridCsvExportApi,
    GridFocusApi,
    GridFilterApi,
    GridColumnMenuApi,
    GridPreferencesPanelApi,
    GridLocaleTextApi,
    GridControlStateApi,
    GridClipboardApi {}
