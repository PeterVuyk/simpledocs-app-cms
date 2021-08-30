import { HtmlFileCategory } from './HtmlFileCategory';

export interface HtmlFileInfo {
  id?: string;
  htmlFileCategory: HtmlFileCategory;
  htmlFile: string;
  title: string;
}
