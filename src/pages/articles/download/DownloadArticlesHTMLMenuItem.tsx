import React, { FC } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import JSZip from 'jszip';
import { EditStatus } from '../../../model/EditStatus';
import { ArticleType } from '../../../model/ArticleType';
import { Article } from '../../../model/Article';

interface Props {
  articles: Article[];
  editStatus: EditStatus;
  articleType: ArticleType;
}

const DownloadArticlesHTMLMenuItem: FC<Props> = ({
  editStatus,
  articles,
  articleType,
}) => {
  const handleExportHTMLFiles = (): void => {
    const zip = new JSZip();

    articles.forEach((article) => {
      zip.file(`${article.chapter}.html`, article.htmlFile);
    });
    zip.generateAsync({ type: 'blob' }).then((blob) => {
      saveAs(blob, `${articleType}-${editStatus}-html.zip`);
    });
  };

  return (
    <MenuItem key="html" onClick={() => handleExportHTMLFiles()}>
      {articleType}-{editStatus}-html.zip
    </MenuItem>
  );
};

export default DownloadArticlesHTMLMenuItem;
