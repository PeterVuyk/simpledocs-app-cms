import {MessageInfo} from './model/MessageInfo';
import Expo, {ExpoPushTicket} from 'expo-server-sdk';
import * as functions from 'firebase-functions';

/*
 * The Expo push notification service accepts batches of notifications so
 * that you don't need to send 1000 requests to send 1000 notifications. We
 * batch the notifications to reduce the number of requests.
 *
 * For extra security we make use of a so called 'accessToken', this token
 * is required to send notifications. They are managed in expo, link:
 * https://expo.dev/accounts/petervuyk/settings/access-tokens
 */
const pushNotifications = async (messages: MessageInfo[]): Promise<ExpoPushTicket[]> => {
  const expo = new Expo({accessToken: functions.config().api.expo_access_token});

  const chunks = expo.chunkPushNotifications(messages.map((value) => value.message));
  const tickets: ExpoPushTicket[] = [];
  await (async () => {
    // Send the chunks to the Expo push notification service to spread the load over time.
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        await new Promise((r) => setTimeout(r, 2000));
        // eslint-disable-next-line max-len
        // If this occurs, then check the log with the error and if needed look for a solution: https://docs.expo.dev/push-notifications/sending-notifications/#retry-on-failure
        // eslint-disable-next-line max-len
        functions.logger.error('An unexpected issue has occurred while sending push notifications to expo. The consequence is that not all users will receive a notification.', error);
      }
    }
  })();
  return tickets;
};

export default pushNotifications;
