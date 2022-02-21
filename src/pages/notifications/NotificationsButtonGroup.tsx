import React, { FC, useState } from 'react';
import { ButtonGroup } from '@material-ui/core';
import Button from '@material-ui/core/Button';
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
