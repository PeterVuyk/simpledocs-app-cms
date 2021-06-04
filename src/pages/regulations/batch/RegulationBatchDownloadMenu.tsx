import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Papa from 'papaparse';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { Regulation } from '../../../firebase/database/regulationRepository';

interface Props {
  downloadMenuElement: null | HTMLElement;
  setDownloadMenuElement: (anchorEL: null | HTMLElement) => void;
  regulations: Regulation[];
}

const RegulationBatchDownloadMenu: React.FC<Props> = ({
  downloadMenuElement,
  setDownloadMenuElement,
  regulations,
}) => {
  const handleClose = () => {
    setDownloadMenuElement(null);
  };

  const exportRegulationsCSVFile = (): void => {
    const csvString = Papa.unparse({
      fields: [
        'pageIndex',
        'chapter',
        'level',
        'title',
        'subTitle',
        'searchText',
      ],
      data: regulations,
    });
    const csvFile = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(csvFile, 'regelgevingen.csv');
  };

  const handleExportSVGFile = (): void => {
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
      saveAs(blob, 'regelgevingen-illustraties.zip');
    });
  };

  return (
    <Menu
      id="simple-menu"
      anchorEl={downloadMenuElement}
      keepMounted
      open={Boolean(downloadMenuElement)}
      onClose={handleClose}
    >
      <MenuItem key="csv" onClick={() => exportRegulationsCSVFile()}>
        regelgevingen.csv
      </MenuItem>
      <MenuItem key="svg" onClick={() => handleExportSVGFile()}>
        regelgevingen-illustraties.zip
      </MenuItem>
    </Menu>
  );
};

export default RegulationBatchDownloadMenu;
