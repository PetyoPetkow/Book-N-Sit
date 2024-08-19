import { doc, getDoc } from 'firebase/firestore';
import { firestore, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes, UploadResult } from 'firebase/storage';

const getUserById = async (userId: string) => {
  const userRef = doc(firestore, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    return userData;
  } else {
    console.log(`No user with id ${userId}`);
  }
};

const uploadProfilePicture = async (userId: string, file: File) => {
  const metadata = {
    contentType: 'image/jpeg',
  };

  const storageRef = ref(storage, `profileImages/${userId}`);
  const uploadPromise = uploadBytes(storageRef, file, metadata).then((value: UploadResult) => {
    return getDownloadURL(storageRef);
  });

  if (!uploadPromise) {
    return;
  }

  return uploadPromise;
};

export { getUserById, uploadProfilePicture };
