import Address from './Address';
import WorkingHours from './WorkingHours';

export default interface Venue {
  name: string;
  city: string;
  street: string;
  coordinates: [number, number];
  images: FileList | string[];
  description: string;
  perks: PerksMap;
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

export type Perk = 'No smoking' | 'Cocktail' | 'Sushi menu' | 'Wine list' | 'Personalized events';
export type PerksMap = Record<Perk, boolean>;
