import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DragDropContext, Droppable, Draggable, DroppableProps } from 'react-beautiful-dnd';
import { Badge, IconButton } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

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

export default function InputFileUpload() {
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);

  const handleFileChange = (event: any) => {
    const files = Array.from(event.target.files).map((file, index) => ({
      id: index,
      file,
    }));
    setSelectedFiles(files);
  };

  const removeFile = (idToRemove: string) => {
    setSelectedFiles(selectedFiles.filter((file) => file.id !== idToRemove));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedFiles = Array.from(selectedFiles);
    const [removed] = reorderedFiles.splice(result.source.index, 1);
    reorderedFiles.splice(result.destination.index, 0, removed);

    setSelectedFiles(reorderedFiles);
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
        <VisuallyHiddenInput type="file" multiple onChange={handleFileChange} />
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
                {selectedFiles.map((file, index) => (
                  <Draggable key={file.id} draggableId={file.id.toString()} index={index}>
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
                              onClick={() => removeFile(file.id)}
                            >
                              <HighlightOffIcon />
                            </IconButton>
                          }
                        >
                          <img
                            src={URL.createObjectURL(file.file)}
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
