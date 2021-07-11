import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import RestoreFromTrashTwoToneIcon from '@material-ui/icons/RestoreFromTrashTwoTone';
import { makeStyles } from '@material-ui/core/styles';
import UndoMarkForDeletionDecisionTreeMenu from './UndoMarkForDeletionDecisionTreeMenu';
import { DecisionTreeStep } from '../../../../model/DecisionTreeStep';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

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
  const classes = useStyles();

  const openRemoveMarkForDeletionMenu = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setRemoveMarkForDeleteMenuElement(event.currentTarget);
  };

  return (
    <>
      <Button
        className={classes.button}
        variant="contained"
        style={{ backgroundColor: '#099000FF' }}
        onClick={openRemoveMarkForDeletionMenu}
      >
        <RestoreFromTrashTwoToneIcon
          style={{ cursor: 'pointer', color: 'white' }}
        />
      </Button>
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
