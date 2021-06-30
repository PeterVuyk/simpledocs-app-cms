export interface DecisionTreeStep {
  title: string;
  iconFile?: string;
  id: number;
  label: string;
  parentId?: number;
  lineLabel?: string;
  htmlFileId?: string;
  htmlFile: string;
  isDraft: boolean;
  markedForDeletion?: boolean;
  internalNote?: string;
}
