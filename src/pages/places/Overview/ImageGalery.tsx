import { useRef, useState } from 'react';
import { ImageList, ImageListItem } from '@mui/material';
import ImageDialog from './ImageDialog';
import clsx from 'clsx';

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
        {gridPattern.map((gridEntry, index) => {
          const { rows, cols } = gridEntry;
          return (
            <ImageListItem
              className={clsx(
                'hover:opacity-90 cursor-pointer',
                index === gridPattern.length - 1 && 'brightness-75'
              )}
              key={images[index]}
              cols={cols}
              rows={rows}
              onClick={() => {
                handleClickOpen(index);
              }}
            >
              {index === gridPattern.length - 1 && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-white text-xl bg-black bg-opacity-50 px-2 py-1 rounded">
                    +{images.length - index} photos
                  </span>
                </div>
              )}
              <img {...srcset(images[index], 90, cols, rows)} alt={'image'} loading="lazy" />
            </ImageListItem>
          );
        })}
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

const gridPattern: GridDimensions[] = [
  { rows: 2, cols: 4 },
  { rows: 4, cols: 8 },
  { rows: 2, cols: 4 },
  { rows: 1.5, cols: 3 },
  { rows: 1.5, cols: 3 },
  { rows: 1.5, cols: 3 },
  { rows: 1.5, cols: 3 },
];

interface GridDimensions {
  rows: number;
  cols: number;
}
