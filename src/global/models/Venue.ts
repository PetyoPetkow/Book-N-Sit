import Address from './Address';
import WorkingHours from './WorkingHours';

export default interface Venue {
  name: string;
  address: Address;
  coordinates: [number, number];
  images: File[] | string[];
  description: string;
  perks: string[];
  venueTypes: string[];
  workingHours: WorkingHours;
  userId: string;
  id?: string;
}
