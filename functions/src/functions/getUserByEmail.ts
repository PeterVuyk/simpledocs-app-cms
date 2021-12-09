import * as functions from 'firebase-functions';
import {admin} from '../firebase';

export const getUserByEmail = functions
    .region(functions.config().api.firebase_region)
    .https.onCall(async (data, context) => {
      // For now we distinguish app users (anonymous without email address) and cms users (with email address).
      // Later we could add something like a admin boolean inside a custom claim
      if (context.auth?.token.email === undefined) {
        return {success: false, message: 'unauthorized to call this function', result: null};
      }
      return admin.auth()
          .getUserByEmail(data.email)
          .then((userRecord) => {
            const user = {
              userId: userRecord.uid,
              email: userRecord.email,
              disabled: userRecord.disabled,
              lastSignInTime: userRecord.metadata.lastSignInTime,
            };
            return {success: true, message: null, result: user};
          })
          .catch(() => {
            return {success: true, message: null, result: null};
          });
    });
