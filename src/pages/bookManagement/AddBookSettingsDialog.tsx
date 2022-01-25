import React, { FC } from 'react';
import { FormikValues } from 'formik';
import { notify } from '../../redux/slice/notificationSlice';
import logger from '../../helper/logger';
import { useAppDispatch } from '../../redux/hooks';
import updateUser from '../../firebase/functions/updateUser';
import BookManagementForm from './BookManagementForm';

interface Props {
  oncloseDialog: () => void;
}

const AddBookSettingsDialog: FC<Props> = ({ oncloseDialog }) => {
  const dispatch = useAppDispatch();

  const handleSubmit = (values: FormikValues) => {
    console.log('add', values);
    return Promise.resolve();

    // return updateUser(values.password)
    //   .then(() =>
    //     dispatch(
    //       notify({
    //         notificationType: 'success',
    //         notificationOpen: true,
    //         notificationMessage: 'De boekgegevens zijn toegevoegd.',
    //       })
    //     )
    //   )
    //   .then(oncloseDialog)
    //   .catch((error) => {
    //     logger.errorWithReason(
    //       'Failed adding the bookSettings in AddBookSettingsDialog.handleSubmitForm',
    //       error
    //     );
    //     dispatch(
    //       notify({
    //         notificationType: 'error',
    //         notificationOpen: true,
    //         notificationMessage: `Het toevoegen van de boekgegevens is mislukt.`,
    //       })
    //     );
    //   });
  };

  return (
    <BookManagementForm onSubmit={handleSubmit} oncloseDialog={oncloseDialog} />
  );
};

export default AddBookSettingsDialog;
