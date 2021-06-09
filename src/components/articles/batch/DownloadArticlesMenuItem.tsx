import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Papa from 'papaparse';
import FileSaver from 'file-saver';
import { Article } from '../../../../firebase/database/articleRepository';

interface Props {
  articles: Article[];
  editStatus: 'draft' | 'published';
}

const DownloadArticlesMenuItem: React.FC<Props> = ({
  editStatus,
  articles,
}) => {
  const exportArticlesCSVFile = (): void => {
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
      data: articles,
    });
    const csvFile = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(csvFile, `regelgevingen-${editStatus}.csv`);
  };

  return (
    <MenuItem key="csv" onClick={() => exportArticlesCSVFile()}>
      regelgevingen-{editStatus}.csv
    </MenuItem>
  );
};

export default DownloadArticlesMenuItem;
