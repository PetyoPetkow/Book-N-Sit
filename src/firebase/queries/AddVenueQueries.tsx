import { UploadResult, getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { firestore, storage } from '../firebase';
import Venue from '../../global/models/Venue';
import { collection, doc, setDoc } from 'firebase/firestore';

export const uploadImages = async (files: any[]) => {
  const metadata = {
    contentType: 'image/jpeg',
  };

  const uploadPromises = files.map((file) => {
    console.log(file);
    const uniqueId = doc(collection(firestore, 'images')).id;
    const storageRef = ref(storage, `images/${uniqueId}`);
    return uploadBytes(storageRef, file.file, metadata).then((value: UploadResult) => {
      console.log(value);
      return getDownloadURL(storageRef);
    });
  });

  return Promise.all(uploadPromises);
};

export const saveVenue = async (venue: Venue): Promise<void> => {
  try {
    // Upload images
    const imageUrls = await uploadImages(venue.images);

    // Prepare venue data
    const venueData = {
      name: venue.name,
      address: venue.address,
      coordinates: venue.coordinates,
      images: imageUrls,
      description: venue.description,
      workingHours: venue.workingHours,
      userId: venue.userId,
    };

    // Save to Firestore
    await setDoc(doc(firestore, 'venues', venue.name), venueData);
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
