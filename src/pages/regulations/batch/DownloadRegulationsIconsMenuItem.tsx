import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import JSZip from 'jszip';
import { Regulation } from '../../../firebase/database/regulationRepository';

interface Props {
  regulations: Regulation[];
  editStatus: 'draft' | 'published';
}

const DownloadRegulationsIconsMenuItem: React.FC<Props> = ({
  editStatus,
  regulations,
}) => {
  const handleExportSVGFiles = (): void => {
    const zip = new JSZip();

    regulations.forEach((regulation) => {
      const base64String = regulation.iconFile.split(
        'data:image/svg+xml;base64,'
      )[1];
      zip.file(`${regulation.chapter}.svg`, base64String, {
        base64: true,
      });
    });
    zip.generateAsync({ type: 'blob' }).then((blob) => {
      saveAs(blob, `regelgevingen-${editStatus}-illustraties.zip`);
    });
  };

  return (
    <MenuItem key="svg" onClick={() => handleExportSVGFiles()}>
      regelgevingen-{editStatus}-illustraties.zip
    </MenuItem>
  );
};

export default DownloadRegulationsIconsMenuItem;
