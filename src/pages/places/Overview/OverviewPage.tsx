import { FC, useState } from 'react';
import Location from './Location';
import { ImageList, ImageListItem } from '@mui/material';
import ImagesModal from './ImagesModal';
import ImageGallery from './ImageGalery';

const OverviewPage: FC<OverviewPageProps> = () => {
  const [imagesModalOpen, setImagesModalOpen] = useState<boolean>(false);

  function srcset(image: string, size: number, rows = 1, cols = 1) {
    return {
      src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
    };
  }

  return (
    <div>
      <ImagesModal open={imagesModalOpen} handleClose={() => setImagesModalOpen(false)} />
      <div className="font-bold font-sans text-2xl">The Property Name Is Here</div>
      <Location />
      <div className="flex h-fit w-full bg-blue-50">
        <div className="w-3/4 m-2">
          <ImageGallery images={imageSources}></ImageGallery>
        </div>
        <div className="flex flex-col w-1/4">
          <div className="w-full flex-1 bg-red-300">asd</div>
          <div className="w-full flex-1 bg-red-300">asd</div>
        </div>
      </div>
    </div>
  );
};

const gridPattern = [
  { rows: 2, cols: 2 },
  { rows: 4, cols: 5 },
  { rows: 2, cols: 2 },
];

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
