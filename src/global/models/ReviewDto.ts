import { Timestamp } from 'firebase/firestore';

export default interface ReviewDto {
  userId: string;
  venueId: string;
  rating: number;
  comment: string;
  timestamp: Timestamp;
}
