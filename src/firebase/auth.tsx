import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  UserInfo,
} from 'firebase/auth';
import { auth } from './firebase';

export const doCreateUserWithEmailAndPassword = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doUpdateProfile = async (userInfo: Partial<UserInfo>) => {
  return updateProfile(auth.currentUser!, { ...userInfo });
};

export const doSingOut = () => {
  return auth.signOut();
};
