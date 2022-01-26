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

export interface Drawer {
  links: LinkItem[];
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

export interface DecisionsTab {
  bottomTab: BottomTab;
  title: string;
  subTitle: string;
  indexDecisionType: string[];
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
  decisionsTab: DecisionsTab;
  versioning: Versions;
}
