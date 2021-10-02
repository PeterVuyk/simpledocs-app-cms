import cmsConfiguration from './cmsConfiguration.json';
import { CmsConfiguration } from '../model/CmsConfiguration';

function useConfiguration() {
  const configuration = cmsConfiguration as CmsConfiguration;

  const getBookTypeFromUrlSlug = (urlSlug: string): string => {
    return Object.keys(configuration.books.bookItems)[
      Object.values(configuration.books.bookItems)
        .map((item) => item.urlSlug)
        .indexOf(urlSlug)
    ];
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

  const isMenuAggregate = (value: string) => {
    return Object.keys(configuration.menu.menuItems).includes(value);
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
    getBookTypeFromUrlSlug,
    isBookType,
    isMenuAggregate,
    slugExist,
  };
}

export default useConfiguration;
