import React, { FC } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Papa from 'papaparse';
import FileSaver from 'file-saver';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../../model/EditStatus';
import { ArticleType } from '../../../model/ArticleType';
import { Article } from '../../../model/Article';

interface Props {
  articles: Article[];
  editStatus: EditStatus;
  articleType: ArticleType;
}

const DownloadArticlesMenuItem: FC<Props> = ({
  editStatus,
  articles,
  articleType,
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
    if (editStatus === EDIT_STATUS_DRAFT) {
      fields.push('isDraft');
      fields.push('markedForDeletion');
    }
    const csvString = Papa.unparse({
      fields,
      data: articles,
    });
    const csvFile = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(csvFile, `${articleType}-${editStatus}.csv`);
  };

  return (
    <MenuItem key="csv" onClick={() => exportArticlesCSVFile()}>
      {articleType}-{editStatus}.csv
    </MenuItem>
  );
};

export default DownloadArticlesMenuItem;
