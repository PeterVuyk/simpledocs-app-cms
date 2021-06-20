import { ArticleType } from './ArticleType';

export interface DecisionTreeStep {
  title: string;
  iconFile?: string;
  id: number;
  label: string;
  parentId?: number;
  lineLabel?: string;
  articleType?: ArticleType;
  articleChapter?: string;
  internalNote?: string;
}
