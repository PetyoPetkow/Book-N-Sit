import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';

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

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div>
      {
        <Box display="flex" flexWrap="wrap">
          {images.map((image: any, index: number) => (
            <img
              key={index}
              src={image}
              alt={`img-${index}`}
              style={{ width: '100px', margin: '5px', cursor: 'pointer' }}
              onClick={() => handleClickOpen(index)}
            />
          ))}
        </Box>
      }
      {/* put images here from overview */}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <IconButton onClick={handlePrev} aria-label="previous">
              <ArrowBackIosIcon />
            </IconButton>
            <Box display="flex" justifyContent="center" alignItems="center" flex="1">
              <img
                src={images[currentImageIndex]}
                alt={`img-${currentImageIndex}`}
                style={{ maxWidth: '100%', maxHeight: '80vh' }}
              />
            </Box>
            <IconButton onClick={handleNext} aria-label="next">
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageGallery;
