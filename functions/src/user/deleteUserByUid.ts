import {admin} from '../firebase';

const deleteUserByUid = (uid: string): Promise<void> => {
  return admin.auth().deleteUser(uid);
};

export default deleteUserByUid;
