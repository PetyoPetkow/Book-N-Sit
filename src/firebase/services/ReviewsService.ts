import { collection, where, query, doc, setDoc, getDocs, Timestamp } from 'firebase/firestore';
import { firestore } from '../firebase';
import UserReview from '../../models/UserReview';
import { getUserById } from './UserService';
import Review from '../../models/Review';

const getUserReviews = async (userId: string) => {
  const reviewsRef = collection(firestore, 'reviews');
  const reviewsQuery = query(reviewsRef, where('userId', '==', userId));
  const reviewsSnapshot = await getDocs(reviewsQuery);
  const reviewsList = reviewsSnapshot.docs.map((doc) => doc.data() as UserReview);
  return reviewsList;
};

const getVenueReviews = async (venueId: string) => {
  const reviewsList: UserReview[] = [];

  const venueReviews = await getReviewsByVenueId(venueId);

  for (const review of venueReviews) {
    const user = await getUserById(review.userId);

    if (user) {
      const userReview: UserReview = {
        ...review,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      reviewsList.push(userReview);
    } else {
      console.error(`User with ID ${review.userId} does not exist.`);
    }
  }

  return reviewsList;
};

const getReviewsByVenueId = async (venueId: string): Promise<Review[]> => {
  const reviewsCol = collection(firestore, 'reviews');
  const reviewsQuery = query(reviewsCol, where('venueId', '==', venueId));
  const reviewsSnapshot = await getDocs(reviewsQuery);

  return reviewsSnapshot.docs.map((reviewDoc) => reviewDoc.data() as Review);
};

const setReview = (userId: string, venueId: string, rating: number, comment: string) => {
  const review: Review = { userId, venueId, rating, comment, timestamp: Timestamp.now() };

  const reviewPath = `reviews/${userId}_${venueId}`;

  return setDoc(doc(firestore, reviewPath), review);
};

export { getUserReviews, getVenueReviews, setReview, getReviewsByVenueId };
