import * as functions from 'firebase-functions';
import deleteUserByUid from '../user/deleteUserByUid';

export const deleteUser = functions
    .region(functions.config().api.firebase_region)
    .https.onCall(async (data, context) => {
      // For now we distinguish app users (anonymous without email address) and cms users (with email address).
      // Later we could add something like a admin boolean inside a custom claim
      if (context.auth?.token.email === undefined) {
        return {success: false, message: 'unauthorized to call this function', result: null};
      }
      return deleteUserByUid(data.userId)
          .then(() => {
            return {success: true, message: null, result: null};
          })
          .catch((reason) => {
            functions.logger.error(`Failed deleting user with id ${data.userId}`, reason);
            return {success: false, message: 'Failed deleting user with the given id', result: null};
          });
    });
