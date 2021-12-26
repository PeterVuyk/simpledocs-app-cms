import React, { FC, useState } from 'react';
import { Tooltip } from '@material-ui/core';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { DecisionTreeStep } from '../../../../model/DecisionTreeStep';
import DiffDecisionTreeMenu from './DiffDecisionTreeMenu';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

interface Props {
  decisionTreeSteps: DecisionTreeStep[];
}

const DiffDecisionTreeAction: FC<Props> = ({ decisionTreeSteps }) => {
  const [decisionTreeDiffMenu, setDecisionTreeDiffMenu] =
    useState<null | HTMLElement>(null);

  const openDownloadMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDecisionTreeDiffMenu(event.currentTarget);
  };

  const classes = useStyles();

  return (
    <>
      <Tooltip title="Bekijk de wijzigingen">
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={openDownloadMenu}
        >
          <CompareArrowsIcon />
        </Button>
      </Tooltip>
      <DiffDecisionTreeMenu
        decisionTreeSteps={decisionTreeSteps}
        setDecisionTreeDiffMenu={setDecisionTreeDiffMenu}
        decisionTreeDiffMenu={decisionTreeDiffMenu}
      />
    </>
  );
};

export default DiffDecisionTreeAction;
