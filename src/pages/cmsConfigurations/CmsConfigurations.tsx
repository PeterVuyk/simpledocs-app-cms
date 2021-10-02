import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';

interface Props {
  title: string;
}
const CmsConfigurations: FC<Props> = ({ title }) => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {title}
    </Typography>
  );
};

export default CmsConfigurations;
