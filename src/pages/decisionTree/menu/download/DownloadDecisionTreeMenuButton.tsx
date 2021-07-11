import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import GetAppIcon from '@material-ui/icons/GetApp';
import { DecisionTreeStep } from '../../../../model/DecisionTreeStep';
import DownloadDecisionTreeMenu from './DownloadDecisionTreeMenu';
import { EditStatus } from '../../../../model/EditStatus';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

interface Props {
  editStatus: EditStatus;
  decisionTreeSteps: DecisionTreeStep[];
}

const DownloadDecisionTreeMenuButton: FC<Props> = ({
  decisionTreeSteps,
  editStatus,
}) => {
  const [downloadMenuElement, setDownloadMenuElement] =
    useState<null | HTMLElement>(null);

  const openDownloadMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDownloadMenuElement(event.currentTarget);
  };

  const classes = useStyles();

  return (
    <>
      <Button
        className={classes.button}
        variant="contained"
        onClick={openDownloadMenu}
      >
        <GetAppIcon color="action" />
      </Button>
      <DownloadDecisionTreeMenu
        editStatus={editStatus}
        decisionTreeSteps={decisionTreeSteps}
        downloadMenuElement={downloadMenuElement}
        setDownloadMenuElement={setDownloadMenuElement}
      />
    </>
  );
};

export default DownloadDecisionTreeMenuButton;
