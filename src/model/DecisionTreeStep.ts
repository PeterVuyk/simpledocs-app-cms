import { ContentType } from './Artifact';

export interface DecisionTreeStep {
  title: string;
  iconFile?: string;
  id: number;
  label: string;
  parentId?: number;
  lineLabel?: string;
  isDraft: boolean;
  markedForDeletion?: boolean;
  internalNote?: string;
  contentId?: string;
  content?: string;
  contentType?: ContentType;
  bla: string;
}
