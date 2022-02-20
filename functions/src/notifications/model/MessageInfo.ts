import {ExpoPushMessage} from 'expo-server-sdk';

export interface MessageInfo {
    userUid: string;
    message: ExpoPushMessage,
}
