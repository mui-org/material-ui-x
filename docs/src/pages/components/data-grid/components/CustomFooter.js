import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles(() => ({
  root: {
    padding: 10,
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
    '& .status-container': {
      display: 'flex',
    },
  },
  connected: {
    color: '#4caf50',
  },
  disconnected: {
    color: '#d9182e',
  },
}));

function CustomFooterStatusComponent(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className="status-container">
        Status {props.status}
        <FiberManualRecordIcon fontSize="small" className={classes[props.status]} />
      </div>
    </div>
  );
}

CustomFooterStatusComponent.propTypes = {
  status: PropTypes.oneOf(['connected', 'disconnected']).isRequired,
};

export { CustomFooterStatusComponent };

export default function CustomFooter() {
  const [status, setStatus] = React.useState('connected');
  const { data } = useDemoData({
    dataSet: 'Employee',
    rowLength: 4,
    maxColumns: 6,
  });

  return (
    <div
      style={{
        height: 400,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ height: 350, width: '100%' }}>
        <DataGrid
          {...data}
          components={{
            Footer: CustomFooterStatusComponent,
          }}
          componentsProps={{
            footer: { status },
          }}
        />
      </div>
      <Button
        color="primary"
        onClick={() =>
          setStatus((current) =>
            current === 'connected' ? 'disconnected' : 'connected',
          )
        }
        style={{ alignSelf: 'flex-end' }}
      >
        {status === 'connected' ? 'Disconnect' : 'Connect'}
      </Button>
    </div>
  );
}
