import { functions } from '../firebaseConnection';
import { ApiResponse } from '../../model/ApiResponse';
import { NotificationContent } from '../../model/Notification/NotificationContent';

async function sendNotification(
  notificationContent: NotificationContent
): Promise<void> {
  return functions
    .httpsCallable('cms-sendNotification')({
      notificationContent,
    })
    .then((value) => value.data as ApiResponse)
    .then((response) => {
      if (!response.success) {
        throw new Error(
          `Send notification failed, message server: ${response.message}`
        );
      }
    });
}

export default sendNotification;
