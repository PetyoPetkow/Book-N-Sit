import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCVTUpAmkaMAZRHaZ6wN5Qh8DOfdecwTOc',
  authDomain: 'book-n--sit.firebaseapp.com',
  projectId: 'book-n--sit',
  storageBucket: 'book-n--sit.appspot.com',
  messagingSenderId: '268191443812',
  appId: '1:268191443812:web:c26738d5206c2026afa871',
  measurementId: 'G-ZL0XXJ347F',
};

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const analytics = getAnalytics(firebase);
const firestore = getFirestore(firebase);
const storage = getStorage(firebase);

export { auth, analytics, firestore, storage };
