import { collection, where, query, doc, setDoc, getDocs, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import Review from '../../global/models/Review';
import ReviewDto from '../../global/models/ReviewDto';
import { getUserById } from './UserService';

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
  const reviewsList: Review[] = [];

  for (const reviewDoc of reviewsSnapshot.docs) {
    const reviewData = reviewDoc.data() as ReviewDto;
    const user = await getUserById(reviewData.userId);

    if (user) {
      const reviewWithDisplayName: Review = {
        ...reviewData,
        displayName: user.displayName,
      };
      reviewsList.push(reviewWithDisplayName);
    } else {
      console.error(`User with ID ${reviewData.userId} does not exist.`);
    }
  }

  return reviewsList;
};

const setReview = (userId: string, venueId: string, rating: number, comment: string) => {
  const review: ReviewDto = { userId, venueId, rating, comment };

  const reviewPath = `reviews/${userId}_${venueId}`;

  return setDoc(doc(firestore, reviewPath), review);
};

export { getUserReviews, getVenueReviews, setReview };
