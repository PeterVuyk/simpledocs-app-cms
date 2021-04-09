import { FileObject } from 'material-ui-dropzone';

// https://stackoverflow.com/questions/35940290/how-to-convert-base64-string-to-javascript-file-object-like-as-from-file-input-f
const createFileFromBase64 = (
  base64File: string,
  filename: string,
  mimeType: string
): Promise<File | Response> => {
  // const url = 'data:image/png;base6....';
  return fetch(base64File)
    .then((res) => res.blob())
    .then((blob) => {
      return new File([blob], filename, { type: mimeType });
      // return new File([blob], "File name",{ type: "image/png" })
    });
};

// const base64ToArrayBuffer = (bla: string) => {
//   let binary_string = window.atob(bla);
//   let len = binary_string.length;
//   let bytes = new Uint8Array(len);
//   for (var i = 0; i < len; i++) {
//     bytes[i] = binary_string.charCodeAt(i);
//   }
//   return bytes.buffer;
// }

const getBase64FromFileObject = (fileObject: FileObject): string => {
  if (fileObject.data === null) {
    return '';
  }

  if (typeof fileObject.data === 'string') {
    return fileObject.data.split('data:text/html;base64,')[1];
  }

  let result = '';
  new Uint8Array(fileObject.data).forEach((byte: number) => {
    result += String.fromCharCode(byte);
  });
  return result;
};

// const getTextFromHTMLFile = (base64HTMLFile: string): string => {
//   const html: string = Buffer.from(base64HTMLFile, 'base64').toString('utf-8');
//   return stripHtml(html).result;
// };

const fileHelper = {
  getBase64FromFileObject,
  createFileFromBase64,
  // getTextFromHTMLFile,
};

export default fileHelper;
