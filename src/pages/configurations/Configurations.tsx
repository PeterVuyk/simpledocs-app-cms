import React, { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
// @ts-ignore
import { JsonEditor as Editor } from 'jsoneditor-react';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import PageHeading from '../../layout/PageHeading';
import 'jsoneditor-react/es/editor.min.css';
import { ConfigInfo } from '../../model/ConfigInfo';
import configurationRepository from '../../firebase/database/configurationRepository';
import ConfirmationDialog from '../../components/dialog/ConfirmationDialog';
import EditStatusToggle from '../../components/form/EditStatusToggle';
import {
  EDIT_STATUS_DRAFT,
  EDIT_STATUS_PUBLISHED,
  EditStatus,
} from '../../model/EditStatus';
import logger from '../../helper/logger';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

const Configurations: FC = () => {
  const [editStatus, setEditStatus] = useState<EditStatus>(EDIT_STATUS_DRAFT);
  const [hasDraft, setHasDraft] = useState<boolean | null>(null);
  const [initialAppConfig, setInitialAppConfig] =
    useState<ConfigInfo | null | void>();
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [appConfig, setAppConfig] = useState<ConfigInfo | null | void>(null);
  const [openConfirmationDialog, setOpenConfirmationDialog] =
    useState<boolean>(false);
  const classes = useStyles();

  useEffect(() => {
    configurationRepository
      .getAppConfig(EDIT_STATUS_DRAFT)
      .then((value) => setHasDraft(value !== undefined));
  }, []);

  useEffect(() => {
    configurationRepository.getAppConfig(editStatus).then((value) => {
      setShowEditor(false);
      setInitialAppConfig(value);
      setShowEditor(true);
    });
  }, [editStatus, setShowEditor]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (val: string) => {
    configurationRepository.updateAppConfig(appConfig!).then(() => {
      setHasDraft(true);
      setAppConfig(null);
    });
  };

  const removeConfigDraft = () => {
    configurationRepository
      .removeConfigurationDraft()
      .then(() => window.location.reload())
      .catch((reason) =>
        logger.errorWithReason('Failed to remove configuration draft', reason)
      );
  };

  const toggleEditStatus = () => {
    setInitialAppConfig(null);
    setAppConfig(null);
    setEditStatus(
      editStatus === EDIT_STATUS_DRAFT
        ? EDIT_STATUS_PUBLISHED
        : EDIT_STATUS_DRAFT
    );
  };

  const showEditButton = () => {
    return (
      (editStatus === EDIT_STATUS_DRAFT && initialAppConfig) ||
      (editStatus === EDIT_STATUS_PUBLISHED && hasDraft === false)
    );
  };

  return (
    <>
      <PageHeading title="Configuratie app">
        <EditStatusToggle
          editStatus={editStatus}
          setEditStatus={toggleEditStatus}
        />
        {editStatus === EDIT_STATUS_DRAFT && initialAppConfig && (
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={removeConfigDraft}
          >
            <DeleteTwoToneIcon />
          </Button>
        )}
        {showEditButton() && (
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            disabled={appConfig === null}
            onClick={() => appConfig && setOpenConfirmationDialog(true)}
          >
            Wijzigingen opslaan
          </Button>
        )}
      </PageHeading>
      {showEditor && initialAppConfig && (
        <Editor value={initialAppConfig} onChange={setAppConfig} />
      )}
      {showEditor && !initialAppConfig && <p>Geen wijzigingen.</p>}
      {openConfirmationDialog && (
        <ConfirmationDialog
          dialogTitle="Aanpassing bevestiging"
          dialogText="Weet je zeker dat je de aangebrachte wijzigingen wilt opslaan?"
          openDialog={openConfirmationDialog}
          setOpenDialog={setOpenConfirmationDialog}
          onSubmit={() => onSubmit('')}
        />
      )}
    </>
  );
};

export default Configurations;
