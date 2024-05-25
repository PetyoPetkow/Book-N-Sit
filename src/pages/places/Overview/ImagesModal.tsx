import { Box, Modal } from '@mui/material';
import { FC } from 'react';

const ImagesModal: FC<ImagesModalProps> = ({ open, handleClose }) => {
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>asdasfasfasfasfasfas</Box>
    </Modal>
  );
};

interface ImagesModalProps {
  open: boolean;
  handleClose: () => void;
}

export default ImagesModal;
