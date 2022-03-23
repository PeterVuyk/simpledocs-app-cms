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
import { StandalonePage } from '../../model/standalonePages/StandalonePage';
import StandalonePagesRowItem from './StandalonePagesRowItem';
import standalonePagesRepository from '../../firebase/database/standalonePagesRepository';
import logger from '../../helper/logger';
import { notify } from '../../redux/slice/notificationSlice';
import { useAppDispatch } from '../../redux/hooks';

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
  const dispatch = useAppDispatch();

  const handleLoadPages = useCallback((): Promise<void> => {
    return standalonePagesRepository
      .getStandalonePages()
      .then(setPages)
      .catch((reason) => {
        logger.errorWithReason('Failed to get standalonePages in CMS', reason);
        dispatch(
          notify({
            notificationOpen: true,
            notificationType: 'error',
            notificationMessage:
              'Het laden van de pagina is mislukt, refresh de pagina.',
          })
        );
      });
  }, [dispatch]);

  useEffect(() => {
    handleLoadPages();
  }, [dispatch, handleLoadPages]);

  return (
    <>
      <PageHeading title={title} />
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.head} key="tableRow">
              <TableCell>Titel</TableCell>
              <TableCell>Inhoudstype</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {pages !== null &&
              pages.map((row) => (
                <TableRow key={row.title.toString()}>
                  <StandalonePagesRowItem
                    standalonePage={row}
                    onLoadPages={handleLoadPages}
                  />
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
