interface MenuLinkItemConfig {
  id: string;
  url: string;
  icon: string;
}

export interface MenuLinkConfig {
  title: string;
  listItems: MenuLinkItemConfig[];
}

export interface MenuItem {
  title: string;
  urlSlug: string;
  icon: string;
}

interface BookItems {
  instructionManual: MenuItem;
  RVV1990: MenuItem;
  regelingOGS2009: MenuItem;
  ontheffingGoedeTaakuitoefening: MenuItem;
  brancherichtlijnMedischeHulpverlening: MenuItem;
}

interface MenuItems {
  publications: MenuItem;
  styleguide: MenuItem;
  configurations: MenuItem;
  calculations: MenuItem;
  decisionTree: MenuItem;
}

interface BookConfig {
  title: string;
  bookItems: BookItems;
}

export interface MenuConfig {
  title: string;
  menuItems: MenuItems;
}

export interface NavigationConfig {
  books: BookConfig;
  menu: MenuConfig;
  externalLinks: MenuLinkConfig;
}
