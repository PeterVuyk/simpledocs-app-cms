import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import RestoreFromTrashTwoToneIcon from '@material-ui/icons/RestoreFromTrashTwoTone';
import { Tooltip } from '@material-ui/core';
import UndoMarkForDeletionDecisionTreeMenu from './UndoMarkForDeletionDecisionTreeMenu';
import { DecisionTreeStep } from '../../../../model/DecisionTreeStep';

interface Props {
  onSubmitAction: () => void;
  decisionTreeSteps: DecisionTreeStep[];
}

const MarkForDeletionDecisionTreeMenuButton: FC<Props> = ({
  onSubmitAction,
  decisionTreeSteps,
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
      <Tooltip title="Verwijder markering voor verwijdering">
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
        decisionTreeSteps={decisionTreeSteps}
        onSubmitAction={onSubmitAction}
      />
    </>
  );
};

export default MarkForDeletionDecisionTreeMenuButton;
