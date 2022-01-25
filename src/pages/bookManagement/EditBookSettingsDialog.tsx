import React, { FC } from 'react';
import { FormikValues } from 'formik';
import { notify } from '../../redux/slice/notificationSlice';
import logger from '../../helper/logger';
import { useAppDispatch } from '../../redux/hooks';
import { BookSetting } from '../../model/books/BookSetting';
import BookManagementForm from './BookManagementForm';
import useAppConfiguration from '../../configuration/useAppConfiguration';
import publicationHelper from '../../helper/publicationHelper';
import omit from '../../helper/object/omit';
import { AppConfigurations } from '../../model/configurations/AppConfigurations';
import clone from '../../helper/object/clone';
import configurationRepository from '../../firebase/database/configurationRepository';
import { APP_CONFIGURATIONS } from '../../model/configurations/ConfigurationType';

interface Props {
  bookSetting: BookSetting;
  oncloseDialog: () => void;
}

const EditBookSettingsDialog: FC<Props> = ({ oncloseDialog, bookSetting }) => {
  const dispatch = useAppDispatch();
  const { configuration } = useAppConfiguration();

  const updateVersioningFromConfig = (
    config: AppConfigurations,
    values: FormikValues
  ) => {
    // isDraft should be a boolean but is a string, because the MenuItem for 'Select' is not compatible with booleans
    if (values.isDraft === 'true') {
      config.versioning = omit(config.versioning, [values.bookType]);
      return config;
    }
    if (!Object.keys(config.versioning).includes(values.bookType)) {
      config.versioning[values.bookType] = {
        isBookType: true,
        version: publicationHelper.getNewVersion(),
      };
    }
    return config;
  };

  const handleSubmit = (values: FormikValues) => {
    let updatedConfiguration = clone(configuration);
    const filteredBookTypes = updatedConfiguration[values.tab].bookTypes.filter(
      // @ts-ignore
      (bookTypes) => bookTypes.bookType !== values.bookType
    );
    updatedConfiguration[values.tab].bookTypes = [
      ...filteredBookTypes,
      omit(values, ['tab']),
    ];
    updatedConfiguration = updateVersioningFromConfig(
      updatedConfiguration,
      values
    );

    return configurationRepository
      .updateAppConfiguration(updatedConfiguration)
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