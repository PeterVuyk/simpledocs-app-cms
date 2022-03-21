import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';

const Copyright: FC = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      Copyright © SimpleDocs {new Date().getFullYear()}.
    </Typography>
  );
};

export default Copyright;
