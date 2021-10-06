import React, { FC, useCallback, useEffect, useState } from 'react';
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
import EditStatusToggle from '../form/EditStatusToggle';
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
import useStatusToggle from '../hooks/useStatusToggle';
import {
  DOCUMENTATION_APP_CONFIGURATIONS,
  DOCUMENTATION_CMS_CONFIGURATIONS,
} from '../../model/DocumentationType';
import {
  APP_CONFIGURATIONS,
  APP_CONFIGURATIONS_DRAFT,
  CMS_CONFIGURATIONS,
  CMS_CONFIGURATIONS_DRAFT,
  ConfigurationType,
} from '../../model/ConfigurationType';
import { CmsConfiguration } from '../../model/CmsConfiguration';

const useStyles = makeStyles({
  paper: {
    padding: '6px 16px',
  },
});

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
  title: string;
  configurationType: ConfigurationType;
}

const ConfigurationsOverview: FC<Props> = ({
  title,
  setNotification,
  configurationType,
}) => {
  const { editStatus, setEditStatus } = useStatusToggle();
  const [hasDraft, setHasDraft] = useState<boolean | null>(null);
  const [initialConfigurations, setInitialConfigurations] = useState<
    AppConfigurations | CmsConfiguration | null | void
  >();
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [configurations, setConfigurations] = useState<
    AppConfigurations | CmsConfiguration | null | void
  >(null);
  const classes = useStyles();

  const getConfigurationTypeStatus = useCallback(() => {
    if (configurationType === APP_CONFIGURATIONS) {
      return editStatus === EDIT_STATUS_PUBLISHED
        ? APP_CONFIGURATIONS
        : APP_CONFIGURATIONS_DRAFT;
    }
    return editStatus === EDIT_STATUS_PUBLISHED
      ? CMS_CONFIGURATIONS
      : CMS_CONFIGURATIONS_DRAFT;
  }, [configurationType, editStatus]);

  useEffect(() => {
    configurationRepository
      .getConfigurations(
        configurationType === APP_CONFIGURATIONS
          ? APP_CONFIGURATIONS_DRAFT
          : CMS_CONFIGURATIONS_DRAFT
      )
      .then((value) => setHasDraft(value !== undefined));
  }, [configurationType]);

  useEffect(() => {
    configurationRepository
      .getConfigurations(getConfigurationTypeStatus())
      .then((value) => {
        setShowEditor(false);
        setInitialConfigurations(value);
        setShowEditor(true);
      });
  }, [editStatus, getConfigurationTypeStatus, setShowEditor]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (val: string) => {
    configurationRepository
      .updateConfigurations(configurationType, configurations!)
      .then(() => {
        setHasDraft(true);
        setConfigurations(null);
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
          `Edit configuration has failed in onSubmit for ${configurationType}`,
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
    setInitialConfigurations(null);
    setConfigurations(null);
    setEditStatus(
      editStatus === EDIT_STATUS_DRAFT
        ? EDIT_STATUS_PUBLISHED
        : EDIT_STATUS_DRAFT
    );
  };

  const showEditButton = () => {
    return (
      (editStatus === EDIT_STATUS_DRAFT && initialConfigurations) ||
      (editStatus === EDIT_STATUS_PUBLISHED && hasDraft === false)
    );
  };

  const getDocumentationType = () => {
    return configurationType === APP_CONFIGURATIONS
      ? DOCUMENTATION_APP_CONFIGURATIONS
      : DOCUMENTATION_CMS_CONFIGURATIONS;
  };

  return (
    <>
      <PageHeading title={title} help={getDocumentationType()}>
        <EditStatusToggle
          editStatus={editStatus}
          setEditStatus={toggleEditStatus}
        />
        {configurationType === APP_CONFIGURATIONS && (
          <Base64TransformerButton />
        )}
        {editStatus === EDIT_STATUS_DRAFT && initialConfigurations && (
          <RemoveConfigurationButton configurationType={configurationType} />
        )}
        {showEditButton() && (
          <EditConfigurationButton
            configurations={configurations!}
            onSubmit={onSubmit}
          />
        )}
      </PageHeading>
      {showEditor && initialConfigurations && (
        <Editor value={initialConfigurations} onChange={setConfigurations} />
      )}
      {showEditor && !initialConfigurations && (
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
)(ConfigurationsOverview);
