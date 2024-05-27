import { FC, useState } from 'react';
import Review from './Review';
import { Pagination } from '@mui/material';
import { reviewsMockData } from './ReviewsMockData';

const ReviewsSection: FC<ReviewsSectionProps> = ({}) => {
  const [page, setPage] = useState<number>(1);
  const commentsPerPage = 5;
  const pageCount = Math.ceil(reviewsMockData.length / commentsPerPage);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const displayedComments = reviewsMockData.slice(
    (page - 1) * commentsPerPage,
    page * commentsPerPage
  );

  return (
    <>
      {displayedComments.map((commentEntry, index) => (
        <Review
          key={index}
          name={commentEntry.name}
          rating={commentEntry.rating}
          comment={commentEntry.comment}
        />
      ))}
      <Pagination className="m-auto" count={pageCount} page={page} onChange={handleChange} />
    </>
  );
};

interface ReviewsSectionProps {}

export default ReviewsSection;
