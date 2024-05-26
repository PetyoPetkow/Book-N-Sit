import { Box, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import { FC, ForwardedRef, forwardRef, useEffect, useRef } from 'react';
import ImagesList from './ImagesList';

const ImageDialog: FC<ImageDialogProps> = ({
  open,
  handleClose,
  images,
  currentImageIndex,
  setCurrentImageIndex,
}) => {
  const handlePrev = () => {
    const newIndex = Math.max(currentImageIndex - 1, 0);
    setCurrentImageIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(currentImageIndex + 1, images.length - 1);
    setCurrentImageIndex(newIndex);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex justify-end">
        <IconButton color="inherit" onClick={handleClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <IconButton
            className="flex items-center justify-center mr-3"
            onClick={handlePrev}
            aria-label="previous"
          >
            <ArrowBackIosNewIcon className="text-5xl" />
          </IconButton>
          <div className="flex flex-col items-center justify-center">
            <Box display="flex" justifyContent="center" alignItems="center" flex="1">
              <img
                src={images[currentImageIndex]}
                alt={`img-${currentImageIndex}`}
                style={{ maxWidth: '100%', maxHeight: '80vh' }}
              />
            </Box>
            <div className="mt-5 text-center">
              {currentImageIndex + 1}/{images.length}
            </div>
          </div>
          <IconButton
            className="flex items-center justify-center ml-3"
            onClick={handleNext}
            aria-label="next"
          >
            <ArrowForwardIosIcon className="text-5xl" />
          </IconButton>
        </Box>
        <ImagesList
          images={images}
          currentImageIndex={currentImageIndex}
          handleThumbnailClick={handleThumbnailClick}
        />
      </DialogContent>
    </Dialog>
  );
};

interface ImageDialogProps {
  open: boolean;
  handleClose: () => void;
  images: string[];
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
}

export default ImageDialog;
