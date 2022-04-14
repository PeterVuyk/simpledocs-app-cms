import React, { FC } from 'react';
import Typography from '@mui/material/Typography';

const Copyright: FC = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      Copyright © SimpleDocs {new Date().getFullYear()}.
    </Typography>
  );
};

export default Copyright;
