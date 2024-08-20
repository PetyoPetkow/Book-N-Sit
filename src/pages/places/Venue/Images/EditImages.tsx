import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { DragDropContext, Droppable, Draggable, DroppableProps } from 'react-beautiful-dnd';
import { Badge, IconButton } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { firestore, storage } from '../../../../firebase/firebase';
import { deleteObject, ref } from 'firebase/storage';
import { arrayRemove, doc, updateDoc } from 'firebase/firestore';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

export default function EditImages({ images, onSave, venueId, onClose }: UploadImagesProps) {
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
    <div>
      <div style={{ marginTop: '20px' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <StrictModeDroppable droppableId="droppable" direction="horizontal">
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
          </StrictModeDroppable>
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
  );
}

export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <Droppable {...props}>{children}</Droppable>;
};

interface UploadImagesProps {
  images: string[];
  venueId: string;
  onSave: (images: string[], imagesToDelete: string[]) => void;
  onClose: () => void;
}
