/*
 * Documentation about sending notifications: https://docs.expo.io/push-notifications/sending-notifications/
 */
import {ExpoTokenInfo} from './model/ExpoTokenInfo';
import {MessageInfo} from './model/MessageInfo';
import {NotificationContent} from './model/NotificationContent';

const createPushMessage = (expoTokensInfo: ExpoTokenInfo[], notificationBody: NotificationContent): MessageInfo[] => {
  return expoTokensInfo.map((info) => ({userUid: info.userUid, message: {
    to: info.expoPushToken,
    sound: 'default',
    title: notificationBody.title,
    body: notificationBody.body,
    data: {withSome: 'data'}, // max 4KiB!
  }}));
};

export default createPushMessage;

