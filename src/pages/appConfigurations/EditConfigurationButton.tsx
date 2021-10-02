import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import 'jsoneditor-react/es/editor.min.css';
import ConfirmationDialog from '../../components/dialog/ConfirmationDialog';
import { AppConfigurations } from '../../model/AppConfigurations';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

interface Props {
  appConfigurations: AppConfigurations;
  onSubmit: (val: string) => void;
}

const RemoveConfigurationButton: FC<Props> = ({
  appConfigurations,
  onSubmit,
}) => {
  const [openSubmitConfirmationDialog, setOpenSubmitConfirmationDialog] =
    useState<boolean>(false);
  const classes = useStyles();

  return (
    <>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        disabled={appConfigurations === null}
        onClick={() =>
          appConfigurations && setOpenSubmitConfirmationDialog(true)
        }
      >
        Wijzigingen opslaan
      </Button>
      {openSubmitConfirmationDialog && (
        <ConfirmationDialog
          dialogTitle="Aanpassing bevestiging"
          dialogText="Weet je zeker dat je de aangebrachte wijzigingen als concept wilt opslaan?"
          openDialog={openSubmitConfirmationDialog}
          setOpenDialog={setOpenSubmitConfirmationDialog}
          onSubmit={() => onSubmit('')}
        />
      )}
    </>
  );
};

export default RemoveConfigurationButton;
