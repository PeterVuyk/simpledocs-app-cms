import React, { FC } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import JSZip from 'jszip';
import decisionTreeHtmlFilesRepository from '../../../firebase/database/decisionTreeHtmlFilesRepository';

const DownloadDecisionTreeHtmlFiles: FC = () => {
  const handleExportHTMLFiles = (): void => {
    decisionTreeHtmlFilesRepository.getHtmlFiles().then((files) => {
      const zip = new JSZip();

      files.forEach((file) => {
        zip.file(`${file.title}.html`, file.htmlFile);
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
