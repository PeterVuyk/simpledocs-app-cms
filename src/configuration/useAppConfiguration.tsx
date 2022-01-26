import { useCallback } from 'react';
import { getAppConfiguration } from './configuration';

function useAppConfiguration() {
  const configuration = getAppConfiguration();

  const getBookTitleByAggregate = useCallback(
    (aggregate: string) => {
      const bookType = [
        ...configuration.firstBookTab.bookTypes,
        ...configuration.secondBookTab.bookTypes,
      ].find((value) => value.bookType === aggregate);
      return bookType ? bookType.title : '';
    },
    [
      configuration.firstBookTab.bookTypes,
      configuration.secondBookTab.bookTypes,
    ]
  );

  const getPageHierarchy = useCallback(
    (bookType: string, chapterDivision: string): string => {
      const books = [
        ...configuration.firstBookTab.bookTypes,
        ...configuration.secondBookTab.bookTypes,
      ];
      const book = books.find((value) => value.bookType === bookType);
      if (book?.chapterDivisionsInList.includes(chapterDivision)) {
        return '(Topniveau)';
      }
      if (book?.chapterDivisionsInIntermediateList.includes(chapterDivision)) {
        return '(Tussenliggende pagina)';
      }
      return '';
    },
    [configuration]
  );

  return {
    configuration,
    getPageHierarchy,
    getBookTitleByAggregate,
  };
}

export default useAppConfiguration;
