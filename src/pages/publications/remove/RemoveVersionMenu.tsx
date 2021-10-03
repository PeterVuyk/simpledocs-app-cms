import React, { FC, useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { Menu } from '@material-ui/core';
import RemoveVersionDialog from './RemoveVersionDialog';
import { Versioning } from '../../../model/Versioning';

interface Props {
  removeMenu: HTMLElement | null;
  setRemoveMenu: (removeMenu: null | HTMLElement) => void;
  versions: Versioning[];
  onReloadPublications: () => void;
}

const RemoveVersionMenu: FC<Props> = ({
  removeMenu,
  setRemoveMenu,
  versions,
  onReloadPublications,
}) => {
  const [removeVersionDialog, setRemoveVersionDialog] =
    useState<Versioning | null>(null);

  const handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement>) => {
    const version = versions!.find(
      (value) => value.aggregate === event.currentTarget.id
    );
    setRemoveVersionDialog(version ?? null);
  };

  if (!removeMenu || versions.length === 0) {
    return null;
  }

  return (
    <>
      <Menu
        id="remove-version-menu"
        anchorEl={removeMenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(setRemoveMenu)}
        onClose={() => setRemoveMenu(null)}
      >
        {versions.map((version) => (
          <MenuItem
            id={version.aggregate}
            key={version.aggregate.toString()}
            onClick={handleMenuItemClick}
          >
            {version.aggregate}
          </MenuItem>
        ))}
      </Menu>
      {removeVersionDialog && (
        <RemoveVersionDialog
          onClose={() => setRemoveMenu(null)}
          removeDialog={removeVersionDialog}
          setRemoveDialog={setRemoveVersionDialog}
          onReloadPublications={onReloadPublications}
        />
      )}
    </>
  );
};

export default RemoveVersionMenu;
