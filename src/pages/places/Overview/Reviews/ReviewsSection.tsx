import { FC, useState } from 'react';
import ReviewDisplay from './ReviewDisplay';
import { Pagination } from '@mui/material';
import Review from '../../../../global/models/Review';

const ReviewsSection: FC<ReviewsSectionProps> = ({ reviews }) => {
  const [page, setPage] = useState<number>(1);
  const commentsPerPage = 5;
  const pageCount = Math.ceil(reviews.length / commentsPerPage);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const displayedComments = reviews.slice((page - 1) * commentsPerPage, page * commentsPerPage);

  return (
    <>
      {displayedComments.map((commentEntry, index) => (
        <ReviewDisplay
          key={index}
          name={commentEntry.username}
          rating={commentEntry.rating}
          comment={commentEntry.comment}
        />
      ))}
      <Pagination className="m-auto" count={pageCount} page={page} onChange={handleChange} />
    </>
  );
};

interface ReviewsSectionProps {
  reviews: Review[];
}

export default ReviewsSection;
