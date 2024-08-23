import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes, UploadResult } from 'firebase/storage';
import UserDetails from '../../global/models/users/UserDetails';

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

const createUserInDB = async (user: UserDetails) => {
  await setDoc(doc(firestore, 'users', user.id), user);
};

export { getUserById, uploadProfilePicture, createUserInDB };
