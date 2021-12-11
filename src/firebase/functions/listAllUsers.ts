import { UserInfo } from '../../model/users/UserInfo';
import { functions } from '../firebaseConnection';
import { ApiResponse } from '../../model/ApiResponse';

async function listAllUsers(): Promise<UserInfo[]> {
  const response = await functions
    .httpsCallable('cms-listAllUsers')()
    .then((value) => value.data as ApiResponse);
  if (!response.success) {
    throw new Error(
      `Failed collecting listAllUsers from server, message server: ${response.message}`
    );
  }
  return response.result! as UserInfo[];
}

export default listAllUsers;