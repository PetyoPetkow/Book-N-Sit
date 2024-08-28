import { ChangeEvent, FC, useState } from 'react';
import { Avatar, Divider, Pagination, Rating } from '@mui/material';
import UserReview from '../../models/UserReview';
import { getDateStringFromTimestamp } from '../../utils/dateUtil';

const ReviewsSection: FC<ReviewsSectionProps> = ({ reviews }) => {
  const [page, setPage] = useState<number>(1);
  const commentsPerPage = 5;
  const pageCount = Math.ceil(reviews.length / commentsPerPage);
  const reviewsOnPage = reviews.slice((page - 1) * commentsPerPage, page * commentsPerPage);

  return (
    <>
      {reviewsOnPage.map((review) => {
        const { comment, displayName, photoURL, rating, timestamp } = review;
        return (
          <div key={review.displayName} className="flex flex-col">
            <div className="flex flex-col gap-2 h-fit bg-white p-4">
              <div className="flex justify-between">
                <div className="flex gap-4 w-full font-bold">
                  <Avatar src={photoURL} />
                  <div className="flex flex-col">
                    <div>{displayName}</div>
                    <Rating value={rating} readOnly />
                  </div>
                </div>
                <div className="justify-self-end text-nowrap">
                  {getDateStringFromTimestamp(timestamp)}
                </div>
              </div>
              <Divider className="bg-[#006989] w-72" />
              <div>{comment}</div>
            </div>
          </div>
        );
      })}
      {pageCount >= 1 && (
        <Pagination
          className="m-auto"
          count={pageCount}
          page={page}
          onChange={(event: ChangeEvent<unknown>, page: number) => setPage(page)}
        />
      )}
    </>
  );
};

interface ReviewsSectionProps {
  reviews: UserReview[];
}

export default ReviewsSection;
