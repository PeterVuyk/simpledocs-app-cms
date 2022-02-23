import {ExpoTokenInfo} from './model/ExpoTokenInfo';
import {MessageInfo} from './model/MessageInfo';
import {NotificationContent} from './model/NotificationContent';

/*
 * Documentation about sending notifications: https://docs.expo.io/push-notifications/sending-notifications/
 */
const createPushMessage = (expoTokensInfo: ExpoTokenInfo[], notificationBody: NotificationContent): MessageInfo[] => {
  return expoTokensInfo.map((info) => ({userUid: info.userUid, message: {
    to: info.expoPushToken,
    sound: 'default',
    title: notificationBody.title,
    body: notificationBody.body,
    data: notificationBody.data,
  }}));
};

export default createPushMessage;

