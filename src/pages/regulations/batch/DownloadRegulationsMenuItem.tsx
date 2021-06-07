import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Papa from 'papaparse';
import FileSaver from 'file-saver';
import { Regulation } from '../../../firebase/database/regulationRepository';

interface Props {
  regulations: Regulation[];
  editStatus: 'draft' | 'published';
}

const DownloadRegulationsMenuItem: React.FC<Props> = ({
  editStatus,
  regulations,
}) => {
  const exportRegulationsCSVFile = (): void => {
    const fields = [
      'pageIndex',
      'chapter',
      'level',
      'title',
      'subTitle',
      'searchText',
    ];
    if (editStatus === 'draft') {
      fields.push('isDraft');
      fields.push('markedForDeletion');
    }
    const csvString = Papa.unparse({
      fields,
      data: regulations,
    });
    const csvFile = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(csvFile, `regelgevingen-${editStatus}.csv`);
  };

  return (
    <MenuItem key="csv" onClick={() => exportRegulationsCSVFile()}>
      regelgevingen-{editStatus}.csv
    </MenuItem>
  );
};

export default DownloadRegulationsMenuItem;
