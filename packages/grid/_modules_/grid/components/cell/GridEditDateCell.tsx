import * as React from 'react';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import { GridCellParams } from '../../models/params/gridCellParams';

interface GridEditDateCellProps extends GridCellParams {
  editMode?: 'row' | 'cell';
}

export function GridEditDateCell(props: GridEditDateCellProps & InputBaseProps) {
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
      setValueState(newValue);

      if (newValue === '') {
        const editProps = { value: null };
        api.changeCellEditProps({ id, field, props: editProps }, event);
        return;
      }

      const [date, time] = newValue.split('T');
      const [year, month, day] = date.split('-');
      const dateObj = new Date();
      dateObj.setFullYear(Number(year));
      dateObj.setMonth(Number(month) - 1);
      dateObj.setDate(Number(day));
      dateObj.setHours(0, 0, 0, 0);

      if (time) {
        const [hours, minutes] = time.split(':');
        dateObj.setHours(Number(hours), Number(minutes), 0, 0);
      }

      const editProps = { value: dateObj };
      api.changeCellEditProps({ id, field, props: editProps }, event);
    },
    [api, field, id],
  );

  const isDateTime = colDef.type === 'dateTime';

  React.useEffect(() => {
    setValueState(value);
  }, [value]);

  let valueToDisplay = valueState || '';
  if (valueState instanceof Date) {
    const offset = valueState.getTimezoneOffset();
    const localDate = new Date(valueState.getTime() - offset * 60 * 1000);
    valueToDisplay = localDate.toISOString().substr(0, isDateTime ? 16 : 10);
  }

  return (
    <InputBase
      autoFocus={editMode === 'cell'}
      fullWidth
      className="MuiDataGrid-editInputCell"
      type={isDateTime ? 'datetime-local' : 'date'}
      value={valueToDisplay}
      onChange={handleChange}
      {...other}
    />
  );
}
export const renderEditDateCell = (params) => <GridEditDateCell {...params} />;
