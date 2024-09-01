import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { firestore, storage } from '../firebase';
import Venue, { VenueCreate } from '../../models/Venue';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const getVenueById = async (venueId: string): Promise<Venue | null> => {
  try {
    const venueRef = doc(collection(firestore, 'venues'), venueId);
    const venueSnap = await getDoc(venueRef);

    return venueSnap.exists() ? (venueSnap.data() as Venue) : null;
  } catch (error) {
    console.error(`Failed to get venue by ID ${venueId}:`, error);
    throw new Error(`Failed to fetch venue: ${error}`);
  }
};

const createVenue = async (venue: VenueCreate, imageFiles: File[]): Promise<string> => {
  const venueRef = await addDoc(collection(firestore, 'venues'), venue);
  const imageUrls = await uploadImagesToStorage(imageFiles, venueRef.id);
  await updateDoc(doc(firestore, 'venues', venueRef.id), { images: imageUrls });

  return venueRef.id;
};

const updateVenue = async (venueId: string, venue: Venue): Promise<string> => {
  const { id, ...rest } = venue;
  await updateDoc(doc(firestore, 'venues', venueId), rest);

  return venue.id;
};

const uploadImagesToStorage = async (files: File[], venueId: string) => {
  const metadata = {
    contentType: 'image/jpeg',
  };

  const uploadPromises = files.map(async (file) => {
    const storageRef = ref(storage, `images/${venueId}/${file.name}`);
    await uploadBytes(storageRef, file, metadata);
    return await getDownloadURL(storageRef);
  });

  return Promise.all(uploadPromises);
};

const deleteImagesFromStorage = async (imagesToDelete: string[]) => {
  imagesToDelete.map(async (image) => {
    const fileToDeleteRef = ref(storage, image);
    await deleteObject(fileToDeleteRef);
  });
};

const appendImages = async (venueId: string, imageUrls: string[]): Promise<void> => {
  await updateDoc(doc(firestore, 'venues', venueId), { images: arrayUnion(...imageUrls) });
};

const removeImages = async (venueId: string, imageUrls: string[]): Promise<void> => {
  await updateDoc(doc(firestore, 'venues', venueId), { images: arrayRemove(...imageUrls) });
};

const updateVenueImages = async (venueId: string, imagesUrls: string[]): Promise<void> => {
  const venueRef = doc(collection(firestore, 'venues'), venueId);
  await updateDoc(venueRef, { images: imagesUrls });
};

const subscribeToVenue = (venueId: string, onVenueUpdate: (Venue: Venue) => void) => {
  const docRef = doc(firestore, 'venues', venueId);

  const unsubscribe = onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      onVenueUpdate(doc.data() as Venue);
    }
  });

  return unsubscribe;
};

export {
  getVenueById,
  createVenue,
  updateVenue,
  uploadImagesToStorage,
  deleteImagesFromStorage,
  appendImages,
  removeImages,
  updateVenueImages,
  subscribeToVenue,
};
