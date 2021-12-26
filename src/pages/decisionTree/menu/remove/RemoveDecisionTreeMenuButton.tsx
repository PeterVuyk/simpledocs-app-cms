import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import { Tooltip } from '@material-ui/core';
import { DecisionTreeStep } from '../../../../model/DecisionTreeStep';
import RemoveDecisionTreeMenu from './RemoveDecisionTreeMenu';
import { EditStatus } from '../../../../model/EditStatus';

interface Props {
  editStatus: EditStatus;
  onSubmitAction: () => void;
  decisionTreeSteps: DecisionTreeStep[];
}

const RemoveDecisionTreeMenuButton: FC<Props> = ({
  editStatus,
  onSubmitAction,
  decisionTreeSteps,
}) => {
  const [deleteMenuElement, setDeleteMenuElement] =
    useState<null | HTMLElement>(null);

  const openDeleteMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteMenuElement(event.currentTarget);
  };

  return (
    <>
      <Tooltip title="Verwijder beslisboom">
        <Button variant="contained" color="secondary" onClick={openDeleteMenu}>
          <DeleteTwoToneIcon />
        </Button>
      </Tooltip>
      <RemoveDecisionTreeMenu
        editStatus={editStatus}
        removeMenuElement={deleteMenuElement}
        setRemoveMenuElement={setDeleteMenuElement}
        decisionTreeSteps={decisionTreeSteps}
        onSubmitAction={onSubmitAction}
      />
    </>
  );
};

export default RemoveDecisionTreeMenuButton;
