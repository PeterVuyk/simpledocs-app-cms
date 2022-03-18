import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';
import Disclaimer from './Disclaimer';
import CookieStatement from './CookieStatement';
import PrivacyStatement from './PrivacyStatement';

const CMSStatement: FC = () => {
  return (
    <>
      <Typography variant="body2" color="textSecondary" align="center">
        <Disclaimer />
        {`, `}
        <CookieStatement />
        {` en `}
        <PrivacyStatement />
        {` gebruik CMS.`}
      </Typography>
    </>
  );
};

export default CMSStatement;
