import React, { FC, useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { Menu } from '@material-ui/core';
import SnippetsDialog from './SnippetsDialog';
import { Artifact, ContentType } from '../../../../../model/Artifact';

interface Props {
  snippetsMenu: HTMLElement | null;
  setSnippetsMenu: (snippetMenu: null | HTMLElement) => void;
  snippets: Artifact[];
  contentType: ContentType;
}

const SnippetsMenu: FC<Props> = ({
  contentType,
  snippetsMenu,
  setSnippetsMenu,
  snippets,
}) => {
  const [openSnippetsDialog, setOpenSnippetsDialog] = useState<Artifact | null>(
    null
  );

  const handleOpenDialog = (event: React.MouseEvent<HTMLLIElement>) => {
    const snippet = snippets!.find(
      (value) => value.id === event.currentTarget.id
    );
    if (snippet) {
      setOpenSnippetsDialog(snippet);
    }
  };

  const handleCloseDialog = () => {
    setSnippetsMenu(null);
    setOpenSnippetsDialog(null);
  };

  if (!snippetsMenu) {
    return null;
  }

  return (
    <>
      <Menu
        id="snippets-menu"
        anchorEl={snippetsMenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(setSnippetsMenu)}
        onClose={() => setSnippetsMenu(null)}
      >
        {snippets &&
          snippets
            .filter((value) => value.contentType === contentType)
            .map((snippet) => (
              <MenuItem
                id={snippet.id}
                key={snippet.id!.toString()}
                onClick={handleOpenDialog}
              >
                {snippet.title}
              </MenuItem>
            ))}
      </Menu>
      {openSnippetsDialog && (
        <SnippetsDialog
          openSnippetsDialog={openSnippetsDialog}
          oncloseDialog={handleCloseDialog}
        />
      )}
    </>
  );
};

export default SnippetsMenu;
