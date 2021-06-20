export interface Article {
  id?: string;
  pageIndex: number;
  chapter: string;
  level: string;
  title: string;
  subTitle: string;
  searchText: string;
  htmlFile: string;
  iconFile: string;
  isDraft: boolean;
  markedForDeletion?: boolean;
}
