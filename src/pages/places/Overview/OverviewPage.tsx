import { FC, useEffect, useState } from 'react';
import Location from './Location';
import ImageGallery from './ImagesOverview/ImageGalery';
import RatingDisplay from './Rating/RatingDisplay';
import { Divider } from '@mui/material';
import ReviewsSection from './Reviews/ReviewsSection';
import PerksList from './Perks/PerksList';
import PropertyDescription from './PropertyDescription/PropertyDescription';
import WriteReviewSection from './Reviews/WriteReviewSection';
import { firestore } from '../../../firebase/firebase';
import { useParams } from 'react-router-dom';
import Venue from '../../../global/models/Venue';
import { doc, getDoc } from 'firebase/firestore';
import OwnerInfo from './Owner/OwnerInfo';
import Review from '../../../global/models/Review';
import { getVenueReviews, setReview } from '../../../firebase/services/ReviewsService';
import { useAuth } from '../../../contexts/authContext';

const OverviewPage: FC<OverviewPageProps> = () => {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const { currentUser } = useAuth();
  const { venueName } = useParams();

  const onFinishReviewClick = (rating: number, comment: string) => {
    if (currentUser && venue) {
      setReview(currentUser.uid, venue.name, rating, comment);
    }
  };

  useEffect(() => {
    if (venueName) {
      const a = async () => {
        const docRef = doc(firestore, 'venues', venueName);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVenue(docSnap.data() as Venue);
        } else {
          console.log('venue with name ... does not exist');
        }
      };

      a();
    }
  }, [venueName]);

  useEffect(() => {
    const a = async () => {
      let reviews: Review[] = [];
      if (venue) {
        reviews = await getVenueReviews(venue.name);
      }
      setReviews(reviews);
    };

    a();
  }, [venue]);

  return (
    <>
      {venue && (
        <div className="flex flex-col gap-3 pb-10 mt-10">
          <div>
            <div className="font-bold font-sans text-2xl">{venue.name}</div>
            <Location />
            <div className="flex gap-2 h-[530px] w-full  ">
              <div className="w-3/4">
                <ImageGallery images={venue.images}></ImageGallery>
              </div>
              <div className="flex flex-col gap-2 w-1/4 h-full">
                <div className="w-full flex-1">
                  <RatingDisplay reviews={reviews} />
                </div>
                <div className="w-full flex-1">
                  <OwnerInfo />
                </div>
              </div>
            </div>
          </div>
          <Divider />
          <PerksList />
          <div className="my-5">
            <PropertyDescription />
          </div>
          <Divider className="mb-5" />
          <WriteReviewSection postReview={onFinishReviewClick} />
          <ReviewsSection reviews={reviews} />
        </div>
      )}
    </>
  );
};

interface OverviewPageProps {}

export default OverviewPage;
