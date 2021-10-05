import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Icon, PropTypes, Tooltip } from '@material-ui/core';
import MenuDialogListMenu from './MenuDialogListMenu';
import { MenuListItem } from './model/MenuListItem';
import { MenuListDialog } from './model/MenuListDialog';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

interface Props {
  toolTip?: string;
  iconName?: string;
  buttonText?: string;
  MenuListItems: MenuListItem[];
  menuListDialog: MenuListDialog;
  buttonColor: PropTypes.Color;
}

const MenuDialogButton: FC<Props> = ({
  toolTip,
  iconName,
  buttonText,
  MenuListItems,
  menuListDialog,
  buttonColor,
}) => {
  const [menu, setMenu] = useState<null | HTMLElement>(null);
  const classes = useStyles();

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenu(event.currentTarget);
  };

  return (
    <>
      <Tooltip title={toolTip ?? ''}>
        <Button
          className={classes.button}
          variant="contained"
          color={buttonColor}
          onClick={openMenu}
          disabled={MenuListItems.length === 0}
        >
          {iconName && <Icon>{iconName}&nbsp;</Icon>}
          {buttonText && buttonText}
        </Button>
      </Tooltip>
      <MenuDialogListMenu
        menuListDialog={menuListDialog}
        menuListItems={MenuListItems}
        menu={menu}
        setMenu={setMenu}
      />
    </>
  );
};

export default MenuDialogButton;
