import { Badge, Button, Rating, TextField } from '@mui/material';
import { FC, SyntheticEvent } from 'react';
import { MAX_COMMENT_LENGTH } from './constants';
import { useTranslation } from 'react-i18next';

const WriteReviewSection: FC<WriteReviewSectionProps> = ({
  rating,
  comment,
  onRatingChanged,
  onCommentChange,
  postReview,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      <div className="text-lg font-bold">{t('leave_review')}</div>
      <div className="flex gap-3">
        {t('rating')}: <Rating value={rating} onChange={onRatingChanged} />
      </div>
      <Badge color="primary" badgeContent={`${comment.length}/${MAX_COMMENT_LENGTH}`}>
        <TextField
          className="w-full"
          rows={5}
          multiline
          inputProps={{ maxLength: MAX_COMMENT_LENGTH }}
          value={comment}
          onChange={(event) => onCommentChange(event.target.value)}
        />
      </Badge>
      <div className="flex gap-3 justify-end">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (rating) {
              postReview(rating, comment);
            } else {
              console.log('Please rate the venue before submitting');
            }
          }}
        >
          {t('btn_submit')}
        </Button>
      </div>
    </div>
  );
};

interface WriteReviewSectionProps {
  rating: number | null;
  comment: string;
  onRatingChanged: (event: SyntheticEvent<Element, Event>, rating: number | null) => void;
  onCommentChange: (comment: string) => void;
  postReview: (rating: number, comment: string) => void;
}

export default WriteReviewSection;
