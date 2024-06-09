import Address from './Address';
import ReviewDto from './ReviewDto';
import WorkingHours from './WorkingHours';

export default interface Venue {
  name: string;
  address: Address;
  coordinates: [number, number];
  images: File[] | string[];
  description: string;
  workingHours: WorkingHours;
  reviews: ReviewDto[];
  userId: string;
}
