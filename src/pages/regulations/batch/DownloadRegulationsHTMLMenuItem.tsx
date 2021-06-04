import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import JSZip from 'jszip';
import { Regulation } from '../../../firebase/database/regulationRepository';

interface Props {
  regulations: Regulation[];
}

const DownloadRegulationsHTMLMenuItem: React.FC<Props> = ({ regulations }) => {
  const handleExportHTMLFiles = (): void => {
    const zip = new JSZip();

    regulations.forEach((regulation) => {
      zip.file(`${regulation.chapter}.html`, regulation.htmlFile);
    });
    zip.generateAsync({ type: 'blob' }).then((blob) => {
      saveAs(blob, 'regelgevingen-html.zip');
    });
  };

  return (
    <MenuItem key="html" onClick={() => handleExportHTMLFiles()}>
      regelgevingen-html.zip
    </MenuItem>
  );
};

export default DownloadRegulationsHTMLMenuItem;
