import { functions } from '../firebaseConnection';
import { ApiResponse } from '../../model/ApiResponse';

async function sendNotification(): Promise<void> {
  const response = await functions
    .httpsCallable('cms-sendNotification')({ foo: 'bar' })
    .then((value) => value.data as ApiResponse);
  if (!response.success) {
    throw new Error(
      `Send notification failed, message server: ${response.message}`
    );
  }
}

export default sendNotification;
