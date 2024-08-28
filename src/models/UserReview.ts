import { Timestamp } from 'firebase/firestore';

export default interface UserReview {
  displayName: string;
  photoURL?: string;
  venueId: string;
  rating: number;
  comment: string;
  timestamp: Timestamp;
}
