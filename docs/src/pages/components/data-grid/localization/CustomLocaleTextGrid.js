import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export default function CustomLocaleTextGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 4,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        showToolbar
        localeText={{
          densityLabel: 'size',
          densityOptionCompact: 'Small',
          densityOptionStandard: 'Medium',
          densityOptionComfortable: 'Large',
        }}
      />
    </div>
  );
}
