import Papa from 'papaparse';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../../model/EditStatus';
import { Page } from '../../../model/Page';
import {
  CONTENT_TYPE_HTML,
  getExtensionFromContentType,
} from '../../../model/artifacts/Artifact';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pretty = require('pretty');

const icons = (pages: Page[], filename: string): void => {
  const zip = new JSZip();

  pages.forEach((page) => {
    const base64String = page.iconFile.split('data:image/svg+xml;base64,')[1];
    zip.file(`${page.chapter}.svg`, base64String, {
      base64: true,
    });
  });
  zip.generateAsync({ type: 'blob' }).then((blob) => {
    saveAs(blob, filename);
  });
};

const exportContent = (pages: Page[], filename: string): void => {
  const zip = new JSZip();

  pages.forEach((page) => {
    zip.file(
      `${page.chapter}.${getExtensionFromContentType(page.contentType)}`,
      page.contentType === CONTENT_TYPE_HTML
        ? pretty(page.content)
        : page.content
    );
  });
  zip.generateAsync({ type: 'blob' }).then((blob) => {
    saveAs(blob, filename);
  });
};

const csvFile = (
  pages: Page[],
  editStatus: EditStatus,
  filename: string
): void => {
  const fields = [
    'pageIndex',
    'chapter',
    'chapterDivision',
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
    data: pages,
  });
  const file = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  FileSaver.saveAs(file, filename);
};

const exportBookPages = {
  csvFile,
  exportContent,
  icons,
};

export default exportBookPages;
