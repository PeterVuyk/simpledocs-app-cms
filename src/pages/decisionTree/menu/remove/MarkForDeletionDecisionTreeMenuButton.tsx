import React, { FC, useState } from 'react';
import Button from '@mui/material/Button';
import RestoreFromTrashTwoToneIcon from '@mui/icons-material/RestoreFromTrashTwoTone';
import { Tooltip } from '@mui/material';
import UndoMarkForDeletionDecisionTreeMenu from './UndoMarkForDeletionDecisionTreeMenu';
import { DecisionTree } from '../../../../model/DecisionTree/DecisionTree';

interface Props {
  onSubmitAction: () => void;
  decisionTrees: DecisionTree[];
}

const MarkForDeletionDecisionTreeMenuButton: FC<Props> = ({
  onSubmitAction,
  decisionTrees,
}) => {
  const [removeMarkForDeleteMenuElement, setRemoveMarkForDeleteMenuElement] =
    useState<null | HTMLElement>(null);

  const openRemoveMarkForDeletionMenu = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setRemoveMarkForDeleteMenuElement(event.currentTarget);
  };

  return (
    <>
      <Tooltip disableInteractive title="Verwijder markering voor verwijdering">
        <Button
          variant="contained"
          style={{ backgroundColor: '#099000FF' }}
          onClick={openRemoveMarkForDeletionMenu}
        >
          <RestoreFromTrashTwoToneIcon
            style={{ cursor: 'pointer', color: 'white' }}
          />
        </Button>
      </Tooltip>
      <UndoMarkForDeletionDecisionTreeMenu
        removeMarkForDeleteMenuElement={removeMarkForDeleteMenuElement}
        setRemoveMarkForDeleteMenuElement={setRemoveMarkForDeleteMenuElement}
        decisionTrees={decisionTrees}
        onSubmitAction={onSubmitAction}
      />
    </>
  );
};

export default MarkForDeletionDecisionTreeMenuButton;
