import React, { FC, useEffect, useState } from 'react';
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
import { StandalonePage } from '../../model/standalonePages/StandalonePage';
import StandalonePagesRowItem from './StandalonePagesRowItem';
import standalonePagesRepository from '../../firebase/database/standalonePagesRepository';

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

const StandalonePages: FC<Props> = ({ title }) => {
  const [pages, setPages] = useState<StandalonePage[] | null>(null);
  const classes = useStyles();

  useEffect(() => {
    standalonePagesRepository.getStandalonePages().then(setPages);
  }, []);

  return (
    <>
      <PageHeading title={title} />
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.head} key="tableRow">
              <TableCell>Titel</TableCell>
              <TableCell>Todo</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {pages !== null &&
              pages.map((row) => (
                <TableRow key={row.title.toString()}>
                  <StandalonePagesRowItem standalonePage={row} />
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {pages === null && <LoadingSpinner />}
    </>
  );
};

export default StandalonePages;
