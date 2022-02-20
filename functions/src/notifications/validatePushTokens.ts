import Expo from 'expo-server-sdk';
import * as functions from 'firebase-functions';
import {ExpoTokenInfo} from './model/ExpoTokenInfo';

/*
 * Check that all your push tokens appear to be valid Expo push tokens
 */
const validatePushTokens = (expoTokensInfo: ExpoTokenInfo[]): ExpoTokenInfo[] => {
  const result = [];
  for (const pushToken of expoTokensInfo) {
    if (!Expo.isExpoPushToken(pushToken.expoPushToken)) {
      // This error should never occur, but if it did happen then we should think about removing them from customClaims.
      // eslint-disable-next-line max-len
      functions.logger.error(`Push token ${pushToken.expoPushToken} for user uid ${pushToken.userUid} is not a valid Expo push token`);
      continue;
    }
    result.push(pushToken);
  }
  return result;
};

export default validatePushTokens;
