import { ContentType } from './ContentType';

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

export interface PageInfo extends Page {
  isNewCreatedPage: boolean;
}
