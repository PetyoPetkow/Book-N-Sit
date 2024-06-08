import Address from './Address';
import Review from './Review';
import WorkingHours from './WorkingHours';

export default interface Venue {
  name: string;
  address: Address;
  coordinates: [number, number];
  images: File[] | string[];
  description: string;
  workingHours: WorkingHours;
  reviews: Review[];
  userId: string;
}
