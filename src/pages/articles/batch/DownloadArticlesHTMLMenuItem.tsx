import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import JSZip from 'jszip';
import { Article } from '../../../firebase/database/articleRepository';

interface Props {
  articles: Article[];
  editStatus: 'draft' | 'published';
  articleType: 'regulations' | 'instructionManual';
}

const DownloadArticlesHTMLMenuItem: React.FC<Props> = ({
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
