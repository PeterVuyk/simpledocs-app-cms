const bottomSpacingHtml =
  '<div id="bottom-spacing-8bb0417d" style="margin-top:100px"><br></div>';

function stripMetaTags(htmlFile: string): string {
  const html = htmlFile.replace('<meta charset="UTF-8">', '');
  return html.replace(
    '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">',
    ''
  );
}

function stripBottomSpacing(htmlFile: string): string {
  const html = htmlFile.replace('<meta charset="UTF-8">', '');
  return html.replace(bottomSpacingHtml, '');
}

function getBottomSpacing(htmlFile: string): string {
  if (htmlFile.includes('id="bottom-spacing-8bb0417d"')) {
    return '';
  }
  return bottomSpacingHtml;
}

function addSpacingBottom(htmlFile: string): string {
  if (htmlFile.includes('id="bottom-spacing-8bb0417d"')) {
    return htmlFile;
  }
  const html = htmlFile.split('</body>', 2);
  if (html.length !== 2) {
    return htmlFile;
  }
  return `${html[0]}${bottomSpacingHtml}${html[1]}`;
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

function addHTMLTagsAndBottomSpacingToHTMLFile(htmlFile: string): string {
  if (
    htmlFile.trim().startsWith('<html') ||
    htmlFile.trim().startsWith('<!DOCTYPE html>') ||
    htmlFile.trim().endsWith('</html>')
  ) {
    const updatedHtml = addMetaTags(htmlFile);
    return addSpacingBottom(updatedHtml);
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
      ${getBottomSpacing(html[1])}
    </body>
  </html>`;
}

const htmlFileHelper = {
  addHTMLTagsAndBottomSpacingToHTMLFile,
  stripMetaTags,
  stripBottomSpacing,
};

export default htmlFileHelper;
