import React, { FC, useCallback, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PageHeading from '../../layout/PageHeading';
import {
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
import NotificationsButtonGroup from './NotificationsButtonGroup';

interface Props {
  title: string;
}

const Notifications: FC<Props> = ({ title }) => {
  const [notificationsInfo, setNotificationsInfo] = useState<
    NotificationInfo[] | null
  >(null);
  const dispatch = useAppDispatch();

  const handleReload = useCallback(async () => {
    setNotificationsInfo(null);
    return notificationRepository
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
            notificationMessage: `Het ophalen van de notificaties is mislukt, ververs de pagina of probeer het later opnieuw.`,
          })
        );
      });
  }, [dispatch]);

  useEffect(() => {
    handleReload();
  }, [dispatch, handleReload]);

  return (
    <>
      <PageHeading title={title} help={DOCUMENTATION_NOTIFICATIONS}>
        <NotificationsButtonGroup onReload={handleReload} />
      </PageHeading>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#ddd' }} key="tableRow">
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
