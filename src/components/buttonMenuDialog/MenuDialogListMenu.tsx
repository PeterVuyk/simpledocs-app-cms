import React, { FC, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import { Menu } from '@mui/material';
import { MenuListItem } from './model/MenuListItem';
import { MenuListDialog } from './model/MenuListDialog';
import MenuDialog from './MenuDialog';

interface Props {
  menu: HTMLElement | null;
  menuListItems: MenuListItem[];
  setMenu: (menu: null | HTMLElement) => void;
  menuListDialog: MenuListDialog;
}

const MenuDialogListMenu: FC<Props> = ({
  menu,
  setMenu,
  menuListItems,
  menuListDialog,
}) => {
  const [dialog, setDialog] = useState<string | null>(null);

  const handleClose = () => {
    setDialog(null);
    setMenu(null);
  };

  if (!menu) {
    return null;
  }

  return (
    <>
      <Menu
        id="dialog-menu"
        anchorEl={menu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(setMenu)}
        onClose={() => setMenu(null)}
      >
        {menuListItems.map((listItem) => (
          <MenuItem
            id={listItem.key}
            key={listItem.key.toString()}
            onClick={() => setDialog(listItem.key)}
          >
            {listItem.value}
          </MenuItem>
        ))}
      </Menu>
      {dialog && (
        <MenuDialog
          dialog={dialog}
          onClose={handleClose}
          menuListDialog={menuListDialog}
        />
      )}
    </>
  );
};

export default MenuDialogListMenu;
