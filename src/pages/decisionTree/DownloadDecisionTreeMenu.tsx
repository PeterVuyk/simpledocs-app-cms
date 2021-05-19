import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Papa from 'papaparse';
import FileSaver from 'file-saver';
import { DecisionTreeStep } from '../../firebase/database/decisionTreeRepository';

interface Props {
  downloadMenuElement: null | HTMLElement;
  setDownloadMenuElement: (anchorEL: null | HTMLElement) => void;
  decisionTreeSteps: DecisionTreeStep[];
}

const DownloadDecisionTreeMenu: React.FC<Props> = ({
  downloadMenuElement,
  setDownloadMenuElement,
  decisionTreeSteps,
}) => {
  const handleClose = () => {
    setDownloadMenuElement(null);
  };

  const exportDecisionTreeCSVFile = (steps: DecisionTreeStep[]): void => {
    const csvString = Papa.unparse({
      fields: ['id', 'label', 'parentId', 'lineLabel', 'regulationChapter'],
      data: steps,
    });
    const csvFile = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(csvFile, `beslisboom-${steps[0].title}.csv`);
  };

  const handleExportCSVFile = (title: string): void => {
    exportDecisionTreeCSVFile(
      decisionTreeSteps.filter((step) => step.title === title)
    );
  };

  const getTitles = (): string[] => {
    return [...new Set(decisionTreeSteps.map((step) => step.title))];
  };

  return (
    <Menu
      id="simple-menu"
      anchorEl={downloadMenuElement}
      keepMounted
      open={Boolean(downloadMenuElement)}
      onClose={handleClose}
    >
      {Array.from(getTitles()).map((title) => (
        <MenuItem onClick={() => handleExportCSVFile(title)}>{title}</MenuItem>
      ))}
    </Menu>
  );
};

export default DownloadDecisionTreeMenu;
