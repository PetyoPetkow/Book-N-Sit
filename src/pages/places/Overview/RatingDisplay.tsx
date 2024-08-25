import { Avatar, Divider, Rating, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import Review from '../../../global/models/Review';
import _ from 'lodash';

const RatingDisplay: FC<RatingDisplayProps> = ({ reviews }) => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentReview, setCurrentReview] = useState<Review | null>();

  const averageRating = useMemo(() => {
    const ratings = reviews.map((review) => review.rating);
    return _.mean(ratings);
  }, [reviews]);

  const ratingLabel = useMemo(() => {
    if (averageRating < 2) {
      return Ratings[0];
    } else if (averageRating < 3) {
      return Ratings[1];
    } else if (averageRating < 4) {
      return Ratings[2];
    } else if (averageRating < 4.5) {
      return Ratings[3];
    } else if (averageRating < 5) {
      return Ratings[4];
    }
  }, [averageRating]);

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

  return (
    <>
      {reviews.length !== 0 && (
        <div className="flex flex-col h-full overflow-hidden border border-solid border-[#005C78]">
          <div className="flex justify-end gap-3 h-12 p-2 bg-[#006989]">
            <div className="flex flex-col items-start">
              <div className="flex justify-end items-center font-bold text-xl text-white">
                {ratingLabel}
              </div>
              <div className="text-xs text-white">{reviews.length} reviews</div>
            </div>
            <div className="flex justify-center items-center h-10 w-10 bg-white rounded-tl-2xl rounded-br-2xl text-[#005C78] text-xl font-bold">
              {averageRating}
            </div>
          </div>
          <Divider />

          {currentReview && (
            <div className="p-3 flex items-center">
              <div className="flex-1">
                <div className="flex items-start gap-2">
                  <Avatar />
                  <div>
                    <div className="font-bold">{currentReview.displayName}</div>
                    <Rating value={currentReview.rating} readOnly />
                  </div>
                </div>
                <div className="mt-2 line-clamp-5">{currentReview.comment}</div>
              </div>
            </div>
          )}
          <div className="flex justify-center h-full items-end">
            <IconButton onClick={handlePrevious}>
              <ArrowBackIcon />
            </IconButton>
            <IconButton onClick={handleNext}>
              <ArrowForwardIcon />
            </IconButton>
          </div>
        </div>
      )}
    </>
  );
};

interface RatingDisplayProps {
  reviews: Review[];
}

enum Ratings {
  'Bad',
  'Average',
  'Good',
  'Very good',
  'Superb',
}

export default RatingDisplay;
