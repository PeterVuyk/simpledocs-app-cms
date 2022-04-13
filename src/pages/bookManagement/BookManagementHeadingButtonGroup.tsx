import React, { FC, useState } from 'react';
import Button from '@mui/material/Button';
import { ButtonGroup } from '@mui/material';
import AddBookSettingsDialog from './AddBookSettingsDialog';
import UpdateTabTitlesMenu from './updateTabTitles/UpdateTabTitlesMenu';

const BookManagementHeadingButtonGroup: FC = () => {
  const [showAddBookDialog, setShowAddBookDialog] = useState<boolean>(false);
  const [updateTabTitleMenu, setUpdateTabTitleMenu] =
    useState<null | HTMLElement>(null);

  const openUpdateTabTitleMenu = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setUpdateTabTitleMenu(event.currentTarget);
  };

  return (
    <>
      <ButtonGroup>
        <Button
          variant="contained"
          color="primary"
          onClick={openUpdateTabTitleMenu}
        >
          Tab titels wijzigen
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowAddBookDialog(true)}
        >
          Boek toevoegen
        </Button>
      </ButtonGroup>
      {updateTabTitleMenu && (
        <UpdateTabTitlesMenu
          updateTabTitleMenu={updateTabTitleMenu}
          setUpdateTabTitleMenu={setUpdateTabTitleMenu}
        />
      )}
      {showAddBookDialog && (
        <AddBookSettingsDialog
          oncloseDialog={() => setShowAddBookDialog(false)}
        />
      )}
    </>
  );
};

export default BookManagementHeadingButtonGroup;
