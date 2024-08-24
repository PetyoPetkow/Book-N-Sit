import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import Venue from '../../global/models/Venue';

const getVenueById = async (venueId: string): Promise<Venue | null> => {
  try {
    const venueRef = doc(collection(firestore, 'venues'), venueId);
    const venueSnap = await getDoc(venueRef);

    if (venueSnap.exists()) {
      return venueSnap.data() as Venue;
    } else {
      console.warn(`Venue with ID ${venueId} does not exist.`);
      return null;
    }
  } catch (error) {
    console.error(`Failed to get venue by ID ${venueId}:`, error);
    throw new Error(`Failed to fetch venue: ${error}`);
  }
};

export { getVenueById };
