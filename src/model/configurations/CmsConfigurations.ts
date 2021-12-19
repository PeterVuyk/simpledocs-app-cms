import { Versions } from '../Versioning';

export interface MenuItem {
  navigationIndex: number;
  title: string;
  urlSlug: string;
  icon: string;
}

interface BookItems {
  [key: string]: MenuItem;
}

interface MenuItems {
  [key: string]: MenuItem;
}

interface BookConfig {
  title: string;
  bookItems: BookItems;
}

export interface MenuConfig {
  title: string;
  menuItems: MenuItems;
}

export interface CmsConfigurations {
  books: BookConfig;
  menu: MenuConfig;
  versioning: Versions;
}
