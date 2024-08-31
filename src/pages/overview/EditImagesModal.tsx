import { FC, useState } from 'react';
import { Badge, Button, IconButton, Modal } from '@mui/material';
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
} from '@hello-pangea/dnd';
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useTranslation } from 'react-i18next';

const EditImagesModal: FC<EditImagesModalProps> = ({ images, venueId, open, onClose, onSave }) => {
  const [editedImages, setEditedImages] = useState<string[]>(structuredClone(images));
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const { t } = useTranslation();

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = reorder(editedImages, result.source.index, result.destination.index);

    setEditedImages(items);
  };

  const reorder = (list: string[], startIndex: number, endIndex: number) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const toggleImageToDelete = (image: string) => {
    setImagesToDelete((prev) =>
      prev.includes(image) ? prev.filter((img) => img !== image) : [...prev, image]
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="flex items-center justify-center fixed inset-0 z-50"
    >
      <div className="bg-white w-full max-w-3xl rounded-lg p-5 relative">
        <IconButton className="absolute right-2 top-2" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <div className="text-lg font-bold text-center mb-4">Images</div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided: DroppableProvided) => (
              <div
                className="flex flex-wrap items-center"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {editedImages.map((image: string, index: number) => {
                  const isGrayedOut = imagesToDelete.includes(image);
                  return (
                    <Draggable key={image} draggableId={image} index={index}>
                      {(provided: DraggableProvided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="m-2"
                          style={{
                            ...provided.draggableProps.style,
                            opacity: isGrayedOut ? 0.5 : 1,
                          }}
                        >
                          <Badge
                            badgeContent={
                              <IconButton
                                className="bg-white p-0"
                                onClick={() => toggleImageToDelete(image)}
                              >
                                {isGrayedOut ? (
                                  <ControlPointIcon className="hover:text-green-400" />
                                ) : (
                                  <HighlightOffIcon className="hover:text-red-500" />
                                )}
                              </IconButton>
                            }
                          >
                            <img
                              src={image}
                              alt={`file-preview-${index}`}
                              className="max-w-[180px] max-h-[180px] rounded"
                            />
                          </Badge>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="flex justify-end gap-4 mt-4">
          <Button
            color="success"
            variant="outlined"
            onClick={() => {
              onSave(editedImages, imagesToDelete);
              onClose();
            }}
          >
            {t('btn_save')}
          </Button>
          <Button color="error" variant="outlined" onClick={onClose}>
            {t('btn_cancel')}
          </Button>
        </div>
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
