import { useCallback } from 'react';
import { getAppConfiguration } from './configuration';

function useAppConfiguration() {
  const configuration = getAppConfiguration();

  const getPageHierarchy = useCallback(
    (bookType: string, chapterDivision: string): string => {
      const books = [
        ...configuration.firstTab.bookTypes,
        ...configuration.secondTab.bookTypes,
      ];
      const book = books.find((value) => value.bookType === bookType);
      if (book?.chapterDivisionsInList.includes(chapterDivision)) {
        return 'Topniveau';
      }
      if (book?.chapterDivisionsInIntermediateList.includes(chapterDivision)) {
        return 'Tussenliggende pagina';
      }
      return '';
    },
    [configuration]
  );

  return {
    configuration,
    getPageHierarchy,
  };
}

export default useAppConfiguration;
