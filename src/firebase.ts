import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

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
const analytics = getAnalytics(firebase);
export const firestore = getFirestore(firebase);
