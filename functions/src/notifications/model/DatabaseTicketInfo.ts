import {NotificationStatusType} from './NotificationStatusType';
import {ExpoPushMessage} from 'expo-server-sdk';
import {TicketInfo} from './TicketInfo';

export interface DatabaseTicketInfo {
    id?: string;
    status: NotificationStatusType;
    creationDate: Date;
    notificationDate: null | Date;
    totalFailed: null | number;
    totalSend: null | number;
    message: ExpoPushMessage | null;
    ticketsInfo: TicketInfo[];
}
