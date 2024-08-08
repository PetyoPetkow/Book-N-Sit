import { UploadResult, getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { db, firebase, firestore, storage } from '../firebase';
import Venue from '../../global/models/Venue';
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentReference,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { push } from 'firebase/database';

export const uploadImages = async (files: FileList | null, venueName: string) => {
  const metadata = {
    contentType: 'image/jpeg',
  };
  console.log(venueName, files);

  const uploadPromises =
    files &&
    Array.from(files).map((file) => {
      console.log(file);
      const storageRef = ref(storage, `images/${venueName}/${file.name}`);
      return uploadBytes(storageRef, file, metadata).then((value: UploadResult) => {
        return getDownloadURL(storageRef);
      });
    });

  if (!uploadPromises) {
    return;
  }

  return Promise.all(uploadPromises);
};

export const saveVenue = async (
  venue: Omit<Venue, 'images'>,
  files: FileList | null
): Promise<{
  status: 'success' | 'error';
  data?: DocumentReference<DocumentData, DocumentData>;
}> => {
  const { city, coordinates, description, name, userId, perks, venueTypes, workingHours } = venue;
  try {
    // Upload images
    const imageUrls = await uploadImages(files, name);

    // Prepare venue data
    const venueData = {
      name: name,
      city: city,
      coordinates: coordinates,
      images: imageUrls,
      description: description,
      perks: perks,
      venueTypes: venueTypes,
      workingHours: workingHours,
      userId: userId,
    };

    const docRef = await addDoc(collection(firestore, 'venues'), venueData);

    console.log('Venue successfully saved to Firestore');
    return { status: 'success' as 'success', data: docRef };
  } catch (error) {
    console.error('Error saving venue:', error);
    return { status: 'error' };
  }
};

export const updateVenue = async (venue: Venue): Promise<void> => {
  const {
    city,
    coordinates,
    description,
    images,
    name,
    userId,
    perks,
    venueTypes,
    workingHours,
    id,
  } = venue;
  try {
    // Upload images

    // Prepare venue data
    const venueData = {
      name: name,
      city: city,
      coordinates: coordinates,
      description: description,
      images: [],
      perks: perks,
      venueTypes: venueTypes,
      workingHours: workingHours,
      userId: userId,
    };

    const docRef = await updateDoc(doc(firestore, 'venues', id!), venueData);

    console.log('Venue successfully saved to Firestore');
  } catch (error) {
    console.error('Error saving venue:', error);
  }
};

export const getVenueImages = async (imagesAddresses: string[]) => {
  const promises = imagesAddresses.map((imageAddress) => {
    const storageRef = ref(storage, imageAddress);
    return getDownloadURL(storageRef);
  });

  const images: any[] = [];

  return await Promise.all(promises);
};

export const getVenueImage = async (imageAddress: string) => {
  const storageRef = ref(storage, imageAddress);
  return getDownloadURL(storageRef);
};
