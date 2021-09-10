import { Artifact } from '../model/Artifact';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pretty = require('pretty');

const stylesheetTopDivider =
  ' /* BEGIN ingeladen styling dat ingeladen wordt vanuit de css stylesheet dat alleen te bewerken is via de styleguide. Let op: Verwijder of bewerk deze en de comment hieronder niet. */';
const stylesheetBottomDivider =
  ' /* EINDE ingeladen css stylesheet. Voeg pagina specifieke styling onder deze comment toe */';

function makeCssStylesheetPretty(stylesheet: string) {
  let html = pretty(`<html><head><style>${stylesheet}</style></head></html>`);
  html = html.split('<style>').slice(1).join('<style>');
  const result = html.split('</style>');
  if (result.length !== 2) {
    return stylesheet;
  }
  return result[0];
}

function removeStylesheet(htmlContent: string): string {
  if (
    !htmlContent.includes('/* BEGIN ingeladen styling') ||
    !htmlContent.includes('/* EINDE ingeladen css stylesheet')
  ) {
    return htmlContent;
  }
  const htmlOne = htmlContent.split('/* BEGIN ingeladen styling');
  if (htmlOne.length !== 2) {
    return htmlContent;
  }
  const htmlTwo = htmlOne[1].split('/* EINDE ingeladen css stylesheet');
  if (htmlTwo.length !== 2) {
    return htmlContent;
  }
  return htmlOne[0].trim() + htmlTwo[1].split('*/').slice(1).join('');
}

function removeLinkStylesheet(htmlContent: string): string {
  const htmlOne = htmlContent.split('<link rel="stylesheet"');
  if (htmlOne.length !== 2) {
    return htmlContent;
  }
  return htmlOne[0] + htmlOne[1].split('>').slice(1).join('>');
}

function updateStylesheetForHtmlContent(
  htmlContent: string,
  stylesheet: Artifact | undefined
): string {
  const html = htmlContent;
  if (!stylesheet) {
    return html;
  }
  const styling =
    stylesheetTopDivider + stylesheet.content + stylesheetBottomDivider;
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
      return `${splittedHtml[0]}<head><style>${styling}</style>${splittedHtml[1]}`;
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
  updateStylesheetForHtmlContent,
  makeCssStylesheetPretty,
  removeLinkStylesheet,
  removeStylesheet,
};

export default stylesheetHelper;
