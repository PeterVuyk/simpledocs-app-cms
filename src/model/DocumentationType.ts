export const DOCUMENTATION_CMS_CONFIGURATIONS = 'cmsConfigurations';
export const DOCUMENTATION_APP_CONFIGURATIONS = 'appConfigurations';
export const DOCUMENTATION_CONTENT_TYPES = 'contentTypes';
export const DOCUMENTATION_DECISION_TREE = 'decisionTree';
export const DOCUMENTATION_DEFAULT_TEMPLATE = 'defaultTemplate';
export const DOCUMENTATION_PUBLICATIONS = 'publications';
export const DOCUMENTATION_STYLEGUIDE = 'styleguide';
export const DOCUMENTATION_TRANSFORM_BASE64 = 'transformBase64';
export const DOCUMENTATION_ID_LINK_BOOK_PAGE = 'idLinkBookPage';
export const DOCUMENTATION_IMAGE_LIBRARY = 'imageLibrary';

export type DocumentationType =
  | 'cmsConfigurations'
  | 'appConfigurations'
  | 'contentTypes'
  | 'decisionTree'
  | 'transformBase64'
  | 'defaultTemplate'
  | 'publications'
  | 'idLinkBookPage'
  | 'imageLibrary'
  | 'styleguide';
