import React, { FC, useEffect, useState } from 'react';
// @ts-ignore
import { JsonEditor as Editor } from 'jsoneditor-react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PageHeading from '../../layout/PageHeading';
import 'jsoneditor-react/es/editor.min.css';
import { ConfigInfo } from '../../model/ConfigInfo';
import configurationRepository from '../../firebase/database/configurationRepository';
import EditStatusToggle from '../../components/form/EditStatusToggle';
import {
  EDIT_STATUS_DRAFT,
  EDIT_STATUS_PUBLISHED,
} from '../../model/EditStatus';
import RemoveConfigurationButton from './RemoveConfigurationButton';
import EditConfigurationButton from './EditConfigurationButton';
import { NotificationOptions } from '../../model/NotificationOptions';
import notification from '../../redux/actions/notification';
import logger from '../../helper/logger';
import Base64TransformerButton from './base64/Base64TransformerButton';
import useStatusToggle from '../../components/hooks/useStatusToggle';

const useStyles = makeStyles({
  paper: {
    padding: '6px 16px',
  },
});

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const Configurations: FC<Props> = ({ setNotification }) => {
  const [editStatus, setEditStatus] = useStatusToggle();
  const [hasDraft, setHasDraft] = useState<boolean | null>(null);
  const [initialAppConfig, setInitialAppConfig] =
    useState<ConfigInfo | null | void>();
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [appConfig, setAppConfig] = useState<ConfigInfo | null | void>(null);
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
    configurationRepository
      .updateAppConfig(appConfig!)
      .then(() => {
        setHasDraft(true);
        setAppConfig(null);
      })
      .then(() =>
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: 'Configuratie gewijzigd.',
        })
      )
      .catch((error) => {
        logger.errorWithReason(
          'Edit configuration has failed in Configurations.onSubmit',
          error
        );
        setNotification({
          notificationType: 'error',
          notificationOpen: true,
          notificationMessage:
            'Het wijzigen van de configuratie is mislukt, neem contact op met de beheerder.',
        });
      });
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
        <Base64TransformerButton />
        {editStatus === EDIT_STATUS_DRAFT && initialAppConfig && (
          <RemoveConfigurationButton />
        )}
        {showEditButton() && (
          <EditConfigurationButton appConfig={appConfig!} onSubmit={onSubmit} />
        )}
      </PageHeading>
      {showEditor && initialAppConfig && (
        <Editor value={initialAppConfig} onChange={setAppConfig} />
      )}
      {showEditor && !initialAppConfig && (
        <Paper elevation={2} className={classes.paper}>
          <Typography>Geen resultaten.</Typography>
        </Paper>
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

export default connect(mapStateToProps, mapDispatchToProps)(Configurations);
