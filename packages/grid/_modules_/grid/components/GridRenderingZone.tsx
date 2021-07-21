import * as React from 'react';
import { ElementSize } from '../models';

type WithChildren = { children?: React.ReactNode };

export const GridRenderingZone = React.forwardRef<HTMLDivElement, ElementSize & WithChildren>(
  function GridRenderingZone(props, ref) {
    const { height, width, children } = props;
    return (
      <div
        ref={ref}
        className="MuiDataGrid-renderingZone"
        style={{
          maxHeight: height,
          width,
        }}
      >
        {children}
      </div>
    );
  },
);
