import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import 'jsoneditor-react/es/editor.min.css';
import { Tooltip } from '@material-ui/core';
import { connect } from 'react-redux';
import configurationRepository from '../../firebase/database/configurationRepository';
import ConfirmationDialog from '../../components/dialog/ConfirmationDialog';
import logger from '../../helper/logger';
import { NotificationOptions } from '../../model/NotificationOptions';
import notification from '../../redux/actions/notification';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const RemoveConfigurationButton: FC<Props> = ({ setNotification }) => {
  const [openRemoveConfirmationDialog, setRemoveSubmitConfirmationDialog] =
    useState<boolean>(false);
  const classes = useStyles();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removeConfigDraft = (val: string) => {
    configurationRepository
      .removeConfigurationDraft()
      .then(() => window.location.reload())
      .then(() =>
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: 'Aanpassingen op de configuratie is verwijderd.',
        })
      )
      .catch((reason) => {
        setNotification({
          notificationType: 'error',
          notificationOpen: true,
          notificationMessage:
            'Het verwijderen van de aanpassingen op de configuratie is mislukt, neem contact op met de beheerder.',
        });
        logger.errorWithReason('Failed to remove configuration draft', reason);
      });
  };

  return (
    <>
      <Tooltip title="Aanpassing verwijderen">
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          onClick={() => setRemoveSubmitConfirmationDialog(true)}
        >
          <DeleteTwoToneIcon />
        </Button>
      </Tooltip>
      {openRemoveConfirmationDialog && (
        <ConfirmationDialog
          dialogTitle="Aanpassingen configuratie verwijderen"
          dialogText="Weet je zeker dat je de aanpassing op de configuratie wilt verwijderen?"
          openDialog={openRemoveConfirmationDialog}
          setOpenDialog={setRemoveSubmitConfirmationDialog}
          onSubmit={() => removeConfigDraft('')}
        />
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    notificationOptions: state.notification.notificationOptions,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setNotification: (notificationOptions: NotificationOptions) =>
      // eslint-disable-next-line import/no-named-as-default-member
      dispatch(notification.setNotification(notificationOptions)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoveConfigurationButton);
