import htmlContentHelper from '../../helper/htmlContentHelper';
import stylesheetHelper from '../../helper/stylesheetHelper';
import useStylesheet from './useStylesheet';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pretty = require('pretty');

function useHtmlModifier() {
  const stylesheet = useStylesheet();

  const modifyHtmlAfterUpload = (htmlContent: string) => {
    let html = htmlContentHelper.stripMetaTags(htmlContent);
    html = htmlContentHelper.stripBottomSpacing(html);
    html = stylesheetHelper.removeLinkStylesheet(html);
    html = stylesheetHelper.removeStylesheet(html);
    html = stylesheetHelper.updateStylesheetForHtmlContent(html, stylesheet);
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
