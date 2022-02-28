import {db} from '../firebase';
import {NotificationStatusType} from './model/NotificationStatusType';
import {DatabaseTicketInfo} from './model/DatabaseTicketInfo';
import omit from '../util/omit';
import {TicketInfo} from './model/TicketInfo';
import replaceUndefinedWithNull from '../util/replaceUndefinedWithNull';

const createDatabaseId = (): string => db.collection('notifications').doc().id;

const saveNotification = (id: string, databaseTicketInfo: DatabaseTicketInfo) => {
  return db.collection('notifications').doc(id).set(databaseTicketInfo);
};

const saveNotificationWithStatusDatabase = (
    status: NotificationStatusType,
    id: string,
    totalFailed: null | number,
    totalSend: null | number
) => {
  const ticket = {
    status: status,
    creationDate: new Date(),
    totalFailed,
    totalSend,
    message: null,
    ticketsInfo: [],
  } as DatabaseTicketInfo;
  return db.collection('notifications').doc(id).set(ticket);
};

// in the future we should consider saving it differently? We expect that there is always at least 1 ticket receiver.
const saveTicketsToDatabase = async (id: string, ticketsInfo: TicketInfo[], totalSend: number, totalFailed: number) => {
  // We need to replace 'undefined' with null. Otherwise Firebase will thrown an exception.
  const tickets = replaceUndefinedWithNull(ticketsInfo) as TicketInfo[];

  const ticket = {
    status: 'pending',
    creationDate: new Date(),
    totalFailed,
    totalSend,
    message: omit(tickets[0].message.message, ['to']),
    ticketsInfo: tickets,
  } as DatabaseTicketInfo;
  return db.collection('notifications').doc(id).set(ticket);
};

const getPendingTickets = async (): Promise<DatabaseTicketInfo[]> => {
  const MS_PER_MINUTE = 60000;
  const pendingTime = new Date(Date.now() - 30 * MS_PER_MINUTE);

  const querySnapshot = await db.collection('notifications')
      .where('status', '==', 'pending')
      .where('creationDate', '<', pendingTime)
      .get();
  return querySnapshot.docs.map((doc) => {
    return {id: doc.id, ...doc.data()} as DatabaseTicketInfo;
  });
};

const notificationRepository = {
  createDatabaseId,
  saveNotificationWithStatusDatabase,
  saveTicketsToDatabase,
  saveNotification,
  getPendingTickets,
};

export default notificationRepository;
