import { Color } from '@material-ui/lab';
import reduxTypes from './reduxTypes';

export interface NotificationOptions {
  notificationOpen: boolean;
  notificationType: Color;
  notificationMessage: string;
}

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
