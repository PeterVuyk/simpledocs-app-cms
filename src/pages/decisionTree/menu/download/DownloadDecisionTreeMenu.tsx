import React, { FC } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Papa from 'papaparse';
import FileSaver from 'file-saver';
import DownloadDecisionTreeFiles from './DownloadDecisionTreeFiles';
import { EditStatus } from '../../../../model/EditStatus';
import { DecisionTree } from '../../../../model/DecisionTree/DecisionTree';

interface Props {
  editStatus: EditStatus;
  downloadMenuElement: null | HTMLElement;
  setDownloadMenuElement: (anchorEL: null | HTMLElement) => void;
  decisionTrees: DecisionTree[];
}

const DownloadDecisionTreeMenu: FC<Props> = ({
  editStatus,
  downloadMenuElement,
  setDownloadMenuElement,
  decisionTrees,
}) => {
  const handleClose = () => {
    setDownloadMenuElement(null);
  };

  const handleExportCSVFile = (decisionTree: DecisionTree): void => {
    const csvString = Papa.unparse({
      fields: ['id', 'label', 'parentId', 'lineLabel', 'contentId'],
      data: decisionTree.steps,
    });
    const csvFile = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(csvFile, `beslisboom-${decisionTree.title}.csv`);
  };

  return (
    <Menu
      id="simple-menu"
      anchorEl={downloadMenuElement}
      keepMounted
      open={Boolean(downloadMenuElement)}
      onClose={handleClose}
    >
      {decisionTrees.map((decisionTree) => (
        <MenuItem
          key={`${decisionTree.title + decisionTree.isDraft}csv`}
          onClick={() => handleExportCSVFile(decisionTree)}
        >
          {decisionTree.title}.csv
        </MenuItem>
      ))}
      <DownloadDecisionTreeFiles
        editStatus={editStatus}
        decisionTrees={decisionTrees}
      />
    </Menu>
  );
};

export default DownloadDecisionTreeMenu;
