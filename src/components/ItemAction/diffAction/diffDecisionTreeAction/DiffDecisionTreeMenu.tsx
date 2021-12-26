import React, { FC, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { DecisionTreeStep } from '../../../../model/DecisionTreeStep';
import ShowDiffDecisionTreeDialog from './ShowDiffDecisionTreeDialog';

interface Props {
  decisionTreeDiffMenu: null | HTMLElement;
  setDecisionTreeDiffMenu: (anchorEL: null | HTMLElement) => void;
  decisionTreeSteps: DecisionTreeStep[];
}

const DiffDecisionTreeMenu: FC<Props> = ({
  decisionTreeSteps,
  setDecisionTreeDiffMenu,
  decisionTreeDiffMenu,
}) => {
  const [showDiffDialog, setShowDiffDialog] = useState<string>('');

  const handleClose = () => {
    setShowDiffDialog('');
    setDecisionTreeDiffMenu(null);
  };

  const getTitles = () => {
    return [...new Set(decisionTreeSteps.map((step) => step.title))];
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
        {getTitles().map((title) => (
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
