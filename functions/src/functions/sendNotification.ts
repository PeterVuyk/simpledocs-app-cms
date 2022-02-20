import * as functions from 'firebase-functions';
import {ExpoPushTicket} from 'expo-server-sdk';
import {MessageInfo} from '../notifications/model/MessageInfo';
import {TicketInfo} from '../notifications/model/TicketInfo';
import notificationsRepository from '../notifications/notificationsRepository';
import createPushMessage from '../notifications/createPushMessage';
import handleDeviceNotRegisteredErrors from '../notifications/handleDeviceNotRegisteredErrors';
import pushNotifications from '../notifications/pushNotifications';
import getExpoPushTokensInfo from '../notifications/getExpoPushTokensInfo';

/*
 * Documentation: https://www.npmjs.com/package/expo-server-sdk
 */
export const sendNotification = functions
    .runWith({minInstances: 0})
    .region(functions.config().api.firebase_region)
    .https.onCall(async (data, context) => {
      const id = notificationsRepository.createDatabaseId();
      try {
        await notificationsRepository.saveNotificationWithStatusDatabase('new', id, null, null);
      } catch (reason) {
        functions.logger.error('Tried to save initial notification to database but failed', reason);
        return {success: false, message: 'Tried to save initial notification to database but failed', result: null};
      }

      // We don't want to wait for the handle send notification because it can take quit some time to finish.
      // Instead we return immediately so that the process will run in the background.
      handleSendNotifications(id);
      return {success: true, message: null, result: null};
    });


const handleSendNotifications = async (id: string) => {
  let expoTokensInfo;
  try {
    expoTokensInfo = await getExpoPushTokensInfo(undefined, []);
  } catch (reason) {
    functions.logger
        .error('Failed retrieving expoPushTokens from user accounts, skipped sending notifications', reason);
    await notificationsRepository.saveNotificationWithStatusDatabase('failure', id, null, null);
    return;
  }

  const messages = createPushMessage(expoTokensInfo);
  const tickets = await pushNotifications(messages);

  // It is possible that not all messages are sent. In that case we don't know which message was successful or not.
  // For now we skip the validation. Later we have to add missing functionality if needed.
  if (messages.length !== tickets.length) {
    // eslint-disable-next-line max-len
    functions.logger.error(`The number of messages ${messages.length} and tickets ${tickets.length} are not the same, for this reason could not validate if messages where send successful.`);
    await notificationsRepository
        .saveNotificationWithStatusDatabase('unknown', id, messages.length - tickets.length, tickets.length);
    return;
  }

  let ticketsInfo = mergePushedTicketsWithTokenInfo(tickets, messages);
  ticketsInfo = await handleDeviceNotRegisteredErrors(ticketsInfo);

  const totalFailed = messages.length - ticketsInfo.length;
  const totalSend = messages.length;

  return notificationsRepository.saveTicketsToDatabase(id, ticketsInfo, totalSend, totalFailed)
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
