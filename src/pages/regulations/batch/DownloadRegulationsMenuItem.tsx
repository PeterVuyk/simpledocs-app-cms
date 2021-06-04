import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Papa from 'papaparse';
import FileSaver from 'file-saver';
import { Regulation } from '../../../firebase/database/regulationRepository';

interface Props {
  regulations: Regulation[];
}

const DownloadRegulationsMenuItem: React.FC<Props> = ({ regulations }) => {
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

  return (
    <MenuItem key="csv" onClick={() => exportRegulationsCSVFile()}>
      regelgevingen.csv
    </MenuItem>
  );
};

export default DownloadRegulationsMenuItem;
