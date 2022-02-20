import { functions } from '../firebaseConnection';
import { ApiResponse } from '../../model/ApiResponse';

async function getNotificationStatusInformation(): Promise<void> {
  const response = await functions
    .httpsCallable('cms-getNotificationStatusInformation')({ foo: 'bar' })
    .then((value) => value.data as ApiResponse);
  // TODO: Do something with response
  if (!response.success) {
    throw new Error(
      `Send notification failed, message server: ${response.message}`
    );
  }
}

export default getNotificationStatusInformation;
