import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import JSZip from 'jszip';
import { Article } from '../../../../firebase/database/articleRepository';

interface Props {
  articles: Article[];
  editStatus: 'draft' | 'published';
}

const DownloadArticlesIconsMenuItem: React.FC<Props> = ({
  editStatus,
  articles,
}) => {
  const handleExportSVGFiles = (): void => {
    const zip = new JSZip();

    articles.forEach((article) => {
      const base64String = article.iconFile.split(
        'data:image/svg+xml;base64,'
      )[1];
      zip.file(`${article.chapter}.svg`, base64String, {
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

export default DownloadArticlesIconsMenuItem;
