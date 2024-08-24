import { Timestamp } from 'firebase/firestore';

export default interface Message {
  id: string;
  text: string;
  senderId: string;
  date: Timestamp;
}
