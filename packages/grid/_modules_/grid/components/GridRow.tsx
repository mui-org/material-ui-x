import * as React from 'react';
import clsx from 'clsx';
import {
  GRID_ROW_DOUBLE_CLICK,
  GRID_ROW_CLICK,
  GRID_ROW_CONTEXT_MENU,
  GRID_ROW_ENTER,
  GRID_ROW_LEAVE,
  GRID_ROW_OUT,
  GRID_ROW_OVER,
} from '../constants/eventsConstants';
import { GridRowId } from '../models';
import { isFunction } from '../utils';
import { gridDensityRowHeightSelector } from '../hooks/features/density';
import { useGridApiContext } from '../hooks/root/useGridApiContext';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { optionsSelector } from '../hooks/utils/optionsSelector';

export interface GridRowProps {
  id: GridRowId;
  selected: boolean;
  className: string;
  rowIndex: number;
  children: React.ReactNode;
}

export function GridRow(props: GridRowProps) {
  const { selected, id, className, rowIndex, children } = props;
  const ariaRowIndex = rowIndex + 2; // 1 for the header row and 1 as it's 1 based
  const apiRef = useGridApiContext();
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  const { classes, getRowClassName } = useGridSelector(apiRef, optionsSelector);

  const publish = React.useCallback(
    (eventName: string) => (event: React.MouseEvent) => {
      // Ignore portal
      // The target is not an element when triggered by a Select inside the cell
      // See https://github.com/mui-org/material-ui/issues/10534
      if (
        (event.target as any).nodeType === 1 &&
        !event.currentTarget.contains(event.target as Element)
      ) {
        return;
      }

      apiRef!.current.publishEvent(eventName, apiRef?.current.getRowParams(id), event);
    },
    [apiRef, id],
  );

  const mouseEventsHandlers = React.useMemo(
    () => ({
      onClick: publish(GRID_ROW_CLICK),
      onDoubleClick: publish(GRID_ROW_DOUBLE_CLICK),
      onContextMenu: publish(GRID_ROW_CONTEXT_MENU),
      onMouseOver: publish(GRID_ROW_OVER),
      onMouseOut: publish(GRID_ROW_OUT),
      onMouseEnter: publish(GRID_ROW_ENTER),
      onMouseLeave: publish(GRID_ROW_LEAVE),
    }),
    [publish],
  );

  const style = {
    maxHeight: rowHeight,
    minHeight: rowHeight,
  };

  const rowClassName =
    isFunction(getRowClassName) && getRowClassName(apiRef!.current.getRowParams(id));
  const cssClasses = clsx(className, rowClassName, classes?.row, {
    'Mui-selected': selected,
  });

  return (
    <div
      key={id}
      data-id={id}
      data-rowindex={rowIndex}
      role="row"
      className={cssClasses}
      aria-rowindex={ariaRowIndex}
      aria-selected={selected}
      style={style}
      {...mouseEventsHandlers}
    >
      {children}
    </div>
  );
}
