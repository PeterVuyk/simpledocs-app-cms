export const HTML_FILE_CATEGORY_DECISION_TREE = 'decisionTree';
export const HTML_FILE_CATEGORY_TEMPLATE = 'template';
export const HTML_FILE_CATEGORY_SNIPPET = 'snippet';

export type HtmlFileCategory = 'decisionTree' | 'template' | 'snippet';

export function isHtmlFileCategory(value: string): value is HtmlFileCategory {
  return [
    HTML_FILE_CATEGORY_DECISION_TREE,
    HTML_FILE_CATEGORY_TEMPLATE,
    HTML_FILE_CATEGORY_SNIPPET,
  ].includes(value);
}
