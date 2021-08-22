import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';

const Copyright: FC = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      Copyright © Vuyk & Vos {new Date().getFullYear()}.
    </Typography>
  );
};

export default Copyright;
