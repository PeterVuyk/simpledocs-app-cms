import { ChapterDivision } from './ChapterDivisions';

export interface BookSetting {
  bookType: string;
  title: string;
  subTitle: string;
  chapterDivisionsInList: ChapterDivision[];
  chapterDivisionsInIntermediateList: ChapterDivision[];
  imageFile: string;
  tab: 'firstBookTab' | 'secondBookTab' | 'thirdBookTab';
  index: number;
  isDraft: boolean;
}
