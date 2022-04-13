import React, { FC, useCallback, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PageHeading from '../../layout/PageHeading';
import LoadingSpinner from '../../components/LoadingSpinner';
import useAppConfiguration from '../../configuration/useAppConfiguration';
import { BookSetting } from '../../model/books/BookSetting';
import BookSettingsListItem from './BookSettingsListItem';
import { BookInfo } from '../../model/configurations/AppConfigurations';
import BookManagementHeadingButtonGroup from './BookManagementHeadingButtonGroup';
import { DOCUMENTATION_BOOK_MANAGEMENT } from '../../model/DocumentationType';
import {
  BookTab,
  FIRST_BOOK_TAB,
  SECOND_BOOK_TAB,
  THIRD_BOOK_TAB,
} from '../../model/configurations/BookTab';

interface Props {
  title: string;
}

const BookManagementPage: FC<Props> = ({ title }) => {
  const [bookSettings, setBookSettings] = useState<BookSetting[]>([]);

  const appConfigurations = useAppConfiguration().configuration;

  const mapBookInfoToBookSettings = useCallback(
    (bookInfo: BookInfo, tab: BookTab) => {
      return {
        title: bookInfo.title,
        subTitle: bookInfo.subTitle,
        tab,
        index: bookInfo.index,
        chapterDivisionsInIntermediateList:
          bookInfo.chapterDivisionsInIntermediateList,
        imageFile: bookInfo.imageFile,
        isDraft:
          appConfigurations.versioning[bookInfo.bookType]?.isDraft ?? false,
        chapterDivisionsInList: bookInfo.chapterDivisionsInList,
        bookType: bookInfo.bookType,
      } as BookSetting;
    },
    [appConfigurations.versioning]
  );

  useEffect(() => {
    const firstBookTab = appConfigurations.firstBookTab.bookTypes.map(
      (bookInfo) => mapBookInfoToBookSettings(bookInfo, FIRST_BOOK_TAB)
    );
    const secondBookTab = appConfigurations.secondBookTab.bookTypes.map(
      (bookInfo) => mapBookInfoToBookSettings(bookInfo, SECOND_BOOK_TAB)
    );
    const thirdBookTab = appConfigurations.thirdBookTab.bookTypes.map(
      (bookInfo) => mapBookInfoToBookSettings(bookInfo, THIRD_BOOK_TAB)
    );
    setBookSettings([...firstBookTab, ...secondBookTab, ...thirdBookTab]);
  }, [
    appConfigurations.firstBookTab.bookTypes,
    appConfigurations.secondBookTab.bookTypes,
    appConfigurations.thirdBookTab.bookTypes,
    mapBookInfoToBookSettings,
  ]);

  return (
    <>
      <PageHeading title={title} help={DOCUMENTATION_BOOK_MANAGEMENT}>
        <BookManagementHeadingButtonGroup />
      </PageHeading>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#ddd' }} key="tableRow">
              <TableCell>Titel</TableCell>
              <TableCell>Subtitle</TableCell>
              <TableCell>Index</TableCell>
              <TableCell>Concept / Gepubliceerd</TableCell>
              <TableCell>Hoofdstuk indeling</TableCell>
              <TableCell>Afbeelding (100x100 pixels)</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {bookSettings
              .sort((a, b) => a.index - b.index)
              .sort((a, b) => a.tab.localeCompare(b.tab))
              .map((row) => (
                <TableRow key={row.title.toString()}>
                  <BookSettingsListItem
                    bookSetting={row}
                    appConfigurations={appConfigurations}
                  />
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {bookSettings.length === 0 && <LoadingSpinner />}
    </>
  );
};

export default BookManagementPage;
