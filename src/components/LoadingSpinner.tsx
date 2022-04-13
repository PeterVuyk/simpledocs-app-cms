import React, { FC } from 'react';
import { CircularProgress } from '@mui/material';

interface Props {
  showInBlock?: boolean;
  color?: 'primary' | 'secondary';
}

const LoadingSpinner: FC<Props> = ({ showInBlock, color }) => {
  return (
    <div style={showInBlock ? { height: 500 } : {}}>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '50%', top: 250 }}>
          <CircularProgress color={color ?? 'primary'} />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
