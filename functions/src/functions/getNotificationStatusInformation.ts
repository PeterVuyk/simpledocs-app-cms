import * as functions from 'firebase-functions';
import {Expo} from 'expo-server-sdk';

/*
 * Documentation: https://www.npmjs.com/package/expo-server-sdk
 */
export const getNotificationStatusInformation = functions
    .runWith({minInstances: 0})
    .region(functions.config().api.firebase_region)
    .https.onCall(async (data, context) => {
      // Create a new Expo SDK client
      // optionally providing an access token if you have enabled push security
      const expo = new Expo({accessToken: functions.config().api.expo_access_token});

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

      const tickets = [{
        id: '8c52f710-383a-49f9-a00c-11254fd4d585',
        status: 'error',
        message: 'The recipient device is not registered with FCM.',
        details: {error: 'DeviceNotRegistered', fault: 'developer'},
      }];

      const receiptIds = [];
      for (const ticket of tickets) {
        // NOTE: Not all tickets have IDs; for example, tickets for notifications
        // that could not be enqueued will have error information and no receipt ID.
        if (ticket.id) {
          receiptIds.push(ticket.id);
        }
      }

      const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
      functions.logger.info('receiptIdChunks', receiptIdChunks);
      await (async () => {
        // Like sending notifications, there are different strategies you could use
        // to retrieve batches of receipts from the Expo service.
        for (const chunk of receiptIdChunks) {
          try {
            const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
            functions.logger.info('receipts', receipts);

            // The receipts specify whether Apple or Google successfully received the
            // notification and information about an error, if one occurred.
            for (const receiptId in receipts) {
              const {status, message, details} = receipts[receiptId];
              if (status === 'ok') {
                continue;
              } else if (status === 'error') {
                console.error(
                    `There was an error sending a notification: ${message}`
                );
                if (details && details.error) {
                  // The error codes are listed in the Expo documentation:
                  // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
                  // You must handle the errors appropriately.
                  console.error(`The error code is ${details.error}`);
                }
              }
            }
          } catch (error) {
            console.error(error);
          }
        }
      })();

      return {success: true, message: null, result: 'getResponse'};
    });
