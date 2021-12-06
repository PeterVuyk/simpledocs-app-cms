import * as functions from 'firebase-functions';
import {admin} from './firebase';

// TODO 2: Authentication check isAnonymous
export const listAllUsers = functions
    .region(functions.config().api.firebase_region)
    .https.onCall(async (data, context) => await getUsers());

const getUsers = () => {
  return admin.auth().listUsers().then(async (listUsersResult) => {
    const users = listUsersResult.users.filter((value) => value.email !== undefined).map((userRecord) => {
      return {email: userRecord.email, disabled: userRecord.disabled};
    });
    return {success: true, message: null, result: users};
  })
      .catch((error) => {
        functions.logger.info('Error listing users:', error);
        return {success: false, message: 'Error listing users', result: null};
      });
};
