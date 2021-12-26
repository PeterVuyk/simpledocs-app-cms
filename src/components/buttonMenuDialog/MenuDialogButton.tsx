import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import { Icon, PropTypes, Tooltip } from '@material-ui/core';
import MenuDialogListMenu from './MenuDialogListMenu';
import { MenuListItem } from './model/MenuListItem';
import { MenuListDialog } from './model/MenuListDialog';

interface Props {
  toolTip?: string;
  iconName?: string;
  buttonText?: string;
  menuListItems: MenuListItem[];
  menuListDialog: MenuListDialog;
  buttonColor?: PropTypes.Color;
}

const MenuDialogButton: FC<Props> = ({
  toolTip,
  iconName,
  buttonText,
  menuListItems,
  menuListDialog,
  buttonColor,
}) => {
  const [menu, setMenu] = useState<null | HTMLElement>(null);

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenu(event.currentTarget);
  };

  return (
    <>
      <Tooltip title={toolTip ?? ''}>
        <span>
          <Button
            variant="contained"
            color={buttonColor ?? undefined}
            onClick={openMenu}
            disabled={menuListItems.length === 0}
          >
            {iconName && <Icon>{iconName}&nbsp;</Icon>}
            {buttonText && buttonText}
          </Button>
        </span>
      </Tooltip>
      <MenuDialogListMenu
        menuListDialog={menuListDialog}
        menuListItems={menuListItems}
        menu={menu}
        setMenu={setMenu}
      />
    </>
  );
};

export default MenuDialogButton;
