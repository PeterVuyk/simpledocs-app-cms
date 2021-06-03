function getHTMLBodyFromBase64(base64HTML: string): string {
  const base64String = base64HTML.split('data:text/html;base64,')[1];
  return Buffer.from(base64String, 'base64').toString('utf-8');
}

function getBase64FromHtml(htmlFile: string): string {
  return `data:text/html;base64,${btoa(
    unescape(encodeURIComponent(htmlFile))
  )}`;
}

const fileHelper = {
  getHTMLBodyFromBase64,
  getBase64FromHtml,
};

export default fileHelper;
