import React, { FC } from 'react';
import Alert from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';

interface Props {
  message: string;
  severity: 'info' | 'warning' | 'error';
}

const useStyles = makeStyles((theme: Theme) => ({
  alertStyle: {
    whiteSpace: 'pre-line',
    marginBottom: theme.spacing(2),
  },
}));

const AlertBox: FC<Props> = ({ message, severity }) => {
  const classes = useStyles();

  return (
    <Alert className={classes.alertStyle} severity={severity}>
      {message}
    </Alert>
  );
};

export default AlertBox;
