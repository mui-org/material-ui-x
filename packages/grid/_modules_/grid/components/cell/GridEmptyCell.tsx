import * as React from 'react';
import { GRID_CELL_CSS_CLASS } from '../../constants/cssClassesConstants';

export interface GridEmptyCellProps {
  width?: number;
  height?: number;
}

export const GridEmptyCell = React.memo(function GridEmptyCell({
  width,
  height,
}: GridEmptyCellProps) {
  if (!width || !height) {
    return null;
  }

  return (
    <div
      style={{
        minWidth: width,
        maxWidth: width,
        lineHeight: `${height - 1}px`,
        minHeight: height,
        maxHeight: height,
        padding: 0,
      }}
      className={GRID_CELL_CSS_CLASS}
    />
  );
});
