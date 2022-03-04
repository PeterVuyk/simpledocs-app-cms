import * as functions from 'firebase-functions';
import {ExpoPushTicket} from 'expo-server-sdk';
import {MessageInfo} from '../notifications/model/MessageInfo';
import {TicketInfo} from '../notifications/model/TicketInfo';
import notificationRepository from '../notifications/notificationRepository';
import createPushMessage from '../notifications/createPushMessage';
import handleDeviceNotRegisteredErrors from '../notifications/handleDeviceNotRegisteredErrors';
import pushNotifications from '../notifications/pushNotifications';
import getExpoPushTokensInfo from '../notifications/getExpoPushTokensInfo';
import {NotificationContent} from '../notifications/model/NotificationContent';

/*
 * Documentation: https://www.npmjs.com/package/expo-server-sdk
 */
export const sendNotification = functions
    .runWith({minInstances: 0})
    .region(functions.config().api.firebase_region)
    .https.onCall(async (data, context) => {
      if (data.notificationContent?.body === undefined) {
        return {success: false, message: 'body is missing from message', result: null};
      }

      const id = notificationRepository.createDatabaseId();
      try {
        await notificationRepository.saveNotificationWithStatusDatabase('new', id, null, null);
      } catch (reason) {
        functions.logger.error('Tried to save initial notification to database but failed', reason);
        return {success: false, message: 'Tried to save initial notification to database but failed', result: null};
      }

      // We don't want to wait for the handle send notification because it can take quit some time to finish.
      // Instead we return immediately so that the process will run in the background.
      handleSendNotifications(id, data.notificationContent as NotificationContent);
      return {success: true, message: null, result: null};
    });


const handleSendNotifications = async (id: string, notificationContent: NotificationContent) => {
  let expoTokensInfo;
  try {
    expoTokensInfo = await getExpoPushTokensInfo();
  } catch (reason) {
    functions.logger
        .error('Failed retrieving expoPushTokens from user accounts, skipped sending notifications', reason);
    await notificationRepository.saveNotificationWithStatusDatabase('failure', id, null, null);
    return;
  }

  const messages = createPushMessage(expoTokensInfo, notificationContent);
  const tickets = await pushNotifications(messages);

  // It is possible that not all messages are sent. In that case we don't know which message was successful or not.
  // For now we skip the validation. Later we have to add missing functionality if needed.
  if (messages.length !== tickets.length) {
    // eslint-disable-next-line max-len
    functions.logger.error(`The number of messages ${messages.length} and tickets ${tickets.length} are not the same, for this reason could not validate if messages where send successful.`);
    await notificationRepository
        .saveNotificationWithStatusDatabase('unknownFromSend', id, messages.length - tickets.length, tickets.length);
    return;
  }

  let ticketsInfo = mergePushedTicketsWithTokenInfo(tickets, messages);
  ticketsInfo = await handleDeviceNotRegisteredErrors.fromTicketsInfo(ticketsInfo);

  const totalFailed = messages.length - ticketsInfo.length;
  const totalSend = messages.length;

  return notificationRepository.saveTicketsToDatabase(id, ticketsInfo, totalSend, totalFailed)
      .then(() => ({success: true, message: null, result: {totalSend, totalFailed}}))
      .catch((reason) => {
        functions.logger
            .error('The notification is send but failed to save the notification to the database.', reason);
        return {success: false, message: null, result: {totalSend, totalFailed}};
      });
};

/*
 * According to the documentation, the pushed tickets is in the same order in which the messages were sent, so we can
 * merge both to find out the result for each ticket.
 */
const mergePushedTicketsWithTokenInfo = (tickets: ExpoPushTicket[], messages: MessageInfo[]): TicketInfo[] => {
  const result: TicketInfo[] = [];
  for (let i = 0; i < tickets.length; i++) {
    result.push({ticket: tickets[i], message: messages[i]});
  }
  return result;
};
