import React, { FC, useEffect, useState } from 'react';
// @ts-ignore
import { JsonEditor as Editor } from 'jsoneditor-react';
import PageHeading from '../../layout/PageHeading';
import 'jsoneditor-react/es/editor.min.css';
import { ConfigInfo } from '../../model/ConfigInfo';
import configurationRepository from '../../firebase/database/configurationRepository';
import EditStatusToggle from '../../components/form/EditStatusToggle';
import {
  EDIT_STATUS_DRAFT,
  EDIT_STATUS_PUBLISHED,
  EditStatus,
} from '../../model/EditStatus';
import RemoveConfigurationButton from './RemoveConfigurationButton';
import EditConfigurationButton from './EditConfigurationButton';

const Configurations: FC = () => {
  const [editStatus, setEditStatus] = useState<EditStatus>(EDIT_STATUS_DRAFT);
  const [hasDraft, setHasDraft] = useState<boolean | null>(null);
  const [initialAppConfig, setInitialAppConfig] =
    useState<ConfigInfo | null | void>();
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [appConfig, setAppConfig] = useState<ConfigInfo | null | void>(null);

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
          <RemoveConfigurationButton />
        )}
        {showEditButton() && (
          <EditConfigurationButton appConfig={appConfig!} onSubmit={onSubmit} />
        )}
      </PageHeading>
      {showEditor && initialAppConfig && (
        <Editor value={initialAppConfig} onChange={setAppConfig} />
      )}
      {showEditor && !initialAppConfig && <p>Geen wijzigingen.</p>}
    </>
  );
};

export default Configurations;
