import {
  CONTENT_TYPE_CSS,
  CONTENT_TYPE_HTML,
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../model/ContentType';

const b64EncodeUnicode = (str: string) => {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
};

const b64DecodeUnicode = (str: string) => {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), (c) => {
        return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
      })
      .join('')
  );
};

function getBodyFromBase64(
  base64Blob: string,
  contentType: ContentType
): string {
  switch (contentType) {
    case CONTENT_TYPE_HTML:
      return b64DecodeUnicode(base64Blob.split('data:text/html;base64,')[1]);
    case CONTENT_TYPE_CSS:
      return b64DecodeUnicode(base64Blob.split('data:text/css;base64,')[1]);
    case CONTENT_TYPE_MARKDOWN:
      return b64DecodeUnicode(
        base64Blob.split('data:text/markdown;base64,')[1]
      );
    default:
      return b64DecodeUnicode(base64Blob);
  }
}

function getBase64FromFile(file: string, contentType: ContentType): string {
  switch (contentType) {
    case CONTENT_TYPE_HTML:
      return `data:text/html;base64,${b64EncodeUnicode(file)}`;
    case CONTENT_TYPE_CSS:
      return `data:text/css;base64,${b64EncodeUnicode(file)}`;
    case CONTENT_TYPE_MARKDOWN:
      return `data:text/markdown;base64,${b64EncodeUnicode(file)}`;
    default:
      return file;
  }
}

const base64Helper = {
  getBodyFromBase64,
  getBase64FromFile,
};

export default base64Helper;
