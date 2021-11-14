import {
  CONTENT_TYPE_CSS,
  CONTENT_TYPE_HTML,
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../model/artifacts/Artifact';

function getBodyFromBase64(
  base64Blob: string,
  contentType: ContentType
): string {
  switch (contentType) {
    case CONTENT_TYPE_HTML:
      return Buffer.from(
        base64Blob.split('data:text/html;base64,')[1],
        'base64'
      ).toString('utf-8');
    case CONTENT_TYPE_CSS:
      return Buffer.from(
        base64Blob.split('data:text/css;base64,')[1],
        'base64'
      ).toString('utf-8');
    case CONTENT_TYPE_MARKDOWN:
      return Buffer.from(
        base64Blob.split('data:text/markdown;base64,')[1],
        'base64'
      ).toString('utf-8');
    default:
      return base64Blob;
  }
}

function getBase64FromFile(file: string, contentType: ContentType): string {
  switch (contentType) {
    case CONTENT_TYPE_HTML:
      return `data:text/html;base64,${btoa(
        unescape(encodeURIComponent(file))
      )}`;
    case CONTENT_TYPE_CSS:
      return `data:text/css;base64,${btoa(unescape(encodeURIComponent(file)))}`;
    case CONTENT_TYPE_MARKDOWN:
      return `data:text/markdown;base64,${btoa(
        unescape(encodeURIComponent(file))
      )}`;
    default:
      return file;
  }
}

const base64Helper = {
  getBodyFromBase64,
  getBase64FromFile,
};

export default base64Helper;
