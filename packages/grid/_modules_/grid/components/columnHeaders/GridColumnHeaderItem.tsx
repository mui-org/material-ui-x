import * as React from 'react';
import clsx from 'clsx';
// @ts-expect-error fixed in Material-UI v5, types definitions were added.
import { unstable_useId as useId } from '@material-ui/core/utils';
import {
  GRID_COLUMN_HEADER_KEY_DOWN,
  GRID_COLUMN_HEADER_CLICK,
  GRID_COLUMN_HEADER_DOUBLE_CLICK,
  GRID_COLUMN_HEADER_ENTER,
  GRID_COLUMN_HEADER_LEAVE,
  GRID_COLUMN_HEADER_OUT,
  GRID_COLUMN_HEADER_OVER,
  GRID_COLUMN_HEADER_DRAG_ENTER,
  GRID_COLUMN_HEADER_DRAG_OVER,
  GRID_COLUMN_HEADER_DRAG_START,
  GRID_COLUMN_HEADER_DRAG_END,
  GRID_COLUMN_SEPARATOR_MOUSE_DOWN,
  GRID_COLUMN_HEADER_FOCUS,
  GRID_COLUMN_HEADER_BLUR,
} from '../../constants/eventsConstants';
import { GRID_NUMBER_COLUMN_TYPE, GridStateColDef } from '../../models/colDef/index';
import { GridOptions } from '../../models/gridOptions';
import { GridSortDirection } from '../../models/gridSortModel';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { GridColumnHeaderSortIcon } from './GridColumnHeaderSortIcon';
import { GridColumnHeaderTitle } from './GridColumnHeaderTitle';
import { GridColumnHeaderSeparator } from './GridColumnHeaderSeparator';
import { ColumnHeaderMenuIcon } from './ColumnHeaderMenuIcon';
import { ColumnHeaderFilterIcon } from './ColumnHeaderFilterIcon';
import { GridColumnHeaderMenu } from '../menu/columnMenu/GridColumnHeaderMenu';
import { isFunction } from '../../utils/utils';

interface GridColumnHeaderItemProps {
  colIndex: number;
  column: GridStateColDef;
  columnMenuOpen: boolean;
  headerHeight: number;
  isDragging: boolean;
  isResizing: boolean;
  sortDirection: GridSortDirection;
  sortIndex?: number;
  options: GridOptions;
  filterItemsCounter?: number;
  hasFocus?: boolean;
  tabIndex: 0 | -1;
}

export function GridColumnHeaderItem(props: GridColumnHeaderItemProps) {
  const {
    column,
    columnMenuOpen,
    colIndex,
    headerHeight,
    isDragging,
    isResizing,
    sortDirection,
    sortIndex,
    options,
    filterItemsCounter,
    hasFocus,
    tabIndex,
  } = props;
  const apiRef = useGridApiContext();
  const headerCellRef = React.useRef<HTMLDivElement>(null);
  const columnMenuId: string = useId();
  const columnMenuButtonId: string = useId();
  const iconButtonRef = React.useRef<HTMLButtonElement>(null);
  const {
    classes,
    disableColumnReorder,
    showColumnRightBorder,
    disableColumnResize,
    disableColumnMenu,
    disableColumnFilter,
  } = options;
  const isColumnSorted = sortDirection != null;
  // todo refactor to a prop on col isNumeric or ?? ie: coltype===price wont work
  const isColumnNumeric = column.type === GRID_NUMBER_COLUMN_TYPE;

  let headerComponent: React.ReactNode = null;
  if (column.renderHeader && apiRef!.current) {
    headerComponent = column.renderHeader(apiRef!.current.getColumnHeaderParams(column.field));
  }

  const publish = React.useCallback(
    (eventName: string) => (event: React.MouseEvent | React.DragEvent) =>
      apiRef!.current.publishEvent(
        eventName,
        apiRef!.current.getColumnHeaderParams(column.field),
        event,
      ),
    [apiRef, column.field],
  );

  const mouseEventsHandlers = React.useMemo(
    () => ({
      onClick: publish(GRID_COLUMN_HEADER_CLICK),
      onDoubleClick: publish(GRID_COLUMN_HEADER_DOUBLE_CLICK),
      onMouseOver: publish(GRID_COLUMN_HEADER_OVER),
      onMouseOut: publish(GRID_COLUMN_HEADER_OUT),
      onMouseEnter: publish(GRID_COLUMN_HEADER_ENTER),
      onMouseLeave: publish(GRID_COLUMN_HEADER_LEAVE),
      onKeyDown: publish(GRID_COLUMN_HEADER_KEY_DOWN),
      onFocus: publish(GRID_COLUMN_HEADER_FOCUS),
      onBlur: publish(GRID_COLUMN_HEADER_BLUR),
    }),
    [publish],
  );

  const draggableEventHandlers = React.useMemo(
    () => ({
      onDragStart: publish(GRID_COLUMN_HEADER_DRAG_START),
      onDragEnter: publish(GRID_COLUMN_HEADER_DRAG_ENTER),
      onDragOver: publish(GRID_COLUMN_HEADER_DRAG_OVER),
      onDragEnd: publish(GRID_COLUMN_HEADER_DRAG_END),
    }),
    [publish],
  );

  const resizeEventHandlers = React.useMemo(
    () => ({
      onMouseDown: publish(GRID_COLUMN_SEPARATOR_MOUSE_DOWN),
    }),
    [publish],
  );

  const classNames = [classes?.columnHeader];

  if (column.headerClassName) {
    const headerClassName = isFunction(column.headerClassName)
      ? column.headerClassName({ field: column.field, colDef: column, api: apiRef })
      : column.headerClassName;

    classNames.push(headerClassName);
  }

  const cssClasses = clsx(
    column.headerAlign === 'center' && 'MuiDataGrid-columnHeader--alignCenter',
    column.headerAlign === 'right' && 'MuiDataGrid-columnHeader--alignRight',
    {
      'MuiDataGrid-columnHeader--sortable': column.sortable,
      'MuiDataGrid-columnHeader--moving': isDragging,
      'MuiDataGrid-columnHeader--sorted': isColumnSorted,
      'MuiDataGrid-columnHeader--numeric': isColumnNumeric,
      'MuiDataGrid-withBorder': showColumnRightBorder,
    },
    ...classNames,
  );

  const width = column.computedWidth;

  let ariaSort: any;
  if (sortDirection != null) {
    ariaSort = {
      'aria-sort': sortDirection === 'asc' ? 'ascending' : 'descending',
    };
  }

  const columnMenuIconButton = !disableColumnMenu && !column.disableColumnMenu && (
    <ColumnHeaderMenuIcon
      column={column}
      columnMenuId={columnMenuId}
      columnMenuButtonId={columnMenuButtonId}
      open={columnMenuOpen}
      iconButtonRef={iconButtonRef}
    />
  );

  const columnTitleIconButtons = (
    <React.Fragment>
      {!disableColumnFilter && <ColumnHeaderFilterIcon counter={filterItemsCounter} />}
      {column.sortable && !column.hideSortIcons && (
        <GridColumnHeaderSortIcon direction={sortDirection} index={sortIndex} />
      )}
    </React.Fragment>
  );

  React.useLayoutEffect(() => {
    const columnMenuState = apiRef!.current.getState().columnMenu;
    if (hasFocus && !columnMenuState.open) {
      const focusableElement = headerCellRef.current!.querySelector(
        '[tabindex="0"]',
      ) as HTMLElement;
      if (focusableElement) {
        focusableElement!.focus();
      } else {
        headerCellRef.current!.focus();
      }
    }
  });

  return (
    <div
      ref={headerCellRef}
      className={cssClasses}
      key={column.field}
      data-field={column.field}
      style={{
        width,
        minWidth: width,
        maxWidth: width,
      }}
      role="columnheader"
      tabIndex={tabIndex}
      aria-colindex={colIndex + 1}
      {...ariaSort}
      {...mouseEventsHandlers}
    >
      <div
        className="MuiDataGrid-columnHeaderDraggableContainer"
        draggable={!disableColumnReorder && !column.disableReorder}
        {...draggableEventHandlers}
      >
        <div className="MuiDataGrid-columnHeaderTitleContainer">
          {headerComponent || (
            <GridColumnHeaderTitle
              label={column.headerName || column.field}
              description={column.description}
              columnWidth={width}
            />
          )}
          {columnTitleIconButtons}
        </div>
        {columnMenuIconButton}
      </div>
      <GridColumnHeaderSeparator
        resizable={!disableColumnResize && !!column.resizable}
        resizing={isResizing}
        height={headerHeight}
        {...resizeEventHandlers}
      />
      <GridColumnHeaderMenu
        columnMenuId={columnMenuId}
        columnMenuButtonId={columnMenuButtonId}
        field={column.field}
        open={columnMenuOpen}
        target={iconButtonRef.current}
        ContentComponent={apiRef!.current.components.ColumnMenu}
        contentComponentProps={apiRef!.current.componentsProps?.columnMenu}
      />
    </div>
  );
}
