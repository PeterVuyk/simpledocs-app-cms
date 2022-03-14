import { useCallback } from 'react';
import { getAppConfiguration } from './configuration';

function useAppConfiguration() {
  const configuration = getAppConfiguration();

  const getBookInfo = useCallback(
    (aggregate: string) => {
      const books = [
        ...configuration.firstBookTab.bookTypes,
        ...configuration.secondBookTab.bookTypes,
        ...configuration.thirdBookTab.bookTypes,
      ];
      return books.find((value) => value.bookType === aggregate);
    },
    [
      configuration.firstBookTab.bookTypes,
      configuration.secondBookTab.bookTypes,
      configuration.thirdBookTab.bookTypes,
    ]
  );

  const getTabByBookType = useCallback(
    (bookType: string) => {
      const result = configuration.firstBookTab.bookTypes.find(
        (value) => value.bookType === bookType
      );
      if (result) {
        return 'firstBookTab';
      }
      return configuration.secondBookTab.bookTypes.find(
        (value) => value.bookType === bookType
      )
        ? 'secondBookTab'
        : 'thirdBookTab';
    },
    [
      configuration.firstBookTab.bookTypes,
      configuration.secondBookTab.bookTypes,
    ]
  );

  const getSortedBooks = useCallback(() => {
    return [
      ...configuration.firstBookTab.bookTypes.sort((a, b) => a.index - b.index),
      ...configuration.secondBookTab.bookTypes.sort(
        (a, b) => a.index - b.index
      ),
      ...configuration.thirdBookTab.bookTypes.sort((a, b) => a.index - b.index),
    ];
  }, [
    configuration.firstBookTab.bookTypes,
    configuration.secondBookTab.bookTypes,
    configuration.thirdBookTab.bookTypes,
  ]);

  const getBookTitleByAggregate = useCallback(
    (aggregate: string) => {
      const bookType = [
        ...configuration.firstBookTab.bookTypes,
        ...configuration.secondBookTab.bookTypes,
        ...configuration.thirdBookTab.bookTypes,
      ].find((value) => value.bookType === aggregate);
      return bookType ? bookType.title : '';
    },
    [
      configuration.firstBookTab.bookTypes,
      configuration.secondBookTab.bookTypes,
      configuration.thirdBookTab.bookTypes,
    ]
  );

  const getPageHierarchy = useCallback(
    (bookType: string, chapterDivision: string): string => {
      const books = [
        ...configuration.firstBookTab.bookTypes,
        ...configuration.secondBookTab.bookTypes,
        ...configuration.thirdBookTab.bookTypes,
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
    getBookInfo,
    getSortedBooks,
    getTabByBookType,
  };
}

export default useAppConfiguration;
