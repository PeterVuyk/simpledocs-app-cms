export const ARTIFACT_TYPE_DECISION_TREE = 'decisionTree';
export const ARTIFACT_TYPE_TEMPLATE = 'template';
export const ARTIFACT_TYPE_SNIPPET = 'snippet';
export const ARTIFACT_TYPE_CSS_STYLESHEET = 'cssStylesheet';
export const ARTIFACT_TYPE_STANDALONE_PAGE = 'standalonePage';

export type ArtifactType =
  | 'decisionTree'
  | 'template'
  | 'snippet'
  | 'standalonePage'
  | 'cssStylesheet';

export function isArtifactType(value: string): value is ArtifactType {
  return [
    ARTIFACT_TYPE_DECISION_TREE,
    ARTIFACT_TYPE_TEMPLATE,
    ARTIFACT_TYPE_SNIPPET,
    ARTIFACT_TYPE_CSS_STYLESHEET,
    ARTIFACT_TYPE_STANDALONE_PAGE,
  ].includes(value);
}
