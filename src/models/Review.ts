import { Timestamp } from 'firebase/firestore';

export default interface Review {
  userId: string;
  venueId: string;
  rating: number;
  comment: string;
  timestamp: Timestamp;
}
