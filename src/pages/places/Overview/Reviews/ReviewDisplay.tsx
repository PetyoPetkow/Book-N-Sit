import { Avatar, Divider, Rating } from '@mui/material';
import { FC } from 'react';

const ReviewDisplay: FC<ReviewDisplayProps> = ({ name, rating, comment }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2 h-fit bg-white p-4">
        <div className="flex justify-between">
          <div className="flex gap-4 w-full font-bold">
            <Avatar />
            <div className="flex flex-col">
              <div>{name}</div>
              <Rating value={rating} readOnly />
            </div>
          </div>
          <div className="justify-self-end">24.05.2024</div>
        </div>
        <Divider className="bg-[#006989] w-72" />
        <div>{comment}</div>
      </div>
    </div>
  );
};

interface ReviewDisplayProps {
  name: string;
  rating: number;
  comment: string;
}

export default ReviewDisplay;
