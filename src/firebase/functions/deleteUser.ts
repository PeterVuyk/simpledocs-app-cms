import { functions } from '../firebaseConnection';
import { ApiResponse } from '../../model/ApiResponse';
import { UserInfo } from '../../model/users/UserInfo';

async function deleteUser(userInfo: UserInfo): Promise<void> {
  const response = await functions
    .httpsCallable('cms-deleteUser')({ userId: userInfo.userId })
    .then((value) => value.data as ApiResponse);
  if (!response.success) {
    throw new Error(
      `Failed deleting user, message server: ${response.message}`
    );
  }
}

export default deleteUser;
