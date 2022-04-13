import React, { FC, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
  BookTab,
  FIRST_BOOK_TAB,
  SECOND_BOOK_TAB,
  THIRD_BOOK_TAB,
} from '../../../model/configurations/BookTab';
import UpdateTabTitleDialog from './UpdateTabTitleDialog';

interface Props {
  updateTabTitleMenu: null | HTMLElement;
  setUpdateTabTitleMenu: (anchorEL: null | HTMLElement) => void;
}

const UpdateTabTitlesMenu: FC<Props> = ({
  updateTabTitleMenu,
  setUpdateTabTitleMenu,
}) => {
  const [showTabTitleDialog, setShowTabTitleDialog] = useState<BookTab | null>(
    null
  );

  const handleClose = () => {
    setShowTabTitleDialog(null);
    setUpdateTabTitleMenu(null);
  };

  const openDialog = (tab: string): void => {
    setShowTabTitleDialog(tab as BookTab);
  };

  const handleTabTranslation = (bookTab: string) => {
    switch (bookTab) {
      case FIRST_BOOK_TAB:
        return 'Eerste tab';
      case SECOND_BOOK_TAB:
        return 'Tweede tab';
      case THIRD_BOOK_TAB:
        return 'Derde tab';
      default:
        return bookTab;
    }
  };

  return (
    <>
      <Menu
        id="simple-menu"
        anchorEl={updateTabTitleMenu}
        keepMounted
        open={Boolean(updateTabTitleMenu)}
        onClose={handleClose}
      >
        {[FIRST_BOOK_TAB, SECOND_BOOK_TAB, THIRD_BOOK_TAB].map((tab) => (
          <MenuItem key={tab} onClick={() => openDialog(tab)}>
            {handleTabTranslation(tab)}
          </MenuItem>
        ))}
      </Menu>
      {showTabTitleDialog && (
        <UpdateTabTitleDialog
          oncloseDialog={handleClose}
          showTabTitleDialog={showTabTitleDialog}
          onTabTranslation={handleTabTranslation}
        />
      )}
    </>
  );
};

export default UpdateTabTitlesMenu;
