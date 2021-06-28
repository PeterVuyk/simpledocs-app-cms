import React, { FC } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Papa from 'papaparse';
import FileSaver from 'file-saver';
import { DecisionTreeStep } from '../../../model/DecisionTreeStep';
import DownloadDecisionTreeHtmlFiles from './DownloadDecisionTreeHtmlFiles';

interface Props {
  downloadMenuElement: null | HTMLElement;
  setDownloadMenuElement: (anchorEL: null | HTMLElement) => void;
  decisionTreeSteps: DecisionTreeStep[];
}

const DownloadDecisionTreeMenu: FC<Props> = ({
  downloadMenuElement,
  setDownloadMenuElement,
  decisionTreeSteps,
}) => {
  const handleClose = () => {
    setDownloadMenuElement(null);
  };

  const exportDecisionTreeCSVFile = (steps: DecisionTreeStep[]): void => {
    const csvString = Papa.unparse({
      fields: [
        'id',
        'label',
        'parentId',
        'lineLabel',
        'htmlFileId',
        'internalNote',
      ],
      data: steps,
    });
    const csvFile = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(csvFile, `beslisboom-${steps[0].title}.csv`);
  };

  const handleExportSVGFile = (step: DecisionTreeStep): void => {
    FileSaver.saveAs(step.iconFile as string, `beslisboom-${step.title}.svg`);
  };

  const handleExportCSVFile = (title: string): void => {
    exportDecisionTreeCSVFile(
      decisionTreeSteps.filter((step) => step.title === title)
    );
  };

  const getTitleWithIcons = (): DecisionTreeStep[] => {
    return decisionTreeSteps.filter((step) => step.iconFile !== undefined);
  };

  return (
    <Menu
      id="simple-menu"
      anchorEl={downloadMenuElement}
      keepMounted
      open={Boolean(downloadMenuElement)}
      onClose={handleClose}
    >
      {getTitleWithIcons().map((step) => (
        <MenuItem
          key={`${step.title}csv`}
          onClick={() => handleExportCSVFile(step.title)}
        >
          {step.title}.csv
        </MenuItem>
      ))}
      {getTitleWithIcons().map((step) => (
        <MenuItem
          key={`${step.title}svg`}
          onClick={() => handleExportSVGFile(step)}
        >
          {step.title}.svg
        </MenuItem>
      ))}
      <DownloadDecisionTreeHtmlFiles />
    </Menu>
  );
};

export default DownloadDecisionTreeMenu;
