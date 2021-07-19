import * as React from 'react';
import { ownerDocument, capitalize } from '@material-ui/core/utils';
import clsx from 'clsx';
import {
  GRID_CELL_BLUR,
  GRID_CELL_CLICK,
  GRID_CELL_DOUBLE_CLICK,
  GRID_CELL_CONTEXT_MENU,
  GRID_CELL_ENTER,
  GRID_CELL_FOCUS,
  GRID_CELL_KEY_DOWN,
  GRID_CELL_LEAVE,
  GRID_CELL_MOUSE_DOWN,
  GRID_CELL_MOUSE_UP,
  GRID_CELL_OUT,
  GRID_CELL_OVER,
  GRID_CELL_DRAG_START,
  GRID_CELL_DRAG_ENTER,
  GRID_CELL_DRAG_OVER,
} from '../../constants/eventsConstants';
import { GRID_CSS_CLASS_PREFIX } from '../../constants/cssClassesConstants';
import { GridAlignment, GridCellMode, GridCellValue, GridRowId } from '../../models/index';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';

export interface GridCellProps {
  align: GridAlignment;
  className?: string;
  colIndex: number;
  field: string;
  rowId: GridRowId;
  formattedValue?: GridCellValue;
  hasFocus?: boolean;
  height: number;
  isEditable?: boolean;
  isSelected?: boolean;
  rowIndex: number;
  showRightBorder?: boolean;
  value?: GridCellValue;
  width: number;
  cellMode?: GridCellMode;
  children: React.ReactNode;
  tabIndex: 0 | -1;
}

export const GridCell = React.memo(function GridCell(props: GridCellProps) {
  const {
    align,
    className,
    children,
    colIndex,
    cellMode,
    field,
    formattedValue,
    hasFocus,
    height,
    isEditable,
    isSelected,
    rowIndex,
    rowId,
    showRightBorder,
    tabIndex,
    value,
    width,
  } = props;

  const valueToRender = formattedValue == null ? value : formattedValue;
  const cellRef = React.useRef<HTMLDivElement>(null);
  const apiRef = useGridApiContext();

  const cssClasses = clsx(className, `${GRID_CSS_CLASS_PREFIX}-cell--text${capitalize(align)}`, {
    [`${GRID_CSS_CLASS_PREFIX}-withBorder`]: showRightBorder,
    [`${GRID_CSS_CLASS_PREFIX}-cell--editable`]: isEditable,
  });

  const publishBlur = React.useCallback(
    (eventName: string) => (event: React.FocusEvent<HTMLDivElement>) => {
      // We don't trigger blur when the focus is on an element in the cell.
      if (
        event.relatedTarget &&
        event.currentTarget.contains(event.relatedTarget as HTMLDivElement)
      ) {
        return;
      }

      const params = apiRef!.current.getCellParams(rowId, field || '');
      apiRef!.current.publishEvent(eventName, params, event);
    },
    [apiRef, field, rowId],
  );

  const publishMouseUp = React.useCallback(
    (eventName: string) => (event: React.MouseEvent) => {
      const params = apiRef!.current.getCellParams(rowId, field || '');
      apiRef!.current.publishEvent(eventName, params, event);
    },
    [apiRef, field, rowId],
  );

  const publish = React.useCallback(
    (eventName: string) => (event: React.SyntheticEvent) => {
      // Ignore portal
      // The target is not an element when triggered by a Select inside the cell
      // See https://github.com/mui-org/material-ui/issues/10534
      if (
        (event.target as any).nodeType === 1 &&
        !event.currentTarget.contains(event.target as Element)
      ) {
        return;
      }

      apiRef!.current.publishEvent(
        eventName,
        apiRef!.current.getCellParams(rowId!, field || ''),
        event,
      );
    },
    [apiRef, field, rowId],
  );

  const eventsHandlers = React.useMemo(
    () => ({
      onClick: publish(GRID_CELL_CLICK),
      onDoubleClick: publish(GRID_CELL_DOUBLE_CLICK),
      onContextMenu: publish(GRID_CELL_CONTEXT_MENU),
      onMouseDown: publish(GRID_CELL_MOUSE_DOWN),
      onMouseUp: publishMouseUp(GRID_CELL_MOUSE_UP),
      onMouseOver: publish(GRID_CELL_OVER),
      onMouseOut: publish(GRID_CELL_OUT),
      onMouseEnter: publish(GRID_CELL_ENTER),
      onMouseLeave: publish(GRID_CELL_LEAVE),
      onKeyDown: publish(GRID_CELL_KEY_DOWN),
      onBlur: publishBlur(GRID_CELL_BLUR),
      onFocus: publish(GRID_CELL_FOCUS),
      onDragStart: publish(GRID_CELL_DRAG_START),
      onDragEnter: publish(GRID_CELL_DRAG_ENTER),
      onDragOver: publish(GRID_CELL_DRAG_OVER),
    }),
    [publish, publishBlur, publishMouseUp],
  );

  const style = {
    minWidth: width,
    maxWidth: width,
    lineHeight: `${height - 1}px`,
    minHeight: height,
    maxHeight: height,
  };

  React.useLayoutEffect(() => {
    const doc = ownerDocument(apiRef!.current.rootElementRef!.current as HTMLElement);

    if (
      hasFocus &&
      cellRef.current &&
      (!doc.activeElement || !cellRef.current!.contains(doc.activeElement))
    ) {
      const focusableElement = cellRef.current!.querySelector('[tabindex="0"]') as HTMLElement;
      if (focusableElement) {
        focusableElement!.focus();
      } else {
        cellRef.current!.focus();
      }
    }
  });

  return (
    <div
      ref={cellRef}
      className={cssClasses}
      role="cell"
      data-value={value}
      data-field={field}
      data-rowindex={rowIndex}
      data-colindex={colIndex}
      data-rowselected={isSelected}
      data-editable={isEditable}
      data-mode={cellMode}
      aria-colindex={colIndex + 1}
      style={style}
      tabIndex={tabIndex}
      {...eventsHandlers}
    >
      {children || valueToRender?.toString()}
    </div>
  );
});
