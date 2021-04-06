import { makeStyles } from '@material-ui/core/styles';
import { getThemePaletteMode, XGrid } from '@material-ui/x-grid';
import * as React from 'react';
import { useGridApiRef } from '@material-ui/data-grid';

const columns = [
  { field: 'name', headerName: 'MUI Contributor', width: 180, editable: true },
];

const rows = [
  {
    id: 1,
    name: 'Damien',
  },
  {
    id: 2,
    name: 'Olivier',
  },
  {
    id: 3,
    name: 'Danail',
  },
  {
    id: 4,
    name: 'Matheus',
  },
  {
    id: 5,
    name: 'You?',
  },
];

export const useStyles = makeStyles((theme) => {
  const backgroundColor =
    getThemePaletteMode(theme.palette) === 'dark' ? '#376331' : 'rgb(217 243 190)';
  return {
    root: {
      '& .MuiDataGrid-cellEditable': {
        backgroundColor,
      },
      '& .MuiDataGrid-cellEditing': {
        backgroundColor: 'rgb(255,215,115, 0.19)',
        color: '#1a3e72',
      },
      '& .Mui-error': {
        backgroundColor: 'rgb(126,10,15, 0.1)',
        color: '#750f0f',
      },
    },
  };
});

let promiseTimeout;
function validateName(username) {
  const existingUsers = rows.map((row) => row.name.toLowerCase());

  return new Promise((resolve) => {
    promiseTimeout = setTimeout(() => {
      resolve(existingUsers.indexOf(username.toLowerCase()) === -1);
    }, Math.random() * 500 + 100);
  });
}
// TODO Commit value serverside
export default function ValidateServerNameGrid() {
  const apiRef = useGridApiRef();
  const classes = useStyles();

  const keyStrokeTimeoutRef = React.useRef();

  const handleEditCellChange = React.useCallback(
    async ({ id, field, props }, event) => {
      if (field === 'name') {
        clearTimeout(promiseTimeout);
        clearTimeout(keyStrokeTimeoutRef.current);

        apiRef.current.setEditCellProps({
          id,
          field,
          props: { ...props, error: true },
        });

        // basic debouncing here
        keyStrokeTimeoutRef.current = setTimeout(async () => {
          const isValid = await validateName(props.value.toString());
          apiRef.current.setEditCellProps({
            id,
            field,
            props: { ...props, error: !isValid },
          });
        }, 100);

        event.stopPropagation();
      }
    },
    [apiRef],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <XGrid
        className={classes.root}
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        onEditCellChange={handleEditCellChange}
        isCellEditable={(params) => params.row.id === 5}
        autoHeight
        hideFooter
      />
    </div>
  );
}
