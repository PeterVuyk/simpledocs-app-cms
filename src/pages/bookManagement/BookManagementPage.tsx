import React, { FC, useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PageHeading from '../../layout/PageHeading';
import LoadingSpinner from '../../components/LoadingSpinner';
import useAppConfiguration from '../../configuration/useAppConfiguration';
import { BookSetting } from '../../model/books/BookSetting';
import BookSettingsListItem from './BookSettingsListItem';
import { BookInfo } from '../../model/configurations/AppConfigurations';
import BookManagementHeadingButtonGroup from './BookManagementHeadingButtonGroup';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#ddd',
  },
});

interface Props {
  title: string;
}

const BookManagementPage: FC<Props> = ({ title }) => {
  const [bookSettings, setBookSettings] = useState<BookSetting[]>([]);

  // const cmsConfigurations = useCmsConfiguration().configuration;
  const appConfigurations = useAppConfiguration().configuration;

  const mapBookInfoToBookSettings = useCallback(
    (bookInfo: BookInfo, tab: 'firstBookTab' | 'secondBookTab') => {
      return {
        title: bookInfo.title,
        subTitle: bookInfo.subTitle,
        tab,
        index: bookInfo.index,
        chapterDivisionsInIntermediateList:
          bookInfo.chapterDivisionsInIntermediateList,
        imageFile: bookInfo.imageFile,
        isDraft: !Object.keys(appConfigurations.versioning).includes(
          bookInfo.bookType
        ),
        chapterDivisionsInList: bookInfo.chapterDivisionsInList,
        bookType: bookInfo.bookType,
      } as BookSetting;
    },
    [appConfigurations.versioning]
  );

  useEffect(() => {
    const firstBookTab = appConfigurations.firstBookTab.bookTypes.map(
      (bookInfo) => mapBookInfoToBookSettings(bookInfo, 'firstBookTab')
    );
    const secondBookTab = appConfigurations.secondBookTab.bookTypes.map(
      (bookInfo) => mapBookInfoToBookSettings(bookInfo, 'secondBookTab')
    );
    setBookSettings([...firstBookTab, ...secondBookTab]);
  }, [
    appConfigurations.firstBookTab.bookTypes,
    appConfigurations.secondBookTab.bookTypes,
    mapBookInfoToBookSettings,
  ]);

  const classes = useStyles();

  return (
    <>
      <PageHeading title={title}>
        <BookManagementHeadingButtonGroup />
      </PageHeading>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.head} key="tableRow">
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
