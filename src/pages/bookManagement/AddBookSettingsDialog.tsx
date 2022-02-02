import React, { FC } from 'react';
import { FormikValues } from 'formik';
import { notify } from '../../redux/slice/notificationSlice';
import logger from '../../helper/logger';
import { useAppDispatch } from '../../redux/hooks';
import BookManagementForm from './BookManagementForm';
import useAppConfiguration from '../../configuration/useAppConfiguration';
import clone from '../../helper/object/clone';
import configurationRepository from '../../firebase/database/configurationRepository';
import omit from '../../helper/object/omit';
import publicationHelper from '../../helper/publicationHelper';
import { UPDATE_ON_STARTUP } from '../../model/Versioning';

interface Props {
  oncloseDialog: () => void;
}

const AddBookSettingsDialog: FC<Props> = ({ oncloseDialog }) => {
  const dispatch = useAppDispatch();
  const { configuration } = useAppConfiguration();

  const handleSubmit = (values: FormikValues) => {
    const updatedConfiguration = clone(configuration);
    updatedConfiguration[values.tab].bookTypes = [
      // @ts-ignore
      ...configuration[values.tab].bookTypes,
      omit(values, ['tab', 'isDraft']),
    ];
    updatedConfiguration.versioning[values.bookType] = {
      isDraft: true,
      isBookType: true,
      updateMoment: UPDATE_ON_STARTUP,
      version: publicationHelper.getNewVersion(),
    };

    return configurationRepository
      .updateAppConfiguration(updatedConfiguration)
      .then(() => window.location.reload())
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: 'De boekgegevens zijn toegevoegd.',
          })
        )
      )
      .then(oncloseDialog)
      .catch((error) => {
        logger.errorWithReason(
          'Failed adding the bookSettings in AddBookSettingsDialog.handleSubmitForm',
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het toevoegen van de boekgegevens is mislukt.`,
          })
        );
      });
  };

  return (
    <BookManagementForm onSubmit={handleSubmit} oncloseDialog={oncloseDialog} />
  );
};

export default AddBookSettingsDialog;
