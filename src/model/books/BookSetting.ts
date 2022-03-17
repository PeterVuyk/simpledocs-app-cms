import { ChapterDivision } from './ChapterDivisions';
import { BookTab } from '../configurations/BookTab';

export interface BookSetting {
  bookType: string;
  title: string;
  subTitle: string;
  chapterDivisionsInList: ChapterDivision[];
  chapterDivisionsInIntermediateList: ChapterDivision[];
  imageFile: string;
  tab: BookTab;
  index: number;
  isDraft: boolean;
}
