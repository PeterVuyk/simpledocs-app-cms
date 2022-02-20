import {ExpoPushTicket} from 'expo-server-sdk';
import {MessageInfo} from './MessageInfo';

export interface TicketInfo {
    ticket: ExpoPushTicket;
    message: MessageInfo;
}
