import validatePushTokens from './validatePushTokens';
import removeAccountsFromDuplicateTokens from './removeAccountsFromDuplicateTokens';
import listAllUsers from '../user/listAllUsers';
import {ExpoTokenInfo} from './model/ExpoTokenInfo';

const getExpoPushTokensInfo = (): Promise<ExpoTokenInfo[]> => {
  return listAllUsers(undefined, []).then((value) => {
    const tokens = value.filter((userRecord) => userRecord.providerData.length === 0)
        .filter((userRecord) => userRecord.customClaims !== undefined)
        .filter((userRecord) => userRecord.customClaims?.hasOwnProperty('expoPushToken'))
        .filter((userRecord) => userRecord.customClaims?.expoPushToken !== null)
        .filter((userRecord) => !userRecord.customClaims?.hasOwnProperty('appNotificationsDisabled') ||
              userRecord.customClaims?.appNotificationsDisabled !== true)
        .map((userRecord) => {
          return {userUid: userRecord.uid, expoPushToken: userRecord.customClaims!.expoPushToken as string};
        });
    return removeAccountsFromDuplicateTokens(validatePushTokens(tokens));
  });
};

export default getExpoPushTokensInfo;
