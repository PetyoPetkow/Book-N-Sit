import { Timestamp } from 'firebase/firestore';

export default interface Review {
  displayName: string;
  venueId: string;
  rating: number;
  comment: string;
  timestamp: Timestamp;
}
