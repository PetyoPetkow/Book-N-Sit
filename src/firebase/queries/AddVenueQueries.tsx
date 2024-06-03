import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase';

export const uploadImages = async (files: any[]) => {
  const metadata = {
    contentType: 'image/jpeg',
  };

  const uploadPromises = files.map((file) => {
    const storageRef = ref(storage, `images/${file.name}`);
    return uploadBytes(storageRef, file, metadata);
  });

  return Promise.all(uploadPromises);
};
