export interface DecisionTreeStep {
  title: string;
  iconFile?: string;
  id: number;
  label: string;
  parentId?: number;
  lineLabel?: string;
  htmlFileId?: string;
  internalNote?: string;
}
