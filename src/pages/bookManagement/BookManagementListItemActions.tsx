import React, { FC, useState } from 'react';
import { BookSetting } from '../../model/books/BookSetting';
import EditItemAction from '../../components/ItemAction/EditItemAction';
import EditBookSettingsDialog from './EditBookSettingsDialog';

interface Props {
  bookSetting: BookSetting;
}

const BookManagementListItemActions: FC<Props> = ({ bookSetting }) => {
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);

  return (
    <>
      <EditItemAction onClick={() => setShowEditDialog(true)} />
      {showEditDialog && (
        <EditBookSettingsDialog
          bookSetting={bookSetting}
          oncloseDialog={() => setShowEditDialog(false)}
        />
      )}
    </>
  );
};

export default BookManagementListItemActions;
