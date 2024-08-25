import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Badge, IconButton } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { storage } from '../../firebase/firebase';
import { deleteObject, ref } from 'firebase/storage';

export default function InputFileUpload({
  disabled = false,
  images,
  onImagesChanged,
  files,
  onAddFiles,
}: UploadImagesProps) {
  const removeFile = async (idToRemove: string) => {
    onImagesChanged(images.filter((file: string) => file !== idToRemove));
    const fileToDeleteRef = ref(storage, idToRemove);

    await deleteObject(fileToDeleteRef);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedFiles = Array.from(images);
    const [removed] = reorderedFiles.splice(result.source.index, 1);
    reorderedFiles.splice(result.destination.index, 0, removed);

    onImagesChanged(reorderedFiles);
  };

  return (
    <div>
      <Button
        disabled={disabled}
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload Images
        <input
          className="hidden"
          type="file"
          multiple
          onChange={(event) => {
            onAddFiles(event.target.files);
          }}
        />
      </Button>
      <div style={{ marginTop: '20px' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
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
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

interface UploadImagesProps {
  disabled?: boolean;
  images: string[];
  onImagesChanged: (images: string[]) => void;
  files: FileList | null;
  onAddFiles: (files: FileList | null) => void;
}
