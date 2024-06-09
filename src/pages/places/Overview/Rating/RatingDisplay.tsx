import { Avatar, Divider, Rating, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { FC, useEffect, useRef, useState } from 'react';
import Review from '../../../../global/models/Review';

const RatingDisplay: FC<RatingDisplayProps> = ({ reviews }) => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentReview, setCurrentReview] = useState<Review | null>();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(intervalRef.current!);
  }, [reviews.length]);

  useEffect(() => {
    const review = reviews[currentReviewIndex];

    if (review) {
      setCurrentReview(review);
    } else {
      setCurrentReview(null);
    }
  }, [currentReviewIndex, reviews]);

  const stopAutoCycle = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handlePrevious = () => {
    stopAutoCycle();
    setCurrentReviewIndex((prevIndex) => (prevIndex === 0 ? reviews.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    stopAutoCycle();
    setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const rating = generateRandomFloat();
  const ratingValue = getRatingValue(Number(rating));

  return (
    <div className="flex flex-col h-full overflow-hidden border border-solid border-[#005C78]">
      <div className="flex justify-end gap-3 h-12 p-2 bg-[#006989]">
        <div className="flex flex-col items-start">
          <div className="flex justify-end items-center font-bold text-xl text-white">
            {ratingValue}
          </div>
          <div className="text-xs text-white">51 reviews</div>
        </div>
        <div className="flex justify-center items-center h-10 w-10 bg-white rounded-tl-2xl rounded-br-2xl text-[#005C78] text-xl font-bold">
          {rating}
        </div>
      </div>
      <Divider />

      {currentReview && (
        <div className="p-3 flex items-center">
          <div className="flex-1">
            <div className="flex items-start gap-2">
              <Avatar />
              <div>
                <div className="font-bold">{currentReview.username}</div>
                <Rating value={currentReview.rating} readOnly />
              </div>
            </div>
            <div className="mt-2 line-clamp-5">{currentReview.comment}</div>
          </div>
        </div>
      )}
      <div className="flex justify-center">
        <IconButton onClick={handlePrevious}>
          <ArrowBackIcon />
        </IconButton>
        <IconButton onClick={handleNext}>
          <ArrowForwardIcon />
        </IconButton>
      </div>
    </div>
  );
};

interface RatingDisplayProps {
  reviews: Review[];
}

const generateRandomFloat = () => {
  const min = 0;
  const max = 5;
  const randomValue = Math.random() * (max - min) + min;
  return randomValue.toFixed(1);
};

const getRatingValue = (rating: number) => {
  if (rating < 2) {
    return Ratings[0];
  } else if (rating < 3) {
    return Ratings[1];
  } else if (rating < 4) {
    return Ratings[2];
  } else if (rating < 4.5) {
    return Ratings[3];
  } else if (rating < 5) {
    return Ratings[4];
  }
};

enum Ratings {
  'Bad',
  'Average',
  'Good',
  'Very good',
  'Superb',
}

export default RatingDisplay;
