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
      return atob(base64Blob.split('data:text/html;base64,')[1]);
    case CONTENT_TYPE_CSS:
      return atob(base64Blob.split('data:text/css;base64,')[1]);
    case CONTENT_TYPE_MARKDOWN:
      return atob(base64Blob.split('data:text/markdown;base64,')[1]);
    default:
      return atob(base64Blob);
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
