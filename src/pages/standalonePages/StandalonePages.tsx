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
import EditStatusToggle from '../../components/form/EditStatusToggle';
import useStatusToggle from '../../components/hooks/useStatusToggle';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../model/EditStatus';
import { DOCUMENTATION_STANDALONE_PAGES } from '../../model/DocumentationType';

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
  const { editStatus, setEditStatus } = useStatusToggle();
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const handleLoadPages = useCallback((): Promise<void> => {
    return standalonePagesRepository
      .getStandalonePages()
      .then((values) =>
        setPages(
          values
            .sort((a, b) => a.title.localeCompare(b.title))
            .filter((value) =>
              editStatus === EDIT_STATUS_DRAFT
                ? value.isDraft || value.markedForDeletion
                : !value.isDraft
            )
        )
      )
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
  }, [editStatus, dispatch]);

  useEffect(() => {
    handleLoadPages();
  }, [dispatch, handleLoadPages, editStatus]);

  return (
    <>
      <PageHeading title={title} help={DOCUMENTATION_STANDALONE_PAGES}>
        <EditStatusToggle
          editStatus={editStatus}
          setEditStatus={setEditStatus}
        />
      </PageHeading>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.head} key="tableRow">
              <TableCell>Pagina</TableCell>
              <TableCell>Titel</TableCell>
              <TableCell>Inhoudstype</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {pages !== null &&
              pages.map((row) => (
                <TableRow
                  key={row.title.toString() + row.markedForDeletion.toString()}
                  style={{
                    backgroundColor: row.markedForDeletion
                      ? '#FCC1C1B5'
                      : '#fff',
                  }}
                >
                  <StandalonePagesRowItem
                    standalonePage={row}
                    onLoadPages={handleLoadPages}
                    editStatus={editStatus as EditStatus}
                  />
                </TableRow>
              ))}
            {pages && pages.length === 0 && (
              <TableRow key="no-result">
                <TableCell component="th" scope="row" colSpan={4}>
                  Geen resultaten.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pages === null && <LoadingSpinner />}
    </>
  );
};

export default StandalonePages;
