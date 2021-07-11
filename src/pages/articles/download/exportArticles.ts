import Papa from 'papaparse';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../../model/EditStatus';
import { Article } from '../../../model/Article';

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

const htmlFiles = (articles: Article[], filename: string) => {
  const zip = new JSZip();

  articles.forEach((article) => {
    zip.file(`${article.chapter}.html`, article.htmlFile);
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
  htmlFiles,
  icons,
};

export default exportArticles;
