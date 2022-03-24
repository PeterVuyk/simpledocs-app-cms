import { IconFamilyType } from '../IconFamilyType';
import { Versions } from '../Versioning';

export interface BottomTab {
  familyType: IconFamilyType;
  icon: string;
  title: string;
}

export interface LinkItem {
  title: string;
  url: string;
  index: 0;
  iconName: string;
  iconType: string;
}

export interface EnabledStandalonePagesTypes {
  [key: string]: boolean;
}

export interface Drawer {
  links: LinkItem[];
  enabledStandalonePagesTypes: EnabledStandalonePagesTypes;
}

export interface BookInfo {
  index: number;
  bookType: string;
  title: string;
  chapterDivisionsInList: string[];
  chapterDivisionsInIntermediateList: string[];
  subTitle?: string;
  iconFile?: string;
  imageFile?: string;
}

export interface BookTabInfo {
  bottomTab: BottomTab;
  bookTypes: BookInfo[];
  title?: string;
  subTitle?: string;
}

export interface AppConfigurations {
  drawer: Drawer;
  firstBookTab: BookTabInfo;
  secondBookTab: BookTabInfo;
  thirdBookTab: BookTabInfo;
  versioning: Versions;
}
