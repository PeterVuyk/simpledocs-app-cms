import React, { FC, useEffect, useState } from 'react';
// @ts-ignore
import { JsonEditor as Editor } from 'jsoneditor-react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PageHeading from '../../layout/PageHeading';
import 'jsoneditor-react/es/editor.min.css';
import { AppConfigurations } from '../../model/AppConfigurations';
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
import { DOCUMENTATION_APP_CONFIGURATIONS } from '../../model/DocumentationType';

const useStyles = makeStyles({
  paper: {
    padding: '6px 16px',
  },
});

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
  title: string;
}

const AppConfigurationsPage: FC<Props> = ({ title, setNotification }) => {
  const { editStatus, setEditStatus } = useStatusToggle();
  const [hasDraft, setHasDraft] = useState<boolean | null>(null);
  const [initialAppConfigurations, setInitialAppConfigurations] =
    useState<AppConfigurations | null | void>();
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [appConfigurations, setAppConfigurations] =
    useState<AppConfigurations | null | void>(null);
  const classes = useStyles();

  useEffect(() => {
    configurationRepository
      .getAppConfigurations(EDIT_STATUS_DRAFT)
      .then((value) => setHasDraft(value !== undefined));
  }, []);

  useEffect(() => {
    configurationRepository.getAppConfigurations(editStatus).then((value) => {
      setShowEditor(false);
      setInitialAppConfigurations(value);
      setShowEditor(true);
    });
  }, [editStatus, setShowEditor]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (val: string) => {
    configurationRepository
      .updateAppConfigurations(appConfigurations!)
      .then(() => {
        setHasDraft(true);
        setAppConfigurations(null);
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
          'Edit configuration has failed in AppConfigurations.onSubmit',
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
    setInitialAppConfigurations(null);
    setAppConfigurations(null);
    setEditStatus(
      editStatus === EDIT_STATUS_DRAFT
        ? EDIT_STATUS_PUBLISHED
        : EDIT_STATUS_DRAFT
    );
  };

  const showEditButton = () => {
    return (
      (editStatus === EDIT_STATUS_DRAFT && initialAppConfigurations) ||
      (editStatus === EDIT_STATUS_PUBLISHED && hasDraft === false)
    );
  };

  return (
    <>
      <PageHeading title={title} help={DOCUMENTATION_APP_CONFIGURATIONS}>
        <EditStatusToggle
          editStatus={editStatus}
          setEditStatus={toggleEditStatus}
        />
        <Base64TransformerButton />
        {editStatus === EDIT_STATUS_DRAFT && initialAppConfigurations && (
          <RemoveConfigurationButton />
        )}
        {showEditButton() && (
          <EditConfigurationButton
            appConfigurations={appConfigurations!}
            onSubmit={onSubmit}
          />
        )}
      </PageHeading>
      {showEditor && initialAppConfigurations && (
        <Editor
          value={initialAppConfigurations}
          onChange={setAppConfigurations}
        />
      )}
      {showEditor && !initialAppConfigurations && (
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppConfigurationsPage);
