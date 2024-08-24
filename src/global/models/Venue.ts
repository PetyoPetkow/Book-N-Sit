import WorkingHours from './WorkingHours';

export default interface Venue {
  name: string;
  city: string;
  street: string | null;
  coordinates: [number, number];
  images: string[];
  description: string;
  perks: PerksMap;
  venueTypes: VenueType[];
  workingHours: WorkingHours;
  userId: string;
  id: string;
}

export interface VenueUpdate {
  name: string;
  city: string;
  street: string | null;
  coordinates: [number, number];
  images: FileList;
  description: string;
  perks: PerksMap;
  venueTypes: VenueType[];
  workingHours: WorkingHours;
  userId: string;
  id: string;
}

export type VenueType =
  | 'restaurant'
  | 'cafe'
  | 'bar'
  | 'pub'
  | 'bakery'
  | 'winery'
  | 'brewery'
  | 'night_club';

export type Perk = 'free_wifi' | 'cocktails' | 'sushi_menu' | 'wine_list' | 'personalized_events';
export type PerksMap = Record<Perk, boolean>;
