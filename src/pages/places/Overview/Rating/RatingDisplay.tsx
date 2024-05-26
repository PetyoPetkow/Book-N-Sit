import { Avatar, Divider } from '@mui/material';
import { FC } from 'react';

const RatingDisplay: FC<RatingDisplayProps> = () => {
  const rating = generateRandomFloat();
  const ratingValue = getRatingValue(Number(rating));

  return (
    <div className="flex flex-col h-full border border-1 border-solid border-gray-300 ">
      <div className="flex justify-end gap-3 h-12 p-2">
        <div className="flex flex-col items-start">
          <div className="flex justify-end items-center font-bold text-xl">{ratingValue}</div>
          <div className="text-gray-500 text-xs">51 reviews</div>
        </div>
        <div className="flex justify-center items-center h-10 w-10 bg-[#0d9488] rounded-tl-2xl rounded-br-2xl text-white text-xl font-bold">
          {rating}
        </div>
      </div>
      <Divider />
      <div className="p-3">
        <div className="flex items-start gap-2">
          <Avatar />
          <div className="font-bold">John Smith</div>
        </div>
        <div className="mt-2 line-clamp-5">
          At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
          voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati
          cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id
          est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam
          libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod
          maxime placeat facere possimus.
        </div>
      </div>
    </div>
  );
};

interface RatingDisplayProps {}

const generateRandomFloat = () => {
  const min = 0;
  const max = 10;
  const randomValue = Math.random() * (max - min) + min;
  return randomValue.toFixed(1);
};

const getRatingValue = (rating: number) => {
  if (rating < 3) {
    return Ratings[0];
  } else if (rating < 6) {
    return Ratings[1];
  } else if (rating < 8) {
    return Ratings[2];
  } else if (rating < 9) {
    return Ratings[3];
  } else if (rating > 9) {
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
