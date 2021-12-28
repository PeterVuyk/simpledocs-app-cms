import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import 'jsoneditor-react/es/editor.min.css';
import ConfirmationDialog from '../dialog/ConfirmationDialog';
import { AppConfigurations } from '../../model/configurations/AppConfigurations';
import { CmsConfigurations } from '../../model/configurations/CmsConfigurations';

interface Props {
  configurations: AppConfigurations | CmsConfigurations;
  onSubmit: (val: string) => Promise<void>;
}

const EditConfigurationButton: FC<Props> = ({ configurations, onSubmit }) => {
  const [openSubmitConfirmationDialog, setOpenSubmitConfirmationDialog] =
    useState<boolean>(false);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        disabled={configurations === null}
        onClick={() => configurations && setOpenSubmitConfirmationDialog(true)}
      >
        Wijzigingen opslaan
      </Button>
      {openSubmitConfirmationDialog && (
        <ConfirmationDialog
          dialogTitle="Aanpassing bevestiging"
          dialogText="Weet je zeker dat je de aangebrachte wijzigingen als concept wilt opslaan?"
          openDialog={openSubmitConfirmationDialog}
          setOpenDialog={setOpenSubmitConfirmationDialog}
          onSubmit={onSubmit}
        />
      )}
    </>
  );
};

export default EditConfigurationButton;
