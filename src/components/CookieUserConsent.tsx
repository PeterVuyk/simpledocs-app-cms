import React, { FC, ReactNode } from 'react';
import CookieConsent from 'react-cookie-consent';
import { useTheme } from '@material-ui/core/styles';

interface Props {
  children: ReactNode;
}
const CookieUserConsent: FC<Props> = ({ children }) => {
  const theme = useTheme();

  return (
    <>
      {children}
      <div style={{ position: 'absolute', zIndex: 1200 }}>
        <CookieConsent
          location="bottom"
          buttonText="OK"
          cookieName="Cookie consent"
          style={{ background: theme.palette.primary.main }}
          buttonStyle={{ color: '#404854', fontSize: '13px' }}
        >
          Het CMS maakt gebruik van cookies om het gebruik te verbeteren. Van
          Analytische cookies als trackers of van cookies met persoonlijke
          gegevens wordt geen gebruik gemaakt.
        </CookieConsent>
      </div>
    </>
  );
};

export default CookieUserConsent;
