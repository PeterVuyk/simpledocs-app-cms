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
  // TODO: error handling is not correct here and probably other function calls. If above throws an exception it's not catched.
  if (!response.success) {
    throw new Error(
      `Send notification failed, message server: ${response.message}`
    );
  }
}

export default sendNotification;
