import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import GetAppIcon from '@material-ui/icons/GetApp';
import { Tooltip } from '@material-ui/core';
import { DecisionTreeStep } from '../../../../model/DecisionTreeStep';
import DownloadDecisionTreeMenu from './DownloadDecisionTreeMenu';
import { EditStatus } from '../../../../model/EditStatus';

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

  return (
    <>
      <Tooltip title="Download beslisboom">
        <Button variant="contained" onClick={openDownloadMenu}>
          <GetAppIcon color="action" />
        </Button>
      </Tooltip>
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
