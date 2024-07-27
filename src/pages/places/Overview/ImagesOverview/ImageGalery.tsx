import { useState } from 'react';
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

  return (
    <div className="flex flex-col bg-white">
      <ImageList
        gap={8}
        className="w-full h-fit flex-shrink m-0"
        variant="quilted"
        cols={9}
        rowHeight={90}
      >
        {gridPatternn.map((gridEntry, index) => {
          console.log(images[index]);
          const { rows, cols } = gridEntry;
          return (
            images[index] && (
              <ImageListItem
                className={clsx(
                  'hover:opacity-90 cursor-pointer',
                  index === gridPattern.length - 1 &&
                    images.length > gridPattern.length &&
                    'brightness-75'
                )}
                key={images[index]}
                cols={cols}
                rows={rows}
                onClick={() => {
                  handleClickOpen(index);
                }}
              >
                {index === gridPattern.length - 1 && images.length > gridPattern.length && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span className="text-white text-xl bg-black bg-opacity-50 px-2 py-1 rounded">
                      +{images.length - index - 1} photos
                    </span>
                  </div>
                )}
                <img src={images[index]} />
              </ImageListItem>
            )
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

const gridPatternn: GridDimensions[] = [
  { rows: 5.5, cols: 6 },
  { rows: 2, cols: 3 },
  { rows: 2, cols: 3 },
  { rows: 2, cols: 3 },
];

interface GridDimensions {
  rows: number;
  cols: number;
}
