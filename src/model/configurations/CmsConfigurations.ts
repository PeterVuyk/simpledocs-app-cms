import { Versions } from '../Versioning';

export interface MenuItem {
  navigationIndex: number;
  title: string;
  urlSlug: string;
  icon: string;
}

interface MenuItems {
  [key: string]: MenuItem;
}

export interface MenuConfig {
  title: string;
  menuItems: MenuItems;
}

export interface CmsConfigurations {
  menu: MenuConfig;
  versioning: Versions;
}
