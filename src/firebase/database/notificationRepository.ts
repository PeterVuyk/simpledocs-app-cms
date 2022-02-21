import { database } from '../firebaseConnection';
import { NotificationInfo } from '../../model/Notification/NotificationInfo';

const getPendingTickets = async (): Promise<NotificationInfo[]> => {
  const MS_YEAR = 60000 * 60 * 24 * 365;
  const querySnapshot = await database
    .collection('notifications')
    .where('creationDate', '>', new Date(Date.now() - MS_YEAR))
    .orderBy('creationDate', 'desc')
    .get();
  return querySnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
      creationDate: doc.data().creationDate.toDate(),
    } as NotificationInfo;
  });
};

const notificationRepository = {
  getPendingTickets,
};

export default notificationRepository;
