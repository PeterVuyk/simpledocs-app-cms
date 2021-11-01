import { Versions } from '../Versioning';

interface MenuLinkItemConfig {
  navigationIndex: number;
  id: string;
  url: string;
  icon: string;
}

export interface MenuLinkConfig {
  title: string;
  listItems: MenuLinkItemConfig[];
}

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

interface Cms {
  logoUrl: string;
  title: string;
}

export interface CmsConfigurations {
  books: BookConfig;
  menu: MenuConfig;
  externalLinks: MenuLinkConfig;
  cms: Cms;
  versioning: Versions;
}
