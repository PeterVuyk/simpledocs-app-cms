import { UserInfo } from '../../model/users/UserInfo';
import { functions } from '../firebaseConnection';
import { ApiResponse } from '../../model/ApiResponse';

async function getUserByEmail(email: string): Promise<UserInfo | null> {
  const response = await functions
    .httpsCallable('cms-getUserByEmail')({ email })
    .then((value) => value.data as ApiResponse);
  if (!response.success) {
    throw new Error(
      `Failed collecting getUserByEmail from server, message server: ${response.message}`
    );
  }
  return response.result;
}

export default getUserByEmail;
