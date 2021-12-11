import { functions } from '../firebaseConnection';
import { ApiResponse } from '../../model/ApiResponse';

async function createUser(email: string): Promise<void> {
  const response = await functions
    .httpsCallable('cms-createUser')({ user: { email } })
    .then((value) => value.data as ApiResponse);
  if (!response.success) {
    throw new Error(
      `Failed creating user, message server: ${response.message}`
    );
  }
}

export default createUser;
