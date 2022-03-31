import { functions } from '../firebaseConnection';
import { ApiResponse } from '../../model/ApiResponse';

// For now only used for password, properties can be extended later if needed.
async function updateUser(password: string): Promise<void> {
  return functions
    .httpsCallable('cms-updateUser')({ user: { password } })
    .then((value) => value.data as ApiResponse)
    .then((response) => {
      if (!response.success) {
        throw new Error(
          `Failed updating user, message server: ${response.message}`
        );
      }
    });
}

export default updateUser;
