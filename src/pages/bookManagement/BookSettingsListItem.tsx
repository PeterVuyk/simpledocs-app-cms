import React, { FC } from 'react';
import TableCell from '@mui/material/TableCell';
import { BookSetting } from '../../model/books/BookSetting';
import ChapterDivisions from '../../model/books/ChapterDivisions';
import BookManagementListItemActions from './BookManagementListItemActions';
import { AppConfigurations } from '../../model/configurations/AppConfigurations';
import {
  FIRST_BOOK_TAB,
  SECOND_BOOK_TAB,
} from '../../model/configurations/BookTab';

interface Props {
  bookSetting: BookSetting;
  appConfigurations: AppConfigurations;
}

const BookSettingsListItem: FC<Props> = ({
  bookSetting,
  appConfigurations,
}) => {
  const primaryPageText = () => {
    return `Primaire pagina: ${bookSetting.chapterDivisionsInList
      // @ts-ignore
      .map((value) => ChapterDivisions[value])
      .join(', ')}`;
  };

  const secondaryPageText = () => {
    return `Secundaire pagina: ${bookSetting.chapterDivisionsInIntermediateList
      // @ts-ignore
      .map((value) => ChapterDivisions[value])
      .join(', ')}`;
  };

  return (
    <>
      <TableCell>{bookSetting.title}</TableCell>
      <TableCell>{bookSetting.subTitle}</TableCell>
      <TableCell style={{ whiteSpace: 'nowrap' }}>
        {/* eslint-disable-next-line no-nested-ternary */}
        {bookSetting.tab === FIRST_BOOK_TAB
          ? 'Tab 1, '
          : bookSetting.tab === SECOND_BOOK_TAB
          ? 'Tab 2, '
          : 'Tab 3, '}
        index: {bookSetting.index}
      </TableCell>
      <TableCell>{bookSetting.isDraft ? 'Concept' : 'Gepubliceerd'}</TableCell>
      <TableCell>
        {primaryPageText()}
        <br />
        <br />
        {secondaryPageText()}
      </TableCell>
      <TableCell>
        <img
          src={bookSetting.imageFile}
          width={100}
          alt={bookSetting.title}
          style={{ maxHeight: 100 }}
        />
      </TableCell>
      <TableCell style={{ whiteSpace: 'nowrap' }}>
        <BookManagementListItemActions
          bookSetting={bookSetting}
          appConfigurations={appConfigurations}
        />
      </TableCell>
    </>
  );
};

export default BookSettingsListItem;
