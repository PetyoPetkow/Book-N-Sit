import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Badge, IconButton } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useTranslation } from 'react-i18next';

export default function InputFileUpload({
  disabled = false,
  files,
  onFilesChanged,
  onAddFiles,
}: UploadFilesProps) {
  const { t } = useTranslation();

  const removeFile = (fileNameToRemove: string) => {
    const filesCopy = structuredClone(files);
    const updatedFiles = filesCopy.filter((file: File) => file.name !== fileNameToRemove);
    onFilesChanged(updatedFiles);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = structuredClone(files);
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);

    onFilesChanged(items);
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
        {t('btn_upload_files')}
        <input
          className="hidden"
          type="file"
          multiple
          onChange={(event) => {
            if (event.target.files) {
              onAddFiles(Array.from(event.target.files));
            }
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
                {files.map((file: File, index: number) => (
                  <Draggable key={file.name} draggableId={file.name} index={index}>
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
                            className="max-w-36 max-h-36"
                            src={URL.createObjectURL(file)}
                            alt={`file-preview-${index}`}
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

interface UploadFilesProps {
  disabled?: boolean;
  files: File[];
  onFilesChanged: (files: File[]) => void;
  onAddFiles: (files: File[]) => void;
}
