import { useEffect, useMemo, useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DragDropContext, Droppable, Draggable, DroppableProps } from 'react-beautiful-dnd';
import { Badge, IconButton } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { uploadImages } from '../../../../firebase/queries/AddVenueQueries';
import { firebase, firestore, storage } from '../../../../firebase/firebase';
import { deleteObject, ref } from 'firebase/storage';
import { useParams } from 'react-router-dom';
import { arrayRemove, doc, updateDoc } from 'firebase/firestore';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function EditImages({ images, venueId, onClose }: UploadImagesProps) {
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const removeFiles = () => {
    imagesToDelete.map(async (image) => {
      const fileToDeleteRef = ref(storage, image);
      const venueRef = doc(firestore, 'venues', venueId);

      await updateDoc(venueRef, {
        images: arrayRemove(image),
      });

      await deleteObject(fileToDeleteRef)
        .then(() => {
          console.log('file deleted successfully');
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  // const onDragEnd = (result: any) => {
  //   if (!result.destination) return;

  //   const reorderedFiles = Array.from(images);
  //   const [removed] = reorderedFiles.splice(result.source.index, 1);
  //   reorderedFiles.splice(result.destination.index, 0, removed);

  //   onImagesChanged(reorderedFiles);
  // };

  const displayImages = useMemo(() => {
    return images.filter((item) => !imagesToDelete.includes(item));
  }, [images, imagesToDelete]);

  return (
    <div>
      <div style={{ marginTop: '20px' }}>
        <DragDropContext onDragEnd={/*onDragEnd*/ () => {}}>
          <StrictModeDroppable droppableId="droppable" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ display: 'flex', flexWrap: 'wrap' }}
              >
                {displayImages.map((image: string, index: number) => (
                  <Draggable key={'image' + index} draggableId={image} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          userSelect: 'none',
                          padding: '10px',
                          margin: '10px',
                          ...provided.draggableProps.style,
                        }}
                      >
                        <Badge
                          badgeContent={
                            <IconButton
                              className="bg-white p-0"
                              onClick={() => setImagesToDelete([...imagesToDelete, image])}
                            >
                              <HighlightOffIcon />
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
                ))}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>
        <Button
          onClick={() => {
            removeFiles();
            onClose();
          }}
        >
          Save
        </Button>
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
  onClose: () => void;
}
