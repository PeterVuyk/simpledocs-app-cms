import { Artifact } from '../model/Artifact';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pretty = require('pretty');

const stylesheetTopDivider =
  '<!–– BEGIN ingeladen styling dat ingeladen wordt vanuit de css stylesheet dat alleen te bewerken is via de styleguide. Let op: Verwijder of bewerk deze en de comment hieronder niet. ––>';
const stylesheetBottomDivider =
  '<!–– EINDE ingeladen css stylesheet. Voeg pagina specifieke styling onder deze comment toe ––>';

function makeCssStylesheetPretty(stylesheet: string) {
  let html = pretty(`<html><head><style>${stylesheet}</style></head></html>`);
  html = html.split('<style>').slice(1).join('<style>');
  const result = html.split('</style>');
  if (result.length !== 2) {
    return stylesheet;
  }
  return result[0];
}

function removeInnerHeaderCss(htmlFile: string): string {
  const htmlOne = htmlFile.split(stylesheetTopDivider);
  if (htmlOne.length !== 2) {
    return htmlFile;
  }
  const htmlTwo = htmlOne[1].split(stylesheetBottomDivider);
  if (htmlTwo.length !== 2) {
    return htmlFile;
  }
  return htmlOne[0] + htmlTwo[1];
}

function removeLinkStylesheet(htmlFile: string): string {
  const htmlOne = htmlFile.split('<link rel="stylesheet"');
  if (htmlOne.length !== 2) {
    return htmlFile;
  }
  return htmlOne[0] + htmlOne[1].split('>').slice(1).join('>');
}

function addStylesheet(
  htmlFile: string,
  stylesheet: Artifact | undefined
): string {
  const html = removeLinkStylesheet(htmlFile);
  if (!stylesheet || htmlFile.includes(stylesheetTopDivider)) {
    return html;
  }
  const styling =
    stylesheetTopDivider + stylesheet.file + stylesheetBottomDivider;
  if (
    html.trim().startsWith('<html') ||
    html.trim().startsWith('<!DOCTYPE html>') ||
    html.trim().endsWith('</html>')
  ) {
    if (html.includes('<style>')) {
      const splittedHtml = html.split('<style>');
      if (splittedHtml.length !== 2) {
        return html;
      }
      return `${splittedHtml[0]}<style>${styling}${splittedHtml[1]}`;
    }
    if (html.includes('<head>')) {
      const splittedHtml = html.split('<head>');
      if (splittedHtml.length !== 2) {
        return html;
      }
      return `${splittedHtml[0]}<head><style>${styling}${splittedHtml[1]}</style>`;
    }
    return html;
  }
  if (html.includes('<style>')) {
    const splittedHtml = html.split('<style>');
    if (splittedHtml.length !== 2) {
      return html;
    }
    return `${splittedHtml[0]}<style>${styling}${splittedHtml[1]}`;
  }
  return html;
}

const stylesheetHelper = {
  addStylesheet,
  removeInnerHeaderCss,
  makeCssStylesheetPretty,
};

export default stylesheetHelper;
