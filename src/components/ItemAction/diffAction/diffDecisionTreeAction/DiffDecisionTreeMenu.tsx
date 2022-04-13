import React, { FC, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ShowDiffDecisionTreeDialog from './ShowDiffDecisionTreeDialog';

interface Props {
  decisionTreeDiffMenu: null | HTMLElement;
  setDecisionTreeDiffMenu: (anchorEL: null | HTMLElement) => void;
  titles: string[];
}

const DiffDecisionTreeMenu: FC<Props> = ({
  setDecisionTreeDiffMenu,
  decisionTreeDiffMenu,
  titles,
}) => {
  const [showDiffDialog, setShowDiffDialog] = useState<string>('');

  const handleClose = () => {
    setShowDiffDialog('');
    setDecisionTreeDiffMenu(null);
  };

  const handleTitleDiff = (title: string) => {
    setShowDiffDialog(title);
  };

  return (
    <>
      <Menu
        id="simple-menu"
        anchorEl={decisionTreeDiffMenu}
        keepMounted
        open={Boolean(decisionTreeDiffMenu)}
        onClose={handleClose}
      >
        {titles.map((title) => (
          <MenuItem key="title" onClick={() => handleTitleDiff(title)}>
            {title}
          </MenuItem>
        ))}
      </Menu>
      {showDiffDialog !== '' && (
        <ShowDiffDecisionTreeDialog
          title={showDiffDialog}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default DiffDecisionTreeMenu;
