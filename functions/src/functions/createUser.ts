import * as functions from 'firebase-functions';
import {admin} from '../firebase';

export const createUser = functions
    .region(functions.config().api.firebase_region)
    .https.onCall(async (data, context) => {
      // For now we distinguish app users (anonymous without email address) and cms users (with email address).
      // Later we could add something like a admin boolean inside a custom claim
      if (context.auth?.token.email === undefined) {
        return {success: false, message: 'unauthorized to call this function', result: null};
      }
      return admin
          .auth()
          .createUser({
            email: data.user.email,
            emailVerified: false,
            disabled: false,
          })
          .then(() => {
            return {success: true, message: null, result: null};
          })
          .catch((reason) => {
            functions.logger.info('Failed creating a user, does the user already exist?', reason);
            return {success: false, message: 'Failed creating a user, does the user already exist?', result: null};
          });
    });
