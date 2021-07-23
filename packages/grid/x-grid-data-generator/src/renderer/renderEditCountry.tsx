import * as React from 'react';
import { GridCellParams } from '@material-ui/data-grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputBase from '@material-ui/core/InputBase';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import { createTheme } from '../../../_modules_/grid/utils/utils';
import { COUNTRY_ISO_OPTIONS } from '../services/static-data';

// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
function countryToFlag(isoCode) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      option: {
        '& > span': {
          marginRight: 10,
          fontSize: 18,
        },
      },
      inputRoot: {
        ...theme.typography.body2,
        padding: '1px 0',
        height: '100%',
        '& input': {
          padding: '0 16px',
          height: '100%',
        },
      },
    }),
  { defaultTheme },
);

function EditCountry(props: GridCellParams) {
  const classes = useStyles();
  const { id, value, api, field } = props;

  const handleChange = React.useCallback(
    (event, newValue) => {
      const editProps = { value: newValue };
      api.setEditCellProps({ id, field, props: editProps });
      if (!event.key) {
        api.commitCellChange({ id, field });
        api.setCellMode(id, field, 'view');
      }
    },
    [api, field, id],
  );

  return (
    <Autocomplete
      value={value as any}
      onChange={handleChange}
      options={COUNTRY_ISO_OPTIONS}
      getOptionLabel={(option) => option.label}
      autoHighlight
      fullWidth
      open
      classes={classes}
      disableClearable
      renderOption={(option) => (
        <React.Fragment>
          <span>{countryToFlag(option.code)}</span>
          {option.label}
        </React.Fragment>
      )}
      renderInput={(params) => (
        <InputBase
          autoFocus
          fullWidth
          id={params.id}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
          {...params.InputProps}
        />
      )}
    />
  );
}

export function renderEditCountry(params: GridCellParams) {
  return <EditCountry {...params} />;
}
