import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DragDropContext, Droppable, Draggable, DroppableProps } from 'react-beautiful-dnd';
import { Badge, IconButton } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { uploadImages } from '../../../../firebase/queries/AddVenueQueries';
import { storage } from '../../../../firebase/firebase';
import { deleteObject, ref } from 'firebase/storage';
import { useParams } from 'react-router-dom';

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

export default function InputFileUpload({
  images,
  onImagesChanged,
  files,
  onAddFiles,
}: UploadImagesProps) {
  // const handleFileChange = async (event: any) => {
  //   const files = Array.from(event.target.files).map((file, index) => ({
  //     id: index,
  //     file: file as File,
  //   }));
  //   console.log(files);
  //   const imageUrls = await uploadImages(files, 'name');

  //   onImagesChanged(imageUrls);
  // };

  // const handleFileChange = async (event: any) => {
  //   const files = Array.from(event.target.files).map((file, index) => ({
  //     id: index,
  //     file: file as File,
  //   }));
  //   console.log(files);
  //   const imageUrls = await uploadImages(files, 'name');

  //   onImagesChanged(imageUrls);
  // };

  const removeFile = (idToRemove: string) => {
    onImagesChanged(images.filter((file: string) => file !== idToRemove));
    const fileToDeleteRef = ref(storage, idToRemove);

    deleteObject(fileToDeleteRef)
      .then(() => {
        console.log('file deleted successfully');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedFiles = Array.from(images);
    const [removed] = reorderedFiles.splice(result.source.index, 1);
    reorderedFiles.splice(result.destination.index, 0, removed);

    onImagesChanged(reorderedFiles);
  };

  const compressImage = async (file: File, { quality = 1, type = file.type }) => {
    // Get as image data
    const imageBitmap = await createImageBitmap(file);

    // Draw to canvas
    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(imageBitmap, 0, 0);

    // Turn into Blob
    const blob: any = await new Promise((resolve) => canvas.toBlob(resolve, type, quality));

    // Turn Blob into File
    return new File([blob], file.name, {
      type: blob.type,
    });
  };

  return (
    <div>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload Images
        <VisuallyHiddenInput
          type="file"
          multiple
          onChange={(event) => {
            onAddFiles(event.target.files);
          }}
        />
      </Button>
      <div style={{ marginTop: '20px' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <StrictModeDroppable droppableId="droppable" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ display: 'flex', flexWrap: 'wrap' }}
              >
                {files &&
                  Array.from(files).map((file: File, index: number) => (
                    <Draggable key={'image' + index} draggableId={file.name} index={index}>
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
                                onClick={() => removeFile(file.name)}
                              >
                                <HighlightOffIcon />
                              </IconButton>
                            }
                          >
                            <img
                              src={URL.createObjectURL(file)}
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
  onImagesChanged: (images: string[]) => void;
  files: FileList | null;
  onAddFiles: (files: FileList | null) => void;
}
