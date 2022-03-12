import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import { Tooltip } from '@material-ui/core';
import RemoveDecisionTreeMenu from './RemoveDecisionTreeMenu';
import { EditStatus } from '../../../../model/EditStatus';
import { DecisionTree } from '../../../../model/DecisionTree/DecisionTree';

interface Props {
  editStatus: EditStatus;
  onSubmitAction: () => void;
  decisionTrees: DecisionTree[];
}

const RemoveDecisionTreeMenuButton: FC<Props> = ({
  editStatus,
  onSubmitAction,
  decisionTrees,
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
        decisionTrees={decisionTrees}
        onSubmitAction={onSubmitAction}
      />
    </>
  );
};

export default RemoveDecisionTreeMenuButton;
