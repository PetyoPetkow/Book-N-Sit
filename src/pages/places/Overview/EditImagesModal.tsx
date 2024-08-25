import { FC, useState } from 'react';
import { Badge, Button, IconButton, Modal } from '@mui/material';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

const EditImagesModal: FC<EditImagesModalProps> = ({ images, venueId, open, onClose, onSave }) => {
  const [editedImages, setEditedImages] = useState<string[]>(structuredClone(images));
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = reorder(images, result.source.index, result.destination.index);

    setEditedImages(items);
  };

  const reorder = (list: string[], startIndex: number, endIndex: number) => {
    const result = list;
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
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="bg-white w-[600px] absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg p-5">
        <IconButton className="absolute right-1 top-1" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <div className="text-lg font-bold text-center w-full">Images</div>
        <div>
          <div style={{ marginTop: '20px' }}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable" direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ display: 'flex', flexWrap: 'wrap' }}
                  >
                    {editedImages.map((image: string, index: number) => {
                      const isGrayedOut = imagesToDelete.includes(image);
                      return (
                        <Draggable key={'images' + image} draggableId={image} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: 'none',
                                padding: '10px',
                                margin: '10px',
                                opacity: isGrayedOut ? 0.5 : 1,
                                ...provided.draggableProps.style,
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
                                  style={{ maxWidth: '100px', maxHeight: '100px' }}
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
            <div className="flex justify-end gap-5">
              <Button
                color="success"
                variant="outlined"
                onClick={() => {
                  onSave(editedImages, imagesToDelete);
                  onClose();
                }}
              >
                Save
              </Button>
              <Button color="error" variant="outlined" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
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
