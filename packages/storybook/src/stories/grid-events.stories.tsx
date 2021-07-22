import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { XGrid, GridOptionsProp } from '@material-ui/x-grid';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/Events',
  component: XGrid,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

export function AllEvents() {
  const data = useData(2000, 200);

  const options: GridOptionsProp = {
    onRowClick: (params) => action('onRowClick')(params),
    onCellClick: (params) => action('onCellClick')(params),
    onCellOver: (params) => action('onCellOver')(params),
    onRowOver: (params) => action('onRowOver')(params),
    onColumnHeaderClick: (params) => action('onColumnHeaderClick')(params),
    onSelectionModelChange: (params) => action('onSelectionChange', { depth: 1 })(params),
    onPageChange: (params) => action('onPageChange')(params),
    onPageSizeChange: (params) => action('onPageSizeChange')(params),
    onSortModelChange: (params) => action('onSortModelChange')(params),
    onStateChange: (params) => action('onStateChange')(params),
  };

  return <XGrid rows={data.rows} columns={data.columns} {...options} />;
}

export const OnRowClick = () => {
  const data = useData(2000, 200);

  const options: GridOptionsProp = {
    onRowClick: (params) => action('row click')(params),
  };

  return <XGrid rows={data.rows} columns={data.columns} {...options} />;
};
export const OnRowDoubleClick = () => {
  const data = useData(2000, 200);

  const options: GridOptionsProp = {
    onRowDoubleClick: (params) => action('row double click')(params),
  };

  return <XGrid rows={data.rows} columns={data.columns} {...options} />;
};

export const OnRowHover = () => {
  const data = useData(2000, 200);
  const options: GridOptionsProp = {
    onRowOver: (params) => action('Row over')(params),
  };

  return <XGrid rows={data.rows} columns={data.columns} {...options} />;
};

export const OnCellClick = () => {
  const data = useData(2000, 200);
  const options: GridOptionsProp = {
    onCellClick: (params) => action('cell click')(params),
  };

  return <XGrid rows={data.rows} columns={data.columns} {...options} />;
};
export const OnCellClickNotPropagated = () => {
  const data = useData(2000, 200);
  const options: GridOptionsProp = {
    onCellClick: (params, event) => {
      (event as React.SyntheticEvent).stopPropagation();
      action('cell click')(params);
    },
  };

  return <XGrid rows={data.rows} columns={data.columns} {...options} />;
};
export const OnCellDoubleClick = () => {
  const data = useData(2000, 200);

  const options: GridOptionsProp = {
    onCellDoubleClick: (params) => action('Cell double click')(params),
  };

  return <XGrid rows={data.rows} columns={data.columns} {...options} />;
};
export const OnCellHover = () => {
  const data = useData(2000, 200);
  const options: GridOptionsProp = {
    onCellOver: (params) => action('cell over')(params),
  };

  return <XGrid rows={data.rows} columns={data.columns} {...options} />;
};

export const OnColumnHeaderClick = () => {
  const data = useData(2000, 200);
  const options: GridOptionsProp = {
    onColumnHeaderClick: (params) => action('Header click')(params),
  };
  return <XGrid rows={data.rows} columns={data.columns} {...options} />;
};
