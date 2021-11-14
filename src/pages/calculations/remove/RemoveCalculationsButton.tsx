import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import { Tooltip } from '@material-ui/core';
import RemoveCalculationsMenu from './RemoveCalculationsMenu';
import { CalculationInfo } from '../../../model/calculations/CalculationInfo';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

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

  const classes = useStyles();

  return (
    <>
      <Tooltip title="Aanpassing verwijderen">
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          onClick={openDeleteMenu}
        >
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
