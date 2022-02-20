/*
 * Documentation about sending notifications: https://docs.expo.io/push-notifications/sending-notifications/
 */
import {ExpoTokenInfo} from './model/ExpoTokenInfo';
import {MessageInfo} from './model/MessageInfo';

const createPushMessage = (expoTokensInfo: ExpoTokenInfo[]): MessageInfo[] => {
  return expoTokensInfo.map((info) => ({userUid: info.userUid, message: {
    to: info.expoPushToken,
    sound: 'default',
    body: 'This is a test notification',
    data: {withSome: 'data'},
  }}));
};

export default createPushMessage;

