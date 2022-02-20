import {ExpoTokenInfo} from './model/ExpoTokenInfo';
import validatePushTokens from './validatePushTokens';
import {admin} from '../firebase';

/*
 * We loop through all the users and get the expoPushNotifications.
 * We list 1000 at a time and call after the same function because
 * this is maximum number of users allowed to be listed at a time.
 * Any value greater than the maximum will throw an argument error.
 */
const getExpoPushTokensInfo = (nextPageToken: string | undefined, list: ExpoTokenInfo[]) => {
  return admin.auth()
      .listUsers(1000, nextPageToken)
      .then(async (listUsersResult) => {
        list.push(...listUsersResult.users
        // we only need anonymous users, and they don't have providerData
            .filter((userRecord) => userRecord.providerData.length === 0)
            .filter((userRecord) => userRecord.customClaims !== undefined)
            .filter((userRecord) => userRecord.customClaims?.hasOwnProperty('expoPushToken'))
            .filter((userRecord) => userRecord.customClaims?.expoPushToken !== null)
            .filter((userRecord) => !userRecord.customClaims?.hasOwnProperty('appNotificationsDisabled') ||
                    userRecord.customClaims?.appNotificationsDisabled !== true)
            .map((userRecord) => {
              return {userUid: userRecord.uid, expoPushToken: userRecord.customClaims!.expoPushToken as string};
            })
        );

        if (listUsersResult.pageToken) {
          await getExpoPushTokensInfo(listUsersResult.pageToken, list);
        }
        return validatePushTokens(list);
      });
};

export default getExpoPushTokensInfo;
