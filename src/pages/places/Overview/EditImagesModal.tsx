import { IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditImages from '../Venue/Images/EditImages';
import { FC } from 'react';

const EditImagesModal: FC<EditImagesModalProps> = ({ images, venueId, open, onClose, onSave }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="bg-white w-[600px] absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg p-5">
        <IconButton className="absolute right-1 top-1" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <div className="text-lg font-bold text-center w-full">Images</div>
        <EditImages images={images} onSave={onSave} venueId={venueId} onClose={onClose} />
      </div>
    </Modal>
  );
};

interface EditImagesModalProps {
  images: string[];
  venueId: string;
  open: boolean;
  onClose: () => void;
  onSave: (images: string[], imagesToDelete: string[]) => void;
}

export default EditImagesModal;
