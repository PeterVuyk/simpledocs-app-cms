interface MenuItemConfig {
  id: string;
  urlSlug: string;
  icon: string;
}
interface MenuLinkItemConfig {
  id: string;
  url: string;
  icon: string;
}
export interface MenuLinkConfig {
  title: string;
  listItems: MenuLinkItemConfig[];
}
export interface MenuConfig {
  title: string;
  listItems: MenuItemConfig[];
}
export interface NavigationConfig {
  books: MenuConfig;
  menu: MenuConfig;
  externalLinks: MenuLinkConfig;
}
