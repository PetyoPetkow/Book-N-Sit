import { Badge, Button, Rating, TextField } from '@mui/material';
import { FC, useState } from 'react';

const WriteReviewSection: FC<WriteReviewSectionProps> = () => {
  const [comment, setComment] = useState<string>('');
  const maxCommentLength = 255;

  return (
    <div className="flex flex-col gap-3">
      <div className="text-lg font-bold">Leave a review</div>
      <div className="flex gap-3">
        Rate: <Rating />
      </div>
      <Badge color="primary" badgeContent={`${comment.length}/${maxCommentLength}`}>
        <TextField
          className="w-full"
          rows={5}
          multiline
          inputProps={{ maxLength: maxCommentLength }}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </Badge>
      <div className="flex gap-3 justify-end">
        <Button variant="contained" className="bg-[#028391] hover:bg-[#60b6c0]">
          Finish Review
        </Button>
        <Button variant="contained" className="bg-[#ff4b4b] hover:bg-[#ff6e6e]">
          Cancel
        </Button>
      </div>
    </div>
  );
};

interface WriteReviewSectionProps {}

export default WriteReviewSection;
