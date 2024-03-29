import Typography from '@mui/material/Typography';
import React, { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const ErrorTextTypography: FC<Props> = ({ children }) => {
  return (
    <Typography
      style={{
        color: '#d32f2f',
        fontSize: '0.8rem',
        fontFamily: 'arial',
        fontWeight: 400,
      }}
    >
      {children}
    </Typography>
  );
};

export default ErrorTextTypography;
