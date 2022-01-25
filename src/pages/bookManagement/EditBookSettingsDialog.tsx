import React, { FC } from 'react';
import { FormikValues } from 'formik';
import { notify } from '../../redux/slice/notificationSlice';
import logger from '../../helper/logger';
import { useAppDispatch } from '../../redux/hooks';
import updateUser from '../../firebase/functions/updateUser';
import { BookSetting } from '../../model/books/BookSetting';
import BookManagementForm from './BookManagementForm';

interface Props {
  bookSetting: BookSetting;
  oncloseDialog: () => void;
}

const EditBookSettingsDialog: FC<Props> = ({ oncloseDialog, bookSetting }) => {
  const dispatch = useAppDispatch();

  const handleSubmit = (values: FormikValues) => {
    console.log('edit', values);
    return Promise.resolve();

    // return updateUser(values.password)
    // .then(() =>
    //   dispatch(
    //     notify({
    //       notificationType: 'success',
    //       notificationOpen: true,
    //       notificationMessage: 'De boekgegevens zijn gewijzigd.',
    //     })
    //   )
    // )
    // .then(oncloseDialog)
    // .catch((error) => {
    //   logger.errorWithReason(
    //     'Failed updating the bookSettings in EditBookSettingsDialog.handleSubmitForm',
    //     error
    //   );
    //   dispatch(
    //     notify({
    //       notificationType: 'error',
    //       notificationOpen: true,
    //       notificationMessage: `Het wijzigen van de boekgegevens is mislukt.`,
    //     })
    //   );
    // });
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
