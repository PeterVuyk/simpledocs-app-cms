import {TicketInfo} from './model/TicketInfo';
import {ExpoPushErrorTicket} from 'expo-server-sdk';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

/*
 * When users haven't logged in there app for a long time, sending notifications will be disabled by Google and Apple.
 * We get a 'DeviceNotRegistered' error when we send a pushNotification to Expo. Expo, Google and Apple say that there
 * policy is to stop sending notifications to the devices. We could remove the 'expoPushToken' from the user accounts.
 * But if we do that we lose them as a subscriber for the notifications, resulting that they only receive notifications
 * again when they manually toggle the notifications on in the app.
 *
 * As an alternative we add a property to customClaims called 'appNotificationsDisabled' with the value 'true'.
 * If the user startup the app again, we will remove this property so he can receive notifications again.
 *
 * TODO: does new registered devices get a new unique expo token? In that case we also need to update the token.
 */
const disableAppNotificationForUser = async (userUid: string): Promise<void> => {
  await admin.auth().getUser(userUid).then(async (userRecord) =>
    admin
        .auth()
        .setCustomUserClaims(userUid, {
          ...userRecord.customClaims,
          appNotificationsDisabled: true,
        })
        .catch((reason) =>
          functions.logger.error('Tried to update customerClaims for inactive user but failed', reason))
  );
};

const fromTicketsInfo = async (ticketsInfo: TicketInfo[]): Promise<TicketInfo[]> => {
  const successfulTickets = [];
  const failedTickets = [];
  for (const ticketInfo of ticketsInfo) {
    if (ticketInfo.ticket.status === 'ok') {
      successfulTickets.push(ticketInfo);
      continue;
    }
    if (ticketInfo.ticket.details?.error === 'DeviceNotRegistered') {
      await disableAppNotificationForUser(ticketInfo.message.userUid);
    }
    failedTickets.push(ticketInfo);
  }

  const reasons = failedTickets.map((value) => {
    const info = value.ticket as ExpoPushErrorTicket;
    return `[message: ${info.message}, details: ${JSON.stringify(info.details)}]`;
  });

  if (failedTickets.length !== 0) {
    functions.logger
        .info(`${failedTickets.length} notifications failed to send with the following reasons: ${reasons.join(',')}`);
  }
  return successfulTickets;
};

const handleDeviceNotRegisteredErrors = {
  fromTicketsInfo,
  disableAppNotificationForUser,
};

export default handleDeviceNotRegisteredErrors;
