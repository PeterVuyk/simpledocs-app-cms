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
import {
  DOCUMENTATION_DEFAULT_TEMPLATE,
  DOCUMENTATION_NOTIFICATIONS,
  DOCUMENTATION_NOTIFICATIONS_DELIVERY,
  DOCUMENTATION_NOTIFICATIONS_STATUS,
} from '../../model/DocumentationType';
import { NotificationInfo } from '../../model/Notification/NotificationInfo';
import notificationRepository from '../../firebase/database/notificationRepository';
import logger from '../../helper/logger';
import { notify } from '../../redux/slice/notificationSlice';
import { useAppDispatch } from '../../redux/hooks';
import LoadingSpinner from '../../components/LoadingSpinner';
import NotificationsListItem from './NotificationsListItem';
import HelpAction from '../../components/ItemAction/helpAction/HelpAction';

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

const Notifications: FC<Props> = ({ title }) => {
  const [notificationsInfo, setNotificationsInfo] = useState<
    NotificationInfo[] | null
  >(null);
  const dispatch = useAppDispatch();
  const classes = useStyles();

  useEffect(() => {
    notificationRepository
      .getPendingTickets()
      .then(setNotificationsInfo)
      .catch((reason) => {
        logger.errorWithReason(
          'Failed retrieving notificationsInfo from firebase database',
          reason
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het ophalen van de notificaties is mislukt, ververs de pagina of probeer het later nog eens.`,
          })
        );
      });
  }, [dispatch]);

  return (
    <>
      <PageHeading title={title} help={DOCUMENTATION_NOTIFICATIONS} />
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.head} key="tableRow">
              <TableCell>Verzendtijd</TableCell>
              <TableCell>Notificatie</TableCell>
              <TableCell>
                Afleveringen&ensp;
                <HelpAction
                  documentationType={DOCUMENTATION_NOTIFICATIONS_DELIVERY}
                />
              </TableCell>
              <TableCell>
                Status&ensp;
                <HelpAction
                  documentationType={DOCUMENTATION_NOTIFICATIONS_STATUS}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notificationsInfo !== null && notificationsInfo.length === 0 && (
              <TableRow key="no-result">
                <TableCell component="th" scope="row" colSpan={4}>
                  Geen resultaten.
                </TableCell>
              </TableRow>
            )}
            {notificationsInfo !== null &&
              notificationsInfo.map((row) => (
                <TableRow key={row.creationDate.toString()}>
                  <NotificationsListItem notificationsInfo={row} />
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {notificationsInfo === null && <LoadingSpinner />}
    </>
  );
};

export default Notifications;
