import reduxTypes from './reduxTypes';
import { NotificationOptions } from '../../model/NotificationOptions';

export const setNotification = (notificationOptions: NotificationOptions) => ({
  type: reduxTypes.SET_NOTIFICATION,
  data: {
    notificationOpen: notificationOptions.notificationOpen,
    notificationType: notificationOptions.notificationType,
    notificationMessage: notificationOptions.notificationMessage,
  },
});

const notification = {
  setNotification,
};

export default notification;
