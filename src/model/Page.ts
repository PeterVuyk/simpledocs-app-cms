import { ContentType } from './artifacts/Artifact';

export interface Page {
  id?: string;
  pageIndex: number;
  chapter: string;
  chapterDivision: string;
  title: string;
  subTitle: string;
  searchText: string;
  content: string;
  contentType: ContentType;
  iconFile: string;
  isDraft: boolean;
  markedForDeletion?: boolean;
}