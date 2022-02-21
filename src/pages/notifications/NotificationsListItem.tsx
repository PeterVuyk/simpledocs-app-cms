import React, { FC } from 'react';
import TableCell from '@material-ui/core/TableCell';
import { NotificationInfo } from '../../model/Notification/NotificationInfo';
import dateTimeHelper from '../../helper/dateTimeHelper';
import {
  NOTIFICATION_STATUS_FAILURE,
  NOTIFICATION_STATUS_NEW,
  NOTIFICATION_STATUS_PENDING,
  NOTIFICATION_STATUS_SUCCESS,
  NOTIFICATION_STATUS_UNKNOWN_SEND,
  NOTIFICATION_STATUS_UNKNOWN_STATUS,
  NotificationStatusType,
} from './NotificationStatusType';

interface Props {
  notificationsInfo: NotificationInfo;
}

const NotificationsListItem: FC<Props> = ({ notificationsInfo }) => {
  const getTextFromStatus = (status: NotificationStatusType) => {
    switch (status) {
      case NOTIFICATION_STATUS_FAILURE:
        return 'Aflevering mislukt';
      case NOTIFICATION_STATUS_NEW:
        return 'Nieuw bericht';
      case NOTIFICATION_STATUS_PENDING:
        return 'In afwachting';
      case NOTIFICATION_STATUS_SUCCESS:
        return 'Succesvolle aflevering';
      case NOTIFICATION_STATUS_UNKNOWN_SEND:
        return 'Fout bij verzending';
      case NOTIFICATION_STATUS_UNKNOWN_STATUS:
        return 'Fout bij ophalen verzendstatus';
      default:
        return 'Onbekend';
    }
  };

  const getDeliveryInfo = (notificationInfo: NotificationInfo) => {
    if (
      [
        NOTIFICATION_STATUS_FAILURE,
        NOTIFICATION_STATUS_NEW,
        NOTIFICATION_STATUS_UNKNOWN_SEND,
      ].includes(notificationInfo.status)
    ) {
      return <span>-</span>;
    }

    let warning = false;
    if (notificationInfo.status === NOTIFICATION_STATUS_UNKNOWN_STATUS) {
      warning = true;
    }

    return (
      <span style={{ color: warning ? '#ff0000' : '#000', opacity: 0.87 }}>
        <span>Totaal: {notificationInfo.totalSend ?? 0}</span>
        <br />
        <span>
          Afgeleverd:{' '}
          {(notificationInfo.totalSend ?? 0) -
            (notificationInfo.totalFailed ?? 0)}
        </span>
        <br />
        <span>Geweigerd: {notificationInfo.totalFailed ?? 0}</span>
      </span>
    );
  };

  return (
    <>
      <TableCell>
        {dateTimeHelper.dateTimeString(notificationsInfo.creationDate)}
      </TableCell>
      <TableCell>two</TableCell>
      <TableCell>{getDeliveryInfo(notificationsInfo)}</TableCell>
      <TableCell>{getTextFromStatus(notificationsInfo.status)}</TableCell>
    </>
  );
};

export default NotificationsListItem;
