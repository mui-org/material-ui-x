import * as React from 'react';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import { GridCellParams } from '../../models/params/gridCellParams';

interface GridEditInputCellProps extends GridCellParams {
  editMode?: 'row' | 'cell';
}

export function GridEditInputCell(props: GridEditInputCellProps & InputBaseProps) {
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
    hasFocus,
    getValue,
    editMode,
    ...other
  } = props;

  const [valueState, setValueState] = React.useState(value);

  const handleChange = React.useCallback(
    (event) => {
      const newValue = event.target.value;
      const editProps = { value: newValue };
      setValueState(newValue);
      api.changeCellEditProps({ id, field, props: editProps }, event);
    },
    [api, field, id],
  );

  React.useEffect(() => {
    setValueState(value);
  }, [value]);

  return (
    <InputBase
      autoFocus={editMode === 'cell'}
      className="MuiDataGrid-editInputCell"
      fullWidth
      type={colDef.type === 'number' ? colDef.type : 'text'}
      value={valueState || ''}
      onChange={handleChange}
      {...other}
    />
  );
}
export const renderEditInputCell = (params) => <GridEditInputCell {...params} />;
