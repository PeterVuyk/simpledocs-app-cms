import { useCallback } from 'react';
import { getCmsConfiguration } from './configuration';

function useCmsConfiguration() {
  const configuration = getCmsConfiguration();

  const getBookTypeFromUrlSlug = useCallback(
    (urlSlug: string): string => {
      return Object.keys(configuration.books.bookItems)[
        Object.values(configuration.books.bookItems)
          .map((item) => item.urlSlug)
          .indexOf(urlSlug)
      ];
    },
    [configuration.books.bookItems]
  );

  const getMenuItemTitleByAggregate = useCallback(
    (aggregate: string) => {
      if (Object.keys(configuration.menu.menuItems).includes(aggregate)) {
        return configuration.menu.menuItems[aggregate].title;
      }
      return '';
    },
    [configuration.menu.menuItems]
  );

  const getSlugFromBookType = useCallback(
    (bookType: string): string => {
      if (Object.keys(configuration.books.bookItems).includes(bookType)) {
        return configuration.books.bookItems[bookType].urlSlug;
      }
      return '';
    },
    [configuration.books.bookItems]
  );

  const isBookType = useCallback(
    (value: string): boolean => {
      return Object.keys(configuration.books.bookItems).includes(value);
    },
    [configuration.books.bookItems]
  );

  const isMenuItem = useCallback(
    (value: string): boolean => {
      return Object.keys(configuration.menu.menuItems).includes(value);
    },
    [configuration.menu.menuItems]
  );

  const slugExist = useCallback(
    (value: string) => {
      const urlSlugs = [
        'users',
        ...Object.values(configuration.books.bookItems).map(
          (item) => item.urlSlug
        ),
        ...Object.values(configuration.menu.menuItems).map(
          (item) => item.urlSlug
        ),
      ];
      return urlSlugs.find((slug) => slug === value);
    },
    [configuration.books.bookItems, configuration.menu.menuItems]
  );

  return {
    configuration,
    getSlugFromBookType,
    getMenuItemTitleByAggregate,
    getBookTypeFromUrlSlug,
    isBookType,
    isMenuItem,
    slugExist,
  };
}

export default useCmsConfiguration;
