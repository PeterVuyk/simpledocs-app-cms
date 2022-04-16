import React, { FC } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import BookPageListItem from './BookPageListItem';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../../model/EditStatus';
import { PageInfo } from '../../../model/Page';
import { DOCUMENTATION_ID_LINK_BOOK_PAGE } from '../../../model/DocumentationType';
import HelpAction from '../../../components/ItemAction/helpAction/HelpAction';

interface Props {
  pages?: PageInfo[] | null;
  onLoadPages: () => void;
  editStatus: EditStatus;
  bookType: string;
}

const BookPagesList: FC<Props> = ({
  pages,
  onLoadPages,
  editStatus,
  bookType,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: '#ddd' }}>
            <TableCell>
              <strong>Hoofdstuk</strong>
            </TableCell>
            <TableCell>
              <strong>Titel</strong>
            </TableCell>
            <TableCell>
              <strong>Hoofdstukindeling</strong>
            </TableCell>
            <TableCell>
              <strong>Illustratie</strong>
            </TableCell>
            <TableCell>
              <strong>Inhoudstype</strong>
            </TableCell>
            <TableCell>
              <strong>ID link</strong>&nbsp;
              <HelpAction documentationType={DOCUMENTATION_ID_LINK_BOOK_PAGE} />
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {pages &&
            pages.map((row) => (
              <TableRow
                style={{
                  backgroundColor:
                    editStatus === EDIT_STATUS_DRAFT && row?.markedForDeletion
                      ? '#FCC1C1B5'
                      : '#fff',
                }}
                key={row.id}
              >
                <BookPageListItem
                  bookTypeSlug={bookType}
                  editStatus={editStatus}
                  page={row}
                  onLoadPages={onLoadPages}
                  bookType={bookType}
                />
              </TableRow>
            ))}
          {pages && pages.length === 0 && (
            <TableRow key="no-result">
              <TableCell component="th" scope="row" colSpan={7}>
                Geen resultaten.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BookPagesList;
