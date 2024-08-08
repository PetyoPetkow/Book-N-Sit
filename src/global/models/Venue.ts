import Address from './Address';
import WorkingHours from './WorkingHours';

export default interface Venue {
  name: string;
  city: string;
  coordinates: [number, number];
  images: FileList | string[];
  description: string;
  perks: string[];
  venueTypes: VenueType[];
  workingHours: WorkingHours;
  userId: string;
  id?: string;
}

export type VenueType =
  | 'Bar'
  | 'Restaurant'
  | 'Club'
  | 'Cafe'
  | 'Theater'
  | 'Concert Hall'
  | 'Gallery'
  | 'Lounge'
  | 'Sports Arena'
  | 'Conference Center';
