import Papa from 'papaparse';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../../model/EditStatus';
import { Article } from '../../../model/Article';
import {
  CONTENT_TYPE_HTML,
  getExtensionFromContentType,
} from '../../../model/Artifact';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pretty = require('pretty');

const icons = (articles: Article[], filename: string) => {
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
    saveAs(blob, filename);
  });
};

const exportContent = (articles: Article[], filename: string) => {
  const zip = new JSZip();

  articles.forEach((article) => {
    zip.file(
      `${article.chapter}.${getExtensionFromContentType(article.contentType)}`,
      article.contentType === CONTENT_TYPE_HTML
        ? pretty(article.content)
        : article.content
    );
  });
  zip.generateAsync({ type: 'blob' }).then((blob) => {
    saveAs(blob, filename);
  });
};

const csvFile = (
  articles: Article[],
  editStatus: EditStatus,
  filename: string
) => {
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
  const file = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  FileSaver.saveAs(file, filename);
};

const exportArticles = {
  csvFile,
  exportContent,
  icons,
};

export default exportArticles;
