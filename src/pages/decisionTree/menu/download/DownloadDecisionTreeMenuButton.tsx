import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import GetAppIcon from '@material-ui/icons/GetApp';
import { Tooltip } from '@material-ui/core';
import DownloadDecisionTreeMenu from './DownloadDecisionTreeMenu';
import { EditStatus } from '../../../../model/EditStatus';
import { DecisionTree } from '../../../../model/DecisionTree/DecisionTree';

interface Props {
  editStatus: EditStatus;
  decisionTrees: DecisionTree[];
}

const DownloadDecisionTreeMenuButton: FC<Props> = ({
  decisionTrees,
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
        decisionTrees={decisionTrees}
        downloadMenuElement={downloadMenuElement}
        setDownloadMenuElement={setDownloadMenuElement}
      />
    </>
  );
};

export default DownloadDecisionTreeMenuButton;
