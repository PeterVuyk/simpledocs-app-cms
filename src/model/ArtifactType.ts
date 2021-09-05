export const ARTIFACT_TYPE_DECISION_TREE = 'decisionTree';
export const ARTIFACT_TYPE_TEMPLATE = 'template';
export const ARTIFACT_TYPE_SNIPPET = 'snippet';
export const ARTIFACT_TYPE_CSS_STYLESHEET = 'cssStylesheet';

export type ArtifactType =
  | 'decisionTree'
  | 'template'
  | 'snippet'
  | 'cssStylesheet';

export function isArtifactType(value: string): value is ArtifactType {
  return [
    ARTIFACT_TYPE_DECISION_TREE,
    ARTIFACT_TYPE_TEMPLATE,
    ARTIFACT_TYPE_SNIPPET,
    ARTIFACT_TYPE_CSS_STYLESHEET,
  ].includes(value);
}
