import { collection, where, query, doc, setDoc, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';
import Review from '../../global/models/Review';

const getUserReviews = async (userId: string) => {
  const reviewsRef = collection(firestore, 'reviews');
  const reviewsQuery = query(reviewsRef, where('userId', '==', userId));
  const reviewsSnapshot = await getDocs(reviewsQuery);
  const reviewsList = reviewsSnapshot.docs.map((doc) => doc.data() as Review);
  return reviewsList;
};

const getVenueReviews = async (venueId: string) => {
  const reviewsRef = collection(firestore, 'reviews');
  const reviewsQuery = query(reviewsRef, where('venueId', '==', venueId));
  const reviewsSnapshot = await getDocs(reviewsQuery);
  const reviewsList = reviewsSnapshot.docs.map((doc) => doc.data() as Review);

  return reviewsList;
};

const setReview = (userId: string, venueId: string, rating: number, comment: string) => {
  const review: Review = { userId, venueId, rating, comment };

  const reviewPath = `reviews/${userId}_${venueId}`;

  return setDoc(doc(firestore, reviewPath), review);
};

export { getUserReviews, getVenueReviews, setReview };
