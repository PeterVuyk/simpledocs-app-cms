import { ContentType } from '../artifacts/Artifact';

export interface DecisionTreeStep {
  id: number;
  label: string;
  parentId?: number;
  lineLabel?: string;
  contentId?: string;
  content?: string;
  contentType?: ContentType;
}
