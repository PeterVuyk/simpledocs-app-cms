import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import AddBookSettingsDialog from './AddBookSettingsDialog';

const BookManagementHeadingButtonGroup: FC = () => {
  const [showAddBookDialog, setShowAddBookDialog] = useState<boolean>(false);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowAddBookDialog(true)}
      >
        Boek toevoegen
      </Button>
      {showAddBookDialog && (
        <AddBookSettingsDialog
          oncloseDialog={() => setShowAddBookDialog(false)}
        />
      )}
    </>
  );
};

export default BookManagementHeadingButtonGroup;
