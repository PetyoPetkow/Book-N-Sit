import { FC } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUploadOutlined';
import { useTranslation } from 'react-i18next';

const OwnerControls: FC<OwnerControlsProps> = ({ venueId, onOpen, onImagesAdded }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2">
      <Button
        className="font-bold bg-black bg-opacity-60"
        variant="outlined"
        color="secondary"
        onClick={() => {
          navigate(`/addVenue/${venueId}`);
        }}
      >
        {t('btn_edit')}
      </Button>
      <Button
        className="font-bold bg-black bg-opacity-60"
        variant="outlined"
        color="secondary"
        component="label"
        role={undefined}
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        {t('btn_upload_images')}
        <input
          className="hidden"
          disabled={venueId === undefined}
          type="file"
          multiple
          onChange={async (event: any) => onImagesAdded(event.target.files)}
        />
      </Button>
      <Button
        className="font-bold bg-black bg-opacity-60"
        variant="outlined"
        color="secondary"
        onClick={onOpen}
      >
        {t('btn_edit_images')}
      </Button>
    </div>
  );
};

interface OwnerControlsProps {
  images: string[];
  venueId: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSave: (images: string[], imagesToDelete: string[]) => void;
  onImagesAdded: (files: FileList) => void;
}

export default OwnerControls;
