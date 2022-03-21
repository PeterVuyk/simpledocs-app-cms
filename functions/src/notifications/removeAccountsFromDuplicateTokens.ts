import {ExpoTokenInfo} from './model/ExpoTokenInfo';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import deleteUserByUid from '../user/deleteUserByUid';

/*
 * Every time a user installs the app, a new user is created. The ExpoToken is saved in the users userClaim.
 * For IOS but possibly also for Android if the user removes the app and install the app again, we have 2 times
 * the token on 2 different accounts. The solution is to remove the oldest account because that account is
 * not used anymore, then return the 'unique tokens'.
 */
const removeAccountsFromDuplicateTokens = async (tokens: ExpoTokenInfo[]): Promise<ExpoTokenInfo[]> => {
  // 1: get all tokens that are duplicate
  const pushTokens = tokens.map((value) => value.expoPushToken);
  const duplicate = tokens.filter((token) => getTotalOccurrence(pushTokens, token.expoPushToken) > 1);
  const duplicateTokens = new Set(duplicate.map((value) => value.expoPushToken));

  // 2: Get all accounts that has duplicate tokens (by uuid).
  const users = await Promise.all(duplicate.map((value) => admin.auth().getUser(value.userUid)));

  const removedUsers: string[] = [];
  // 3: Get the accounts that need to be removed
  for (const duplicateToken of duplicateTokens) {
    const userRecords = users.filter((value) => value.customClaims?.expoPushToken === duplicateToken)
        .sort((a, b) => Date.parse(b.metadata.creationTime) - Date.parse(a.metadata.creationTime));
    if (userRecords.length < 2) {
      continue;
    }

    // 4: remove the oldest accounts by skipping the first account that the user is currently using.
    userRecords.slice(1).forEach((value) => {
      removedUsers.push(value.uid);
      // 5: Remove the duplicate tokens for these users
      deleteUserByUid(value.uid)
          .catch((reason) => functions.logger.error(`Failed to delete user with uid ${value.uid}`, reason));
    });
  }

  functions.logger.info(`In total ${removedUsers.length}
   accounts found with duplicate expoPushTokens. if not 0 then the old duplicate accounts are successfully removed`);

  // 6: return the tokens with only the unique values.
  return tokens.filter((value) => !removedUsers.includes(value.userUid));
};

const getTotalOccurrence = (array: string[], value: string) => {
  let count = 0;
  array.forEach((v) => (v === value && count++));
  return count;
};

export default removeAccountsFromDuplicateTokens;
