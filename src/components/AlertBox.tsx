import React, { FC } from 'react';
import Alert from '@mui/material/Alert';

interface Props {
  message: string;
  severity: 'info' | 'warning' | 'error';
}

const AlertBox: FC<Props> = ({ message, severity }) => {
  return (
    <Alert
      sx={{
        whiteSpace: 'pre-line',
        marginBottom: (theme) => theme.spacing(2),
      }}
      severity={severity}
    >
      {message}
    </Alert>
  );
};

export default AlertBox;
