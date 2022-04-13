import React, { FC, ReactNode } from 'react';
import { Box } from '@mui/material';

interface Props {
  visible: boolean;
  children: ReactNode;
}

const VisibleHiddenToggleContainer: FC<Props> = ({ visible, children }) => {
  return (
    <Box
      sx={
        visible
          ? {}
          : {
              opacity: 0,
              position: 'absolute',
              zIndex: 12,
              top: 0,
              left: -1000000,
            }
      }
    >
      {children}
    </Box>
  );
};

export default VisibleHiddenToggleContainer;
