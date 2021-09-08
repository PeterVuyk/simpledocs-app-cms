import { ArtifactType } from './ArtifactType';

export const CONTENT_TYPE_HTML = 'html';
export const CONTENT_TYPE_CSS = 'css';
export const CONTENT_TYPE_MARKDOWN = 'markdown';

export type ContentType = 'html' | 'css' | 'markdown';

export const getExtensionFromContentType = (contentType: ContentType) => {
  switch (contentType) {
    case CONTENT_TYPE_HTML:
      return 'html';
    case CONTENT_TYPE_MARKDOWN:
      return 'md';
    case CONTENT_TYPE_CSS:
      return 'css';
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
