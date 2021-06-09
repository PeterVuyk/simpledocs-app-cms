import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Article } from '../../../firebase/database/articleRepository';
import ArticleListItem from './ArticleListItem';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#ddd',
  },
});

interface Props {
  articles: Article[];
  loadArticlesHandle: () => void;
  editStatus: 'draft' | 'published';
}

const ArticlesList: React.FC<Props> = ({
  articles,
  loadArticlesHandle,
  editStatus,
}) => {
  const classes = useStyles();

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
              <strong>Markering</strong>
            </TableCell>
            <TableCell>
              <strong>Index</strong>
            </TableCell>
            <TableCell>
              <strong>Illustratie</strong>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {articles.map((row) => (
            <TableRow
              style={{
                backgroundColor:
                  editStatus === 'draft' && row?.markedForDeletion
                    ? '#fcb3b3'
                    : '#fff',
              }}
              hover
              key={row.chapter}
            >
              <ArticleListItem
                editStatus={editStatus}
                article={row}
                loadArticlesHandle={loadArticlesHandle}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ArticlesList;
