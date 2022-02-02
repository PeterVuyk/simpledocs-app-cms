import React, { FC } from 'react';
import { FormikValues } from 'formik';
import { notify } from '../../redux/slice/notificationSlice';
import logger from '../../helper/logger';
import { useAppDispatch } from '../../redux/hooks';
import { BookSetting } from '../../model/books/BookSetting';
import BookManagementForm from './BookManagementForm';
import useAppConfiguration from '../../configuration/useAppConfiguration';
import omit from '../../helper/object/omit';
import clone from '../../helper/object/clone';
import configurationRepository from '../../firebase/database/configurationRepository';
import { UPDATE_ON_STARTUP } from '../../model/Versioning';

interface Props {
  bookSetting: BookSetting;
  oncloseDialog: () => void;
}

const EditBookSettingsDialog: FC<Props> = ({ oncloseDialog, bookSetting }) => {
  const dispatch = useAppDispatch();
  const { configuration } = useAppConfiguration();

  const handleSubmit = (values: FormikValues) => {
    const updatedConfiguration = clone(configuration);
    const filteredBookTypes = updatedConfiguration[values.tab].bookTypes.filter(
      // @ts-ignore
      (bookTypes) => bookTypes.bookType !== values.bookType
    );
    updatedConfiguration[values.tab].bookTypes = [
      ...filteredBookTypes,
      omit(values, ['tab', 'isDraft']),
    ];
    updatedConfiguration.versioning[values.bookType].isDraft =
      values.isDraft === 'true';
    updatedConfiguration.versioning[values.bookType].updateMoment =
      UPDATE_ON_STARTUP;

    return configurationRepository
      .updateAppConfiguration(updatedConfiguration)
      .then(() => window.location.reload())
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: 'De boekgegevens zijn gewijzigd.',
          })
        )
      )
      .then(oncloseDialog)
      .catch((error) => {
        logger.errorWithReason(
          'Failed updating the bookSettings in EditBookSettingsDialog.handleSubmitForm',
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het wijzigen van de boekgegevens is mislukt.`,
          })
        );
      });
  };

  return (
    <BookManagementForm
      onSubmit={handleSubmit}
      oncloseDialog={oncloseDialog}
      bookSetting={bookSetting}
    />
  );
};

export default EditBookSettingsDialog;
