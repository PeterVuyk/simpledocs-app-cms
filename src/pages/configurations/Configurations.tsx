import React, { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
// @ts-ignore
import { JsonEditor as Editor } from 'jsoneditor-react';
import PageHeading from '../../layout/PageHeading';
import 'jsoneditor-react/es/editor.min.css';
import { ConfigInfo } from '../../model/ConfigInfo';
import configurationRepository from '../../firebase/database/configurationRepository';
import ConfirmationDialog from '../../components/dialog/ConfirmationDialog';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

const Configurations: FC = () => {
  const [initialAppConfig, setInitialAppConfig] = useState<ConfigInfo | null>();
  const [appConfig, setAppConfig] = useState<ConfigInfo | null>(null);
  const [openConfirmationDialog, setOpenConfirmationDialog] =
    useState<boolean>(false);
  const classes = useStyles();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (val: string) => {
    configurationRepository
      .updateAppConfig(appConfig!)
      .then(() => setAppConfig(null));
  };

  useEffect(() => {
    configurationRepository.getAppConfig().then((value) => {
      setInitialAppConfig(value ?? null);
    });
  }, []);

  return (
    <>
      <PageHeading title="Configuratie app">
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          disabled={appConfig === null}
          onClick={() => appConfig && setOpenConfirmationDialog(true)}
        >
          Wijzigingen opslaan
        </Button>
      </PageHeading>
      {initialAppConfig && (
        <Editor value={initialAppConfig} onChange={setAppConfig} />
      )}
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
