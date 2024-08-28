import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from './firebase';

export const doCreateUserWithEmailAndPassword = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const doSendPasswordResetEmail = async (email: string) => {
  return await sendPasswordResetEmail(auth, email);
};

export const doSingOut = () => {
  return auth.signOut();
};
