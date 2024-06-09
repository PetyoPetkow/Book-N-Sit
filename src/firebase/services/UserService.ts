import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

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

export { getUserById };
