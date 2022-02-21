import { NotificationStatusType } from '../../pages/notifications/NotificationStatusType';
import { NotificationMessage } from './NotificationMessage';

export interface NotificationInfo {
  id?: string;
  status: NotificationStatusType;
  creationDate: Date;
  totalFailed: null | number;
  totalSend: null | number;
  message: NotificationMessage | null;
}
