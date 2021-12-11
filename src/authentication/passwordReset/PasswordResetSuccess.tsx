import React, { FC } from 'react';
import AlertBox from '../../components/AlertBox';

const PasswordResetSuccess: FC = () => {
  return (
    <AlertBox
      severity="info"
      message="Bedankt, als je account bij ons bekend is dan ontvang je binnen enkele minuten een e-mail met daarin een persoonlijke link. Via de link kun je een nieuw wachtwoord opgeven waarna je opnieuw kan inloggen in deze omgeving."
    />
  );
};

export default PasswordResetSuccess;
