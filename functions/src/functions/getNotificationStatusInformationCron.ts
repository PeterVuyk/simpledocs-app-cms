import * as functions from 'firebase-functions';
import {Expo, ExpoPushSuccessTicket} from 'expo-server-sdk';
import notificationRepository from '../notifications/notificationRepository';
import {DatabaseTicketInfo} from '../notifications/model/DatabaseTicketInfo';
import handleDeviceNotRegisteredErrors from '../notifications/handleDeviceNotRegisteredErrors';
import omit from '../util/omit';
import {NotificationStatusType} from '../notifications/model/NotificationStatusType';

/*
 * Documentation: https://www.npmjs.com/package/expo-server-sdk
 */
export const getNotificationStatusInformationCron = functions
    .region(functions.config().api.firebase_region)
    .pubsub.schedule('every 5 minutes')
    .onRun(async () => {
      // Later, after the Expo push notification service has delivered the
      // notifications to Apple or Google (usually quickly, but allow the the service
      // up to 30 minutes when under load), a "receipt" for each notification is
      // created. The receipts will be available for at least a day; stale receipts
      // are deleted.
      //
      // The ID of each receipt is sent back in the response "ticket" for each
      // notification. In summary, sending a notification produces a ticket, which
      // contains a receipt ID you later use to get the receipt.
      //
      // The receipts may contain error codes to which you must respond. In
      // particular, Apple or Google may block apps that continue to send
      // notifications to devices that have blocked notifications or have uninstalled
      // your app. Expo does not control this policy and sends back the feedback from
      // Apple and Google so you can handle it appropriately.
      const databaseTicketsInfo = await notificationRepository.getPendingTickets();
      if (databaseTicketsInfo.length === 0) {
        functions.logger.info('No new pending notification tickets found to be processed.');
        return;
      }
      return databaseTicketsInfo.forEach(handleNotificationStatusInformation);
    });

const handleNotificationStatusInformation = async (databaseTicketInfo: DatabaseTicketInfo) => {
  const expo = new Expo({accessToken: functions.config().api.expo_access_token});

  // NOTE: Not all tickets have IDs; for example, tickets for notifications
  // that could not be enqueued will have error information and no receipt ID.
  // We had them handled already when we send the notifications but this is an extra safeguard.
  const list = databaseTicketInfo.ticketsInfo
      .filter((value) => (value.ticket as ExpoPushSuccessTicket)?.id !== undefined);

  const receiptIdChunks = expo
      .chunkPushNotificationReceiptIds(list.map((value) => (value.ticket as ExpoPushSuccessTicket).id));
  functions.logger.info('Requesting status for Found receiptIdChunks', receiptIdChunks);
  let failures = 0;
  let finalStatus: NotificationStatusType = 'success';
  await (async () => {
    // Like sending notifications, there are different strategies you could use
    // to retrieve batches of receipts from the Expo service.
    for (const chunk of receiptIdChunks) {
      try {
        const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

        // The receipts specify whether Apple or Google successfully received the
        // notification and information about an error, if one occurred.
        // eslint-disable-next-line guard-for-in
        for (const receiptId in receipts) {
          const {status, details} = receipts[receiptId];
          if (status === 'ok') {
            continue;
          } else if (status === 'error') {
            failures++;

            // @ts-ignore
            if (details && details.error) {
              // @ts-ignore
              const errorType = details.error;
              if (errorType === 'DeviceNotRegistered') {
                const userUid = list.find((val) =>
                  (val.ticket as ExpoPushSuccessTicket).id === receiptId)?.message.userUid;
                if (userUid) {
                  await handleDeviceNotRegisteredErrors.disableAppNotificationForUser(userUid);
                }
                continue;
              }
              // The following error codes could also occur but we do not handle them:
              // MessageTooBig, MessageRateExceeded, MismatchSenderId, InvalidCredentials. All information is here:
              // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
              functions.logger.error(
                  `Could not deliver notification with error code ${errorType} to user`, JSON.stringify(details));
            }
          }
        }
      } catch (error) {
        functions.logger.error(
            `Tried to get the notification status for chunk information but failed, chunk length ${chunk.length}`,
            error
        );
        finalStatus = 'unknownFromStatus';
      }
    }

    databaseTicketInfo.totalFailed =
        databaseTicketInfo.totalFailed === null ? failures : databaseTicketInfo.totalFailed + failures;
    databaseTicketInfo.ticketsInfo = [];
    databaseTicketInfo.status = finalStatus;
    const id = databaseTicketInfo!.id!;
    notificationRepository
        .saveNotification(id, omit(databaseTicketInfo, ['id']) as DatabaseTicketInfo)
        .then(() => functions.logger.info('notifications updated successfully'))
        .catch((reason) => functions.logger.error(`Tried to update notification with id ${id} but failed`, reason));
  })();
};
