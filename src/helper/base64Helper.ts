function getBodyFromBase64(base64Blob: string, extension: string): string {
  switch (extension) {
    case 'html':
      return Buffer.from(
        base64Blob.split('data:text/html;base64,')[1],
        'base64'
      ).toString('utf-8');
    case 'css':
      return Buffer.from(
        base64Blob.split('data:text/css;base64,')[1],
        'base64'
      ).toString('utf-8');
    default:
      return base64Blob;
  }
}

function getBase64FromFile(file: string, extension: string): string {
  switch (extension) {
    case 'html':
      return `data:text/html;base64,${btoa(
        unescape(encodeURIComponent(file))
      )}`;
    case 'css':
      return `data:text/css;base64,${btoa(unescape(encodeURIComponent(file)))}`;
    default:
      return file;
  }
}
const base64Helper = {
  getBodyFromBase64,
  getBase64FromFile,
};

export default base64Helper;
