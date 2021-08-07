import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import 'jsoneditor-react/es/editor.min.css';
import configurationRepository from '../../firebase/database/configurationRepository';
import ConfirmationDialog from '../../components/dialog/ConfirmationDialog';
import logger from '../../helper/logger';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

const RemoveConfigurationButton: FC = () => {
  const [openRemoveConfirmationDialog, setRemoveSubmitConfirmationDialog] =
    useState<boolean>(false);
  const classes = useStyles();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removeConfigDraft = (val: string) => {
    configurationRepository
      .removeConfigurationDraft()
      .then(() => window.location.reload())
      .catch((reason) =>
        logger.errorWithReason('Failed to remove configuration draft', reason)
      );
  };

  return (
    <>
      <Button
        className={classes.button}
        variant="contained"
        color="secondary"
        onClick={() => setRemoveSubmitConfirmationDialog(true)}
      >
        <DeleteTwoToneIcon />
      </Button>
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
