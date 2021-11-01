import { IconFamilyType } from './IconFamilyType';
import { Versions } from './Versioning';

export interface BottomTab {
  familyType: IconFamilyType;
  icon: string;
  title: string;
}

export interface BookInfo {
  index: number;
  bookType: string;
  title: string;
  chapterDivisionsInList: string[];
  chapterDivisionsInIntermediateList: string[];
  subTitle?: string;
  iconFile?: string;
}

export interface DecisionsTab {
  bottomTab: BottomTab;
  title: string;
  subTitle: string;
  indexDecisionType: string[];
}

export interface TabInfo {
  bottomTab: BottomTab;
  bookTypes: BookInfo[];
  title?: string;
  subTitle?: string;
}

export interface AppConfigurations {
  firstTab: TabInfo;
  secondTab: TabInfo;
  decisionsTab: DecisionsTab;
  defaultBookTypeSearch: string;
  versioning: Versions;
}
