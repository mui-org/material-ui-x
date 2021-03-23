import * as React from 'react';
import { GridApiContext } from '../../components/GridApiContext';
import { GridBaseComponentProps } from '../../models/params/gridBaseComponentProps';
import { optionsSelector } from '../utils/optionsSelector';
import { visibleGridColumnsSelector } from './columns/gridColumnsSelector';
import { useGridSelector } from './core/useGridSelector';
import { useGridState } from './core/useGridState';
import { unorderedGridRowModelsSelector } from './rows/gridRowsSelector';

export const useGridBaseComponentProps = () => {
  const apiRef = React.useContext(GridApiContext);
  const options = useGridSelector(apiRef, optionsSelector);
  const rows = useGridSelector(apiRef, unorderedGridRowModelsSelector);
  const columns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const [state] = useGridState(apiRef!);

  const baseComponentProps: GridBaseComponentProps = React.useMemo(
    () => ({
      state,
      rows,
      columns,
      options,
      api: apiRef!,
      rootElement: apiRef!.current.rootElementRef!,
    }),
    [state, rows, columns, options, apiRef],
  );

  return baseComponentProps;
};
