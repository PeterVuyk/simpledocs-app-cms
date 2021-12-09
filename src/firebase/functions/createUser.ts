import { functions } from '../firebaseConnection';
import { ApiResponse } from '../../model/ApiResponse';
import { User } from '../../model/users/User';

async function createUser(user: User): Promise<void> {
  const response = await functions
    .httpsCallable('cms-createUser')({ user })
    .then((value) => value.data as ApiResponse);
  if (!response.success) {
    throw new Error(
      `Failed creating user, message server: ${response.message}`
    );
  }
}

export default createUser;
