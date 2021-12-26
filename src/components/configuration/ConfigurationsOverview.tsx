import React, { FC, useCallback, useEffect, useState } from 'react';
// @ts-ignore
import { JsonEditor as Editor } from 'jsoneditor-react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { ButtonGroup } from '@material-ui/core';
import PageHeading from '../../layout/PageHeading';
import 'jsoneditor-react/es/editor.min.css';
import { AppConfigurations } from '../../model/configurations/AppConfigurations';
import configurationRepository from '../../firebase/database/configurationRepository';
import EditStatusToggle from '../form/EditStatusToggle';
import {
  EDIT_STATUS_DRAFT,
  EDIT_STATUS_PUBLISHED,
} from '../../model/EditStatus';
import RemoveConfigurationButton from './RemoveConfigurationButton';
import EditConfigurationButton from './EditConfigurationButton';
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
} from '../../model/configurations/ConfigurationType';
import { CmsConfigurations } from '../../model/configurations/CmsConfigurations';
import cmsConfigurationValidator from '../../validators/cmsConfigurationValidator';
import AlertBox from '../AlertBox';
import appConfigurationValidator from '../../validators/appConfigurationValidator';
import { useAppDispatch } from '../../redux/hooks';
import { notify } from '../../redux/slice/notificationSlice';
import DiffConfigurationAction from '../ItemAction/diffAction/diffConfigurationAction/DiffConfigurationAction';

const useStyles = makeStyles({
  paper: {
    padding: '6px 16px',
  },
});

interface Props {
  title: string;
  configurationType: ConfigurationType;
}

const ConfigurationsOverview: FC<Props> = ({ title, configurationType }) => {
  const { editStatus, setEditStatus } = useStatusToggle();
  const [hasDraft, setHasDraft] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [initialConfigurations, setInitialConfigurations] = useState<
    AppConfigurations | CmsConfigurations | null | void
  >();
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [configurations, setConfigurations] = useState<
    AppConfigurations | CmsConfigurations | null | void
  >(null);
  const classes = useStyles();
  const dispatch = useAppDispatch();

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
        if (value !== undefined) {
          const appConfigurations = value as any;
          delete appConfigurations.versioning;
        }
        return value;
      })
      .then((config) => {
        setShowEditor(false);
        setInitialConfigurations(config);
        setShowEditor(true);
      });
  }, [
    configurationType,
    editStatus,
    getConfigurationTypeStatus,
    setShowEditor,
  ]);

  const validateConfiguration = (): string => {
    if (configurationType === CMS_CONFIGURATIONS) {
      return cmsConfigurationValidator.validate(configurations);
    }
    if (configurationType === APP_CONFIGURATIONS) {
      return appConfigurationValidator.validate(configurations);
    }
    return '';
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (val: string) => {
    const errorMessage = validateConfiguration();
    setError(errorMessage);
    if (errorMessage) {
      return;
    }
    configurationRepository
      .updateConfigurations(configurationType, configurations!)
      .then(() => {
        setHasDraft(true);
        setConfigurations(null);
      })
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: 'Configuratie gewijzigd.',
          })
        )
      )
      .catch((reason) => {
        logger.errorWithReason(
          `Edit configuration has failed in onSubmit for ${configurationType}`,
          reason
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage:
              'Het wijzigen van de configuratie is mislukt, neem contact op met de beheerder.',
          })
        );
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
        <ButtonGroup>
          <EditStatusToggle
            editStatus={editStatus}
            setEditStatus={toggleEditStatus}
          />
          {configurationType === APP_CONFIGURATIONS && (
            <Base64TransformerButton />
          )}
          {editStatus === EDIT_STATUS_DRAFT && initialConfigurations && (
            <>
              <DiffConfigurationAction configurationType={configurationType} />
              <RemoveConfigurationButton
                configurationType={configurationType}
              />
            </>
          )}
          {showEditButton() && (
            <EditConfigurationButton
              configurations={configurations!}
              onSubmit={onSubmit}
            />
          )}
        </ButtonGroup>
      </PageHeading>
      {error && <AlertBox severity="error" message={error} />}
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

export default ConfigurationsOverview;
