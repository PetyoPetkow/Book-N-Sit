import { FC, useEffect, useState } from 'react';
import Location from './Location';
import ImageGallery from './ImagesOverview/ImageGalery';
import RatingDisplay from './Rating/RatingDisplay';
import { Divider } from '@mui/material';
import ReviewsSection from './Reviews/ReviewsSection';
import PerksList from './Perks/PerksList';
import PropertyDescription from './PropertyDescription/PropertyDescription';
import WriteReviewSection from './Reviews/WriteReviewSection';
import { getVenueImages } from '../../../firebase/queries/AddVenueQueries';
import { db, firebase, firestore } from '../../../firebase/firebase';
import { useParams } from 'react-router-dom';
import { onValue, ref } from 'firebase/database';
import Venue from '../../../global/models/Venue';
import { Firestore, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import OwnerInfo from './Owner/OwnerInfo';
import { reviewsMockData } from './Reviews/ReviewsMockData';

const OverviewPage: FC<OverviewPageProps> = () => {
  const [venue, setVenue] = useState<Venue | null>(null);

  const { venueName } = useParams();

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
                  <RatingDisplay reviews={reviewsMockData} />
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
          <WriteReviewSection />
          <ReviewsSection />
        </div>
      )}
    </>
  );
};

const imageSources = [
  'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
  'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
  'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
  'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
  'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
  'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
];

interface OverviewPageProps {}

export default OverviewPage;
