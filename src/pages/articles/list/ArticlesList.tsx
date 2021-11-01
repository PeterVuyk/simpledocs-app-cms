import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ArticleListItem from './ArticleListItem';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../../model/EditStatus';
import { Article } from '../../../model/Article';
import useConfiguration from '../../../configuration/useConfiguration';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#ddd',
  },
});

interface Props {
  articles?: Article[] | null;
  onLoadArticles: () => void;
  editStatus: EditStatus;
  bookType: string;
}

const ArticlesList: FC<Props> = ({
  articles,
  onLoadArticles,
  editStatus,
  bookType,
}) => {
  const classes = useStyles();
  const { getSlugFromBookType } = useConfiguration();

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
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {articles &&
            articles.map((row) => (
              <TableRow
                style={{
                  backgroundColor:
                    editStatus === EDIT_STATUS_DRAFT && row?.markedForDeletion
                      ? '#FCC1C1B5'
                      : '#fff',
                }}
                key={row.id}
              >
                <ArticleListItem
                  bookTypeSlug={getSlugFromBookType(bookType)}
                  editStatus={editStatus}
                  article={row}
                  onLoadArticles={onLoadArticles}
                  bookType={bookType}
                />
              </TableRow>
            ))}
          {articles && articles.length === 0 && (
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

export default ArticlesList;
