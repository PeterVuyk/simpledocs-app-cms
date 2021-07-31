import { IconFamilyType } from './IconFamilyType';

export interface BottomTab {
  familyType: IconFamilyType;
  icon: string;
  title: string;
}

export interface ArticleInfo {
  index: number;
  articleType: string;
  title: string;
  showLevelsInList: string[];
  showLevelsInIntermediateList: string[];
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
  articleTypes: ArticleInfo[];
  title?: string;
  subTitle?: string;
}

export interface ConfigInfo {
  firstTab: TabInfo;
  secondTab: TabInfo;
  decisionsTab: DecisionsTab;
  defaultArticleTypeSearch: string;
}
