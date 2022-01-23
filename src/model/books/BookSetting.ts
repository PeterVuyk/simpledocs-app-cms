import { ChapterDivision } from './ChapterDivisions';

export interface BookSetting {
  title: string;
  subTitle: string;
  chapterDivisionsInList: ChapterDivision[];
  chapterDivisionsInIntermediateList: ChapterDivision[];
  imageFile: string;
  tab: 'firstBookTab' | 'secondBookTab';
  index: number;
  isDraft: boolean;
}
