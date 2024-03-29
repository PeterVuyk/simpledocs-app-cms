import React, { FC, useCallback, useEffect, useState } from 'react';
// @ts-ignore
import { JsonEditor as Editor } from 'jsoneditor-react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ButtonGroup } from '@mui/material';
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
import omit from '../../helper/object/omit';
import clone from '../../helper/object/clone';

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
          let config = clone(value);
          config = omit(config, ['versioning']);
          if (configurationType === APP_CONFIGURATIONS) {
            config.firstBookTab = omit(config.firstBookTab, [
              'bookTypes',
              'title',
              'subTitle',
            ]);
            config.secondBookTab = omit(config.secondBookTab, [
              'bookTypes',
              'title',
              'subTitle',
            ]);
            config.thirdBookTab = omit(config.thirdBookTab, [
              'bookTypes',
              'title',
              'subTitle',
            ]);
          }
          return config;
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
  const onSubmit = async (val: string) => {
    const errorMessage = validateConfiguration();
    setError(errorMessage);
    if (errorMessage) {
      return;
    }
    await configurationRepository
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
          {editStatus === EDIT_STATUS_DRAFT && initialConfigurations && (
            <DiffConfigurationAction configurationType={configurationType} />
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
        </ButtonGroup>
      </PageHeading>
      {error && <AlertBox severity="error" message={error} />}
      {showEditor && initialConfigurations && (
        <Editor value={initialConfigurations} onChange={setConfigurations} />
      )}
      {showEditor && !initialConfigurations && (
        <Paper elevation={2} style={{ padding: '6px 16px' }}>
          <Typography>Geen resultaten.</Typography>
        </Paper>
      )}
    </>
  );
};

export default ConfigurationsOverview;
