import htmlContentHelper from '../../helper/htmlContentHelper';
import stylesheetHelper from '../../helper/stylesheetHelper';
import getStylesheet from './getStylesheet';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pretty = require('pretty');

function useHtmlModifier() {
  const modifyHtmlAfterUpload = async (htmlContent: string) => {
    const stylesheet = await getStylesheet();
    let html = htmlContentHelper.stripMetaTags(htmlContent);
    html = htmlContentHelper.stripBottomSpacing(html);
    html = stylesheetHelper.removeLinkStylesheet(html);
    html = stylesheetHelper.removeStylesheet(html);
    html = stylesheetHelper.updateStylesheetForHtmlContent(html, stylesheet!);
    return pretty(html.trim());
  };

  const modifyHtmlForStorage = (htmlContent: string) => {
    const html =
      htmlContentHelper.addHTMLTagsAndBottomSpacingToHtmlContent(htmlContent);
    return htmlContentHelper
      .addHTMLTagsAndBottomSpacingToHtmlContent(html)
      .trim();
  };

  return { modifyHtmlAfterUpload, modifyHtmlForStorage };
}

export default useHtmlModifier;
