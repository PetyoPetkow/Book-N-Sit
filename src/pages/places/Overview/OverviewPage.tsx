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
        <div className="w-3/4 flex flex-col gap-1 m-2">
          <ImageList
            className="w-full h-fit flex-shrink m-0"
            variant="quilted"
            cols={7}
            rowHeight={100}
          >
            {itemData.map((item) => (
              <ImageListItem key={item.img} cols={item.cols || 1} rows={item.rows || 1}>
                <img
                  className="hover:opacity-90"
                  onClick={() => {
                    setImagesModalOpen(true);
                  }}
                  {...srcset(item.img, 100, item.rows, item.cols)}
                  alt={item.title}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>

          <ImageList
            className="w-full h-fit flex-shrink m-0"
            variant="quilted"
            cols={5}
            rowHeight={100}
          >
            {itemData2.map(
              (item, index) =>
                index < 5 && (
                  <ImageListItem key={item.img} cols={1} rows={1}>
                    <img
                      className="hover:opacity-90"
                      {...srcset(item.img, 100, 1, 1)}
                      alt={item.title}
                      loading="lazy"
                    />
                  </ImageListItem>
                )
            )}
          </ImageList>
          <ImageGallery
            images={itemData.map((i) => {
              return i.img;
            })}
          ></ImageGallery>
        </div>
        <div className="flex flex-col w-1/4">
          <div className="w-full flex-1 bg-red-300">asd</div>
          <div className="w-full flex-1 bg-red-300">asd</div>
        </div>
      </div>
    </div>
  );
};

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
    rows: 2,
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
    rows: 4,
    cols: 5,
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
    rows: 2,
    cols: 2,
  },
];

const itemData2 = [
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
  },
];

interface OverviewPageProps {}

export default OverviewPage;
