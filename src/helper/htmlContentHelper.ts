const bottomSpacingHtml =
  '<div id="bottom-spacing-8bb0417d" style="margin-top:100px"><br></div>';

function stripMetaTags(htmlContent: string): string {
  const html = htmlContent.replaceAll('<meta charset="UTF-8">', '');
  return html.replaceAll(
    '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">',
    ''
  );
}

function stripBottomSpacing(htmlContent: string): string {
  if (!htmlContent.includes('id="bottom-spacing-8bb0417d"')) {
    return htmlContent;
  }
  const htmlOne = htmlContent.split(
    '<div id="bottom-spacing-8bb0417d" style="margin-top:100px">'
  );
  if (htmlOne.length !== 2) {
    return htmlContent;
  }
  const htmlTwo = htmlOne[1].split('</div>').slice(1).join('</div>');
  return htmlOne[0] + htmlTwo;
}

function getBottomSpacing(htmlContent: string): string {
  if (htmlContent.includes('id="bottom-spacing-8bb0417d"')) {
    return '';
  }
  return bottomSpacingHtml;
}

function addSpacingBottom(htmlContent: string): string {
  if (htmlContent.includes('id="bottom-spacing-8bb0417d"')) {
    return htmlContent;
  }
  const html = htmlContent.split('</body>');
  if (html.length !== 2) {
    return htmlContent;
  }
  return `${html[0]}${bottomSpacingHtml}${html[1]}`;
}

function addMetaTags(htmlContent: string): string {
  if (htmlContent.includes('<meta ')) {
    return htmlContent;
  }
  const html = htmlContent.split('<head>');
  if (html.length !== 2) {
    return htmlContent;
  }
  return `
    ${html[0]}
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    ${html[1]}`;
}

function addHTMLTagsAndBottomSpacingToHtmlContent(htmlContent: string): string {
  if (
    htmlContent.trim().startsWith('<html') ||
    htmlContent.trim().startsWith('<!DOCTYPE html>') ||
    htmlContent.trim().endsWith('</html>')
  ) {
    const updatedHtml = addMetaTags(htmlContent);
    return addSpacingBottom(updatedHtml);
  }
  const html = htmlContent.split('</style>');
  if (html.length !== 2) {
    return htmlContent;
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

const htmlContentHelper = {
  addHTMLTagsAndBottomSpacingToHtmlContent,
  stripMetaTags,
  stripBottomSpacing,
};

export default htmlContentHelper;
