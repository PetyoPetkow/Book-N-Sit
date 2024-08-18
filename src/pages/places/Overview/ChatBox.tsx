import { Avatar, Divider, IconButton, TextField, Tooltip } from '@mui/material';
import clsx from 'clsx';
import { FC, KeyboardEvent, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../../contexts/authContext';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';

const ChatBox: FC<ChatBoxProps> = ({ isOpen, messages, sendMessage, onClose }) => {
  const [text, setText] = useState<string>('');

  const { currentUser } = useAuth();

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    console.log(e);
    if (e.key === 'Enter' && e.nativeEvent.shiftKey === false) {
      e.preventDefault();
      if (text !== '') {
        sendMessage(text);
        setText('');
      }
    }
  };

  const chatboxContent = isOpen ? (
    <div className="fixed flex flex-col bottom-4 h-96 right-20 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
      <div className="flex justify-between items-center p-2 bg-gray-200">
        <div className="flex gap-3">
          <Avatar className="h-7 w-7" />
          <span className="font-bold">John Smith</span>
        </div>
        <IconButton className="w-7 h-7" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <Divider />
      <div className="overflow-auto flex flex-col-reverse flex-grow">
        <div className="p-2 justify-end">
          {messages === null ? (
            <div>There are still no messages.</div>
          ) : (
            messages.map((m: any) => (
              <div
                className={clsx(
                  'flex gap-5 items-end mt-2',
                  m.senderId === currentUser?.uid ? 'justify-start mr-20 ' : 'justify-end ml-20 '
                )}
              >
                <Avatar
                  className={clsx(
                    m.senderId === currentUser?.uid ? 'order-first left-0' : 'order-last right-0'
                  )}
                />
                <div
                  className={clsx(
                    'flex flex-col',
                    m.senderId === currentUser?.uid ? 'items-start' : 'items-end'
                  )}
                >
                  <div
                    className={clsx(
                      m.senderId === currentUser?.uid
                        ? 'bg-blue-200 rounded-br-xl'
                        : 'bg-[#e3e7db] rounded-bl-xl ',
                      'p-1 px-3 rounded-t-xl w-fit'
                    )}
                  >
                    {m.text}
                  </div>
                  <Tooltip
                    title={new Date(m.date.seconds * 1000).toDateString()}
                    placement="top"
                    enterDelay={1000}
                  >
                    <div className="text-xs text-gray-600">
                      {moment(new Date(m.date.seconds * 1000)).fromNow()}
                    </div>
                  </Tooltip>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Divider />
      <div className="p-2 h-fit flex items-center gap-2 bg-white">
        <TextField
          className="flex-1"
          InputProps={{
            disableUnderline: true,
          }}
          variant="standard"
          multiline
          maxRows={3}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            console.log(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
        <IconButton
          className="aspect-square"
          onClick={() => {
            sendMessage(text);
            setText('');
          }}
        >
          <SendOutlinedIcon />
        </IconButton>
      </div>
    </div>
  ) : (
    <></>
  );

  return createPortal(chatboxContent, document.body);
};

interface ChatBoxProps {
  isOpen: boolean;
  messages:
    | {
        date: Date;
        id: string;
        senderId: string;
        text: string;
      }[]
    | null;
  sendMessage: (text: string) => Promise<void>;
  onOpen: () => void;
  onClose: () => void;
}

export default ChatBox;
