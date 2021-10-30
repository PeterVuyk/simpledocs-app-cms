import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import 'jsoneditor-react/es/editor.min.css';
import { Tooltip } from '@material-ui/core';
import configurationRepository from '../../firebase/database/configurationRepository';
import ConfirmationDialog from '../dialog/ConfirmationDialog';
import logger from '../../helper/logger';
import { ConfigurationType } from '../../model/ConfigurationType';
import { useAppDispatch } from '../../redux/hooks';
import { notify } from '../../redux/slice/notificationSlice';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

interface Props {
  configurationType: ConfigurationType;
}

const RemoveConfigurationButton: FC<Props> = ({ configurationType }) => {
  const [openRemoveConfirmationDialog, setRemoveSubmitConfirmationDialog] =
    useState<boolean>(false);
  const classes = useStyles();
  const dispatch = useAppDispatch();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removeConfigDraft = (val: string) => {
    configurationRepository
      .removeConfigurationDraft(configurationType)
      .then(() => window.location.reload())
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage:
              'Aanpassingen op de configuratie is verwijderd.',
          })
        )
      )
      .catch((reason) => {
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage:
              'Het verwijderen van de aanpassingen op de configuratie is mislukt, neem contact op met de beheerder.',
          })
        );
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

export default RemoveConfigurationButton;
