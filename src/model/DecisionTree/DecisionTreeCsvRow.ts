import { ContentType } from '../ContentType';

export interface DecisionTreeCsvRow {
  title: string;
  id: number;
  label: string;
  parentId?: number;
  lineLabel?: string;
  isDraft: boolean;
  markedForDeletion?: boolean;
  contentId?: string;
  contentType?: ContentType;
}
