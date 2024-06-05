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

const OverviewPage: FC<OverviewPageProps> = () => {
  const [img, setImg] = useState<any>();

  useEffect(() => {
    const a = async () => {
      const b = await getVenueImages([
        'images/cCF1KexJ8Fxl3BxDT0r5',
        'images/PE670Tg76kw4h2sY1Un3',
        'images/y4eo8nqNfu7J4MhLv0RA',
      ]);
      setImg(b);
    };

    a();
  }, []);

  useEffect(() => {
    console.log(img);
  }, [img]);
  return (
    <div className="flex flex-col gap-3 pb-10 mt-10">
      <div>
        <div className="font-bold font-sans text-2xl">The Property Name Is Here</div>
        <Location />
        <div className="flex gap-2 h-[530px] w-full  bg-blue-50">
          <div className="w-3/4">{img && <ImageGallery images={img}></ImageGallery>}</div>
          <div className="flex flex-col gap-2 w-1/4 h-full">
            <div className="w-full flex-1">
              <RatingDisplay />
            </div>
            <div className="w-full flex-1">
              <RatingDisplay />
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
