import { User } from '../../model/User';
import { functions } from '../firebaseConnection';
import { ApiResponse } from '../../model/ApiResponse';

async function listAllUsers(): Promise<User[]> {
  const response = await functions
    .httpsCallable('cms-listAllUsers')()
    .then((value) => value.data as ApiResponse);
  if (!response.success) {
    throw new Error(
      `Failed collecting configurations from server, message server: ${response.message}`
    );
  }
  return response.result! as User[];
}

export default listAllUsers;
