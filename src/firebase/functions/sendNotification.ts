import { functions } from '../firebaseConnection';
import { ApiResponse } from '../../model/ApiResponse';
import { NotificationContent } from '../../model/Notification/NotificationContent';

async function sendNotification(
  notificationContent: NotificationContent
): Promise<void> {
  const response = await functions
    .httpsCallable('cms-sendNotification')({
      notificationContent,
    })
    .then((value) => value.data as ApiResponse);
  if (!response.success) {
    throw new Error(
      `Send notification failed, message server: ${response.message}`
    );
  }
}

export default sendNotification;
