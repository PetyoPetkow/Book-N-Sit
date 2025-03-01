import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes, UploadResult } from 'firebase/storage';
import UserDetails from '../../models/UserDetails';

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

const createUser = async (user: UserDetails) => {
  await setDoc(doc(firestore, 'users', user.id), user);
};

const updateUser = async (userId: string, user: Partial<UserDetails>) => {
  const userDoc = doc(firestore, 'users', userId);
  await setDoc(userDoc, user, { merge: true });
};

const updateProfilePicture = async (userId: string, imageURL: string) => {
  const userRef = doc(firestore, 'users', userId);
  await updateDoc(userRef, {
    photoURL: imageURL,
  });
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

const uploadProfilePictureToStorage = async (userId: string, file: File) => {
  const metadata = {
    contentType: 'image/jpeg',
  };

  const storageRef = ref(storage, `profileImages/${userId}`);
  await uploadBytes(storageRef, file, metadata);
  return getDownloadURL(storageRef);
};

export {
  getUserById,
  getUsersByIds,
  createUser,
  updateUser,
  updateProfilePicture,
  subscribeToUser,
  uploadProfilePictureToStorage,
};
