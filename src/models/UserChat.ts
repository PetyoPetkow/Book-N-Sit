import { Timestamp } from 'firebase/firestore';

export default interface UserChat {
  chatId: string;
  userId: string;
  lastSenderId: string;
  lastMessage: string;
  date: Timestamp;
}
