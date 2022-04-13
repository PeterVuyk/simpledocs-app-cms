import React, { FC, useState } from 'react';
import { ButtonGroup } from '@mui/material';
import Button from '@mui/material/Button';
import SendNotificationDialog from './SendNotificationDialog';

interface Props {
  onReload: () => Promise<void>;
}

const NotificationsButtonGroup: FC<Props> = ({ onReload }) => {
  const [showSendNotificationsDialog, setShowSendNotificationsDialog] =
    useState<boolean>(false);

  return (
    <ButtonGroup>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowSendNotificationsDialog(true)}
      >
        Verstuur notificatie
      </Button>
      {showSendNotificationsDialog && (
        <SendNotificationDialog
          onCloseDialog={() => setShowSendNotificationsDialog(false)}
          onReload={onReload}
        />
      )}
    </ButtonGroup>
  );
};

export default NotificationsButtonGroup;
