import { useCallback } from 'react';
import { getCmsConfiguration } from './configuration';

function useCmsConfiguration() {
  const configuration = getCmsConfiguration();

  const getMenuItemTitleByAggregate = useCallback(
    (aggregate: string) => {
      if (Object.keys(configuration.menu.menuItems).includes(aggregate)) {
        return configuration.menu.menuItems[aggregate].title;
      }
      return '';
    },
    [configuration.menu.menuItems]
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
        ...Object.values(configuration.menu.menuItems).map(
          (item) => item.urlSlug
        ),
        'users',
      ];
      return urlSlugs.find((slug) => slug === value);
    },
    [configuration.menu.menuItems]
  );

  return {
    configuration,
    getMenuItemTitleByAggregate,
    isMenuItem,
    slugExist,
  };
}

export default useCmsConfiguration;
