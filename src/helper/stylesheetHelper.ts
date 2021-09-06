import { Artifact } from '../model/Artifact';

const stylesheetTopDivider =
  '<!–– De styling hieronder wordt ingeladen vanuit de css stylesheet en is alleen te bewerken via de styleguide. Verwijder deze en de comment hieronder niet. ––>';
const stylesheetBottomDivider =
  '<!–– Einde ingeladen css stylesheet. Voeg pagina specifieke styling onder deze comment toe en laat deze comment staan ––>';

function removeInnerHeaderCss(htmlFile: string) {
  const htmlOne = htmlFile.split(stylesheetTopDivider, 2);
  if (htmlOne.length !== 2) {
    return htmlFile;
  }
  const htmlTwo = htmlOne[1].split(stylesheetBottomDivider, 2);
  if (htmlTwo.length !== 2) {
    return htmlFile;
  }
  return htmlOne[0] + htmlTwo[1];
}

function removeLinkStylesheet(htmlFile: string) {
  const htmlOne = htmlFile.split('<link rel="stylesheet"', 2);
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
      const splittedHtml = html.split('<style>', 2);
      if (splittedHtml.length !== 2) {
        return html;
      }
      return `${splittedHtml[0]}<style>${styling}${splittedHtml[1]}`;
    }
    if (html.includes('<head>')) {
      const splittedHtml = html.split('<head>', 2);
      if (splittedHtml.length !== 2) {
        return html;
      }
      return `${splittedHtml[0]}<head><style>${styling}${splittedHtml[1]}</style>`;
    }
    return html;
  }
  if (html.includes('<style>')) {
    const splittedHtml = html.split('<style>', 2);
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
};

export default stylesheetHelper;
