import React, { FC } from 'react';
import TableCell from '@material-ui/core/TableCell';
import { BookSetting } from '../../model/books/BookSetting';
import ChapterDivisions from '../../model/books/ChapterDivisions';

interface Props {
  bookSetting: BookSetting;
}

const BookSettingsListItem: FC<Props> = ({ bookSetting }) => {
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
        {bookSetting.tab === 'firstBookTab' ? 'Tab 1, ' : 'Tab 2, '}
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
          height={100}
          alt={bookSetting.title}
        />
      </TableCell>
      <TableCell />
    </>
  );
};

export default BookSettingsListItem;
