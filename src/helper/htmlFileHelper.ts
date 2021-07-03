function getHTMLBodyFromBase64(base64HTML: string): string {
  const base64String = base64HTML.split('data:text/html;base64,')[1];
  return Buffer.from(base64String, 'base64').toString('utf-8');
}

function getBase64FromHtml(htmlFile: string): string {
  return `data:text/html;base64,${btoa(
    unescape(encodeURIComponent(htmlFile))
  )}`;
}

function stripMetaTags(htmlFile: string): string {
  const html = htmlFile.replace('<meta charset="UTF-8">', '');
  return html.replace(
    '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">',
    ''
  );
}

function addMetaTags(htmlFile: string): string {
  if (htmlFile.includes('<meta ')) {
    return htmlFile;
  }
  const html = htmlFile.split('<head>', 2);
  if (html.length !== 2) {
    return htmlFile;
  }
  return `
    ${html[0]}
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    ${html[1]}`;
}

function addHTMLTagsToHTMLFile(htmlFile: string): string {
  if (
    htmlFile.trim().startsWith('<html') ||
    htmlFile.trim().startsWith('<!DOCTYPE html>') ||
    htmlFile.trim().endsWith('</html>')
  ) {
    return addMetaTags(htmlFile);
  }
  const html = htmlFile.split('</style>', 2);
  if (html.length !== 2) {
    return htmlFile;
  }
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        ${html[0]}</style>
      </head>
    <body>
      ${html[1]}
    </body>
  </html>`;
}

function getDefaultHtmlTemplate(): string {
  return `
        <style>
          img {
              display: block;
              max-width: 100%;
              height: auto;
          }
          mark {
              background-color: yellow;
              color: black;
          }
          body {
              font-size: 16px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
          h3 {
              background-color: #154594;
              color: white;
          }
          h4 {
              background-color: #154594;
              color: white;
          }
      </style>
      <Article>
        <div>
            <h3>Titel</h3>
            <p>Paragraaf.</p>
        </div>
      </Article>
      <div style="margin-top:50px"><br></div>
      `;
}

const htmlFileHelper = {
  getHTMLBodyFromBase64,
  getBase64FromHtml,
  addHTMLTagsToHTMLFile,
  getDefaultHtmlTemplate,
  stripMetaTags,
};

export default htmlFileHelper;
