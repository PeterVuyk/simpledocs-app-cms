export const NOTIFICATION_STATUS_NEW = 'new';
export const NOTIFICATION_STATUS_FAILURE = 'failure';
export const NOTIFICATION_STATUS_PENDING = 'pending';
export const NOTIFICATION_STATUS_SUCCESS = 'success';
export const NOTIFICATION_STATUS_UNKNOWN_SEND = 'unknownFromSend';
export const NOTIFICATION_STATUS_UNKNOWN_STATUS = 'unknownFromStatus';

export type NotificationStatusType =
  | 'new'
  | 'failure'
  | 'pending'
  | 'success'
  | 'unknownFromSend'
  | 'unknownFromStatus';
