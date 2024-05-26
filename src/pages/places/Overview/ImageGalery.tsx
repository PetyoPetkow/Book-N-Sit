import { useRef, useState } from 'react';
import { ImageList, ImageListItem } from '@mui/material';
import ImageDialog from './ImageDialog';

const ImageGallery = ({ images }: any) => {
  const [open, setOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleClickOpen = (index: number) => {
    setCurrentImageIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function srcset(image: string, size: number, rows = 1, cols = 1) {
    return {
      src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
    };
  }

  return (
    <div className="flex flex-col">
      <ImageList
        gap={8}
        className="w-full h-fit flex-shrink m-0 -mb-2"
        variant="quilted"
        cols={12}
        rowHeight={90}
      >
        {images.map(
          (item: string, index: number) =>
            index < 6 && (
              <ImageListItem
                className="hover:opacity-90 cursor-pointer"
                key={item}
                cols={gridPattern[index].cols}
                rows={gridPattern[index].rows}
                onClick={() => {
                  handleClickOpen(index);
                }}
              >
                <img
                  {...srcset(item, 90, gridPattern[index].cols, gridPattern[index].rows)}
                  alt={'image'}
                  loading="lazy"
                />
              </ImageListItem>
            )
        )}

        {images[6] && (
          <ImageListItem
            className="hover:opacity-90 brightness-75 cursor-pointer"
            key={images[6]}
            cols={gridPattern[6].cols}
            rows={gridPattern[6].rows}
            onClick={() => {
              handleClickOpen(6);
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="text-white text-xl bg-black bg-opacity-50 px-2 py-1 rounded">
                +{images.length - 6} photos
              </span>
            </div>
            <img
              {...srcset(images[6], 90, gridPattern[6].cols, gridPattern[6].rows)}
              alt={'image'}
              loading="lazy"
            />
          </ImageListItem>
        )}
      </ImageList>
      <ImageDialog
        open={open}
        handleClose={handleClose}
        currentImageIndex={currentImageIndex}
        images={images}
        setCurrentImageIndex={setCurrentImageIndex}
      />
    </div>
  );
};

export default ImageGallery;

const gridPattern = [
  { rows: 2, cols: 4 },
  { rows: 4, cols: 8 },
  { rows: 2, cols: 4 },
  { rows: 1.5, cols: 3 },
  { rows: 1.5, cols: 3 },
  { rows: 1.5, cols: 3 },
  { rows: 1.5, cols: 3 },
];
