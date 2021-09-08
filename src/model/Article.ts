import { ContentType } from './Artifact';

export interface Article {
  id?: string;
  pageIndex: number;
  chapter: string;
  level: string;
  title: string;
  subTitle: string;
  searchText: string;
  content: string;
  contentType: ContentType;
  iconFile: string;
  isDraft: boolean;
  markedForDeletion?: boolean;
}
