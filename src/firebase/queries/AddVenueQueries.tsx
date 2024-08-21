import { UploadResult, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firestore, storage } from '../firebase';
import Venue from '../../global/models/Venue';
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentReference,
  updateDoc,
} from 'firebase/firestore';

export const uploadImages = async (files: FileList | null, venueId: string) => {
  const metadata = {
    contentType: 'image/jpeg',
  };

  const uploadPromises =
    files &&
    Array.from(files).map((file) => {
      const storageRef = ref(storage, `images/${venueId}/${file.name}`);
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
  venue: Omit<Venue, 'images' | 'id'>,
  files: FileList | null
): Promise<{
  status: 'success' | 'error';
  data?: DocumentReference<DocumentData, DocumentData>;
}> => {
  const { city, street, coordinates, description, name, userId, perks, venueTypes, workingHours } =
    venue;
  try {
    // Upload images
    const imageUrls = await uploadImages(files, name);

    // Prepare venue data
    const venueData = {
      name: name,
      city: city,
      street: street,
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
    return { status: 'success', data: docRef };
  } catch (error) {
    console.error('Error saving venue:', error);
    return { status: 'error' };
  }
};

export const updateVenue = async (
  venue: Omit<Venue, 'images'>
): Promise<{
  status: 'success' | 'error';
}> => {
  const {
    city,
    street,
    coordinates,
    description,
    name,
    userId,
    perks,
    venueTypes,
    workingHours,
    id,
  } = venue;
  try {
    const venueData = {
      name: name,
      city: city,
      street: street,
      coordinates: coordinates,
      description: description,
      perks: perks,
      venueTypes: venueTypes,
      workingHours: workingHours,
      userId: userId,
    };

    const docRef = await updateDoc(doc(firestore, 'venues', id!), venueData);

    return { status: 'success' };
  } catch (error) {
    console.error('Error saving venue:', error);
    return { status: 'error' };
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
