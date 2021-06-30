import React, { FC } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import JSZip from 'jszip';
import decisionTreeHtmlFilesRepository from '../../../firebase/database/decisionTreeHtmlFilesRepository';
import { DecisionTreeStep } from '../../../model/DecisionTreeStep';

interface Props {
  decisionTreeSteps: DecisionTreeStep[];
}

const DownloadDecisionTreeHtmlFiles: FC<Props> = ({ decisionTreeSteps }) => {
  const handleExportHTMLFiles = (): void => {
    const zip = new JSZip();
    if (!decisionTreeSteps.some((step) => !step.isDraft)) {
      decisionTreeSteps.forEach((step) => {
        zip.file(`id-${step.id}.html`, step.htmlFile);
      });
      zip.generateAsync({ type: 'blob' }).then((blob) => {
        saveAs(blob, 'html-bestanden.zip');
      });
      return;
    }
    decisionTreeHtmlFilesRepository.getHtmlFiles().then((files) => {
      files.forEach((file) => {
        zip.file(`id-${file.id}.html`, file.htmlFile);
      });
      zip.generateAsync({ type: 'blob' }).then((blob) => {
        saveAs(blob, 'html-bestanden.zip');
      });
    });
  };

  return (
    <MenuItem key="html" onClick={() => handleExportHTMLFiles()}>
      html-bestanden.zip
    </MenuItem>
  );
};

export default DownloadDecisionTreeHtmlFiles;
