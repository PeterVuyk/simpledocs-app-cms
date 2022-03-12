import {
  CONTENT_TYPE_CSS,
  CONTENT_TYPE_HTML,
  CONTENT_TYPE_JSON,
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../ContentType';
import { ArtifactType } from './ArtifactType';

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
