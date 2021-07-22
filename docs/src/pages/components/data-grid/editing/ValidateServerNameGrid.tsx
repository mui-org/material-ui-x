/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import {
  GridColumns,
  GridEditCellPropsParams,
  GridRowsProp,
  useGridApiRef,
  getThemePaletteMode,
  XGrid,
} from '@material-ui/x-grid';

const defaultTheme = createMuiTheme();
const useStyles = makeStyles(
  (theme: Theme) => {
    const isDark = getThemePaletteMode(theme.palette) === 'dark';

    return {
      root: {
        '& .MuiDataGrid-cell--editable': {
          backgroundColor: isDark ? '#376331' : 'rgb(217 243 190)',
        },
        '& .Mui-error': {
          backgroundColor: `rgb(126,10,15, ${isDark ? 0 : 0.1})`,
          color: isDark ? '#ff4343' : '#750f0f',
        },
      },
    };
  },
  { defaultTheme },
);

let promiseTimeout: any;
function validateName(username: string): Promise<boolean> {
  const existingUsers = rows.map((row) => row.name.toLowerCase());

  return new Promise<any>((resolve) => {
    promiseTimeout = setTimeout(() => {
      resolve(existingUsers.indexOf(username.toLowerCase()) === -1);
    }, Math.random() * 500 + 100); // simulate network latency
  });
}

export default function ValidateServerNameGrid() {
  const apiRef = useGridApiRef();
  const classes = useStyles();

  const keyStrokeTimeoutRef = React.useRef<any>();

  const handleCellEditPropsChange = React.useCallback(
    async ({ id, field, props }: GridEditCellPropsParams, event) => {
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
          const data = props; // Fix eslint value is missing in prop-types for JS files
          const isValid = await validateName(data.value!.toString());
          apiRef.current.setEditCellProps({
            id,
            field,
            props: { ...props, error: !isValid },
          });
        }, 100);

        event.defaultMuiPrevented = true;
      }
    },
    [apiRef],
  );

  React.useEffect(() => {
    return () => {
      clearTimeout(promiseTimeout);
      clearTimeout(keyStrokeTimeoutRef.current);
    };
  }, []);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <XGrid
        className={classes.root}
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        onEditCellPropsChange={handleCellEditPropsChange}
        isCellEditable={(params) => params.row.id === 5}
      />
    </div>
  );
}

const columns: GridColumns = [
  { field: 'name', headerName: 'MUI Contributor', width: 180, editable: true },
];

const rows: GridRowsProp = [
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
