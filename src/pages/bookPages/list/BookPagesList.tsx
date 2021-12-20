import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import BookPageListItem from './BookPageListItem';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../../model/EditStatus';
import { PageInfo } from '../../../model/Page';
import useCmsConfiguration from '../../../configuration/useCmsConfiguration';
import { DOCUMENTATION_ID_LINK_BOOK_PAGE } from '../../../model/DocumentationType';
import HelpAction from '../../../components/ItemAction/helpAction/HelpAction';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#ddd',
  },
});

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
  const classes = useStyles();
  const { getSlugFromBookType } = useCmsConfiguration();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow className={classes.head}>
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
              <strong>Index</strong>
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
                  bookTypeSlug={getSlugFromBookType(bookType)}
                  editStatus={editStatus}
                  page={row}
                  onLoadPages={onLoadPages}
                  bookType={bookType}
                />
              </TableRow>
            ))}
          {pages && pages.length === 0 && (
            <TableRow key="no-result">
              <TableCell component="th" scope="row" colSpan={8}>
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
