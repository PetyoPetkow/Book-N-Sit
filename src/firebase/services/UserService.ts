import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes, UploadResult } from 'firebase/storage';
import UserDetails from '../../global/models/users/UserDetails';

const getUserById = async (userId: string) => {
  const userDoc = await getDoc(doc(firestore, 'users', userId));

  return userDoc.exists() ? (userDoc.data() as UserDetails) : null;
};

const getUsersByIds = async (userIds: string[]): Promise<UserDetails[]> => {
  if (userIds.length === 0) {
    return [];
  }

  const userDocs = await Promise.all(
    userIds.map((userId) => getDoc(doc(firestore, 'users', userId)))
  );

  const users = userDocs
    .filter((userDoc) => userDoc.exists())
    .map((userDoc) => userDoc.data() as UserDetails);

  return users;
};

const uploadProfilePictureToStorage = async (userId: string, file: File) => {
  const metadata = {
    contentType: 'image/jpeg',
  };

  const storageRef = ref(storage, `profileImages/${userId}`);
  const uploadPromise = uploadBytes(storageRef, file, metadata).then((value: UploadResult) => {
    return getDownloadURL(storageRef);
  });

  return uploadPromise;
};

const updateProfilePicture = async (userId: string, imageURL: string) => {
  const userRef = doc(firestore, 'users', userId);
  await updateDoc(userRef, {
    photoURL: imageURL,
  });
};

const createUserInDB = async (user: UserDetails) => {
  await setDoc(doc(firestore, 'users', user.id), user);
};

const subscribeToUser = (userId: string, onUserUpdate: (user: UserDetails) => void) => {
  const userRef = doc(firestore, 'users', userId);

  const unsubscribe = onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      onUserUpdate(doc.data() as UserDetails);
    }
  });

  return unsubscribe;
};

const updateUser = async (userId: string, user: UserDetails) => {
  const userDoc = doc(firestore, 'users', userId);
  await setDoc(userDoc, user, { merge: true });
};

export {
  getUserById,
  getUsersByIds,
  uploadProfilePictureToStorage,
  createUserInDB,
  updateProfilePicture,
  subscribeToUser,
  updateUser,
};
