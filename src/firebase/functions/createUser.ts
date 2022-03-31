import { functions } from '../firebaseConnection';
import { ApiResponse } from '../../model/ApiResponse';

async function createUser(email: string): Promise<void> {
  return functions
    .httpsCallable('cms-createUser')({ user: { email } })
    .then((value) => value.data as ApiResponse)
    .then((response) => {
      if (!response.success) {
        throw new Error(
          `Failed creating user, message server: ${response.message}`
        );
      }
    });
}

export default createUser;
