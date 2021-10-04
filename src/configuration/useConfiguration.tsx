import { getCmsConfiguration } from './cmsConfiguration';

function useConfiguration() {
  const configuration = getCmsConfiguration();

  const getBookTypeFromUrlSlug = (urlSlug: string): string => {
    return Object.keys(configuration.books.bookItems)[
      Object.values(configuration.books.bookItems)
        .map((item) => item.urlSlug)
        .indexOf(urlSlug)
    ];
  };

  const getTitleByAggregate = (aggregate: string) => {
    if (Object.keys(configuration.books.bookItems).includes(aggregate)) {
      // @ts-ignore
      return configuration.books.bookItems[aggregate].title;
    }
    if (Object.keys(configuration.menu.menuItems).includes(aggregate)) {
      return configuration.menu.menuItems[aggregate].title;
    }
    return '';
  };

  const getSlugFromBookType = (bookType: string): string => {
    if (Object.keys(configuration.books.bookItems).includes(bookType)) {
      // @ts-ignore
      return configuration.books.bookItems[bookType].urlSlug;
    }
    return '';
  };

  const isBookType = (value: string): boolean => {
    return Object.keys(configuration.books.bookItems).includes(value);
  };

  const slugExist = (value: string) => {
    const urlSlugs = [
      ...Object.values(configuration.books.bookItems).map(
        (item) => item.urlSlug
      ),
      ...Object.values(configuration.menu.menuItems).map(
        (item) => item.urlSlug
      ),
    ];
    return urlSlugs.find((slug) => slug === value);
  };

  return {
    configuration,
    getSlugFromBookType,
    getTitleByAggregate,
    getBookTypeFromUrlSlug,
    isBookType,
    slugExist,
  };
}

export default useConfiguration;
