import React, { FC, useState } from 'react';
import Button from '@mui/material/Button';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { Tooltip } from '@mui/material';
import RemoveCalculationsMenu from './RemoveCalculationsMenu';
import { CalculationInfo } from '../../../model/calculations/CalculationInfo';

interface Props {
  onSubmitAction: (calculationInfo: CalculationInfo) => void;
  calculationInfos: CalculationInfo[];
}

const RemoveCalculationsButton: FC<Props> = ({
  onSubmitAction,
  calculationInfos,
}) => {
  const [deleteMenuElement, setDeleteMenuElement] =
    useState<null | HTMLElement>(null);

  const openDeleteMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteMenuElement(event.currentTarget);
  };

  return (
    <>
      <Tooltip disableInteractive title="Aanpassing verwijderen">
        <Button variant="contained" color="secondary" onClick={openDeleteMenu}>
          <DeleteTwoToneIcon />
        </Button>
      </Tooltip>
      <RemoveCalculationsMenu
        removeMenuElement={deleteMenuElement}
        setRemoveMenuElement={setDeleteMenuElement}
        calculationInfos={calculationInfos}
        onSubmitAction={onSubmitAction}
      />
    </>
  );
};

export default RemoveCalculationsButton;
