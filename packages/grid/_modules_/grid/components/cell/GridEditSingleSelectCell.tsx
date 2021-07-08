import * as React from 'react';
import Select, { SelectProps } from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { GridCellParams } from '../../models/params/gridCellParams';
import { isEscapeKey } from '../../utils/keyboardUtils';

const renderSingleSelectOptions = (option) =>
  typeof option === 'string' ? (
    <MenuItem key={option} value={option}>
      {option}
    </MenuItem>
  ) : (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  );

interface GridEditSingleSelectCellProps extends GridCellParams {
  editMode?: 'row' | 'cell';
}

export function GridEditSingleSelectCell(props: GridEditSingleSelectCellProps & SelectProps) {
  const {
    id,
    value,
    formattedValue,
    api,
    field,
    row,
    colDef,
    cellMode,
    isEditable,
    className,
    getValue,
    hasFocus,
    editMode,
    ...other
  } = props;

  const [open, setOpen] = React.useState(editMode === 'cell');

  const handleChange = (event) => {
    setOpen(false);
    const editProps = { value: event.target.value };
    api.changeCellEditProps({ id, field, props: editProps }, event);
    if (!event.key && editMode === 'cell') {
      api.commitCellChange({ id, field }, event);
      api.setCellMode(id, field, 'view');
    }
  };

  const handleClose = (event, reason) => {
    if (editMode === 'row') {
      setOpen(false);
      return;
    }
    if (reason === 'backdropClick' || isEscapeKey(event.key)) {
      api.setCellMode(id, field, 'view');
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      open={open}
      onOpen={handleOpen}
      MenuProps={{
        onClose: handleClose,
      }}
      autoFocus
      fullWidth
      {...other}
    >
      {colDef.valueOptions.map(renderSingleSelectOptions)}
    </Select>
  );
}
export const renderEditSingleSelectCell = (params) => <GridEditSingleSelectCell {...params} />;
