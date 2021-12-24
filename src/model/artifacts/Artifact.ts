import { ArtifactType } from './ArtifactType';

export const CONTENT_TYPE_HTML = 'html';
export const CONTENT_TYPE_CSS = 'css';
export const CONTENT_TYPE_MARKDOWN = 'markdown';
export const CONTENT_TYPE_JSON = 'json';

export type ContentType = 'html' | 'css' | 'json' | 'markdown';

export const getExtensionFromContentType = (
  contentType: ContentType
): string => {
  switch (contentType) {
    case CONTENT_TYPE_HTML:
      return 'html';
    case CONTENT_TYPE_MARKDOWN:
      return 'md';
    case CONTENT_TYPE_CSS:
      return 'css';
    case CONTENT_TYPE_JSON:
      return 'json';
    default:
      return '';
  }
};

export interface Artifact {
  id?: string;
  type: ArtifactType;
  content: string;
  contentType: ContentType;
  title: string;
}
