import { Avatar, Divider, IconButton, TextField, Tooltip } from '@mui/material';
import clsx from 'clsx';
import { FC, KeyboardEvent, useState } from 'react';
import { createPortal } from 'react-dom';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import CloseIcon from '@mui/icons-material/Close';
import UserDetails from '../../models/UserDetails';
import Message from '../../models/Message';
import { getDateStringFromTimestamp, getTimeFromNowFromTimestamp } from '../../utils/dateUtil';

const ChatBox: FC<ChatBoxProps> = ({
  isOpen,
  messages,
  onMessageSent,
  onClose,
  senderUser,
  receiverUser,
}) => {
  const [text, setText] = useState<string>('');

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' && e.nativeEvent.shiftKey === false) {
      e.preventDefault();
      if (text !== '') {
        onMessageSent(text, senderUser, receiverUser);
        setText('');
      }
    }
  };

  const chatboxContent = isOpen ? (
    <div className="fixed flex flex-col bottom-4 h-96 right-20 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
      <div className="flex justify-between items-center p-2 bg-gray-200">
        <div className="flex gap-3">
          <Avatar className="h-7 w-7" src={receiverUser.photoURL} />
          <span className="font-bold">{receiverUser.displayName}</span>
        </div>
        <IconButton className="w-7 h-7" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <Divider />
      <div className="overflow-auto flex flex-col-reverse flex-grow">
        <div className="p-2 justify-end">
          {messages.map((message: Message) => (
            <div
              className={clsx(
                'flex gap-5 items-center mt-2',
                message.senderId === senderUser.id ? 'justify-start mr-20 ' : 'justify-end ml-20 '
              )}
            >
              <Avatar
                className={clsx(
                  message.senderId === senderUser.id ? 'order-first left-0' : 'order-last right-0',
                  'shadow-sm shadow-black'
                )}
                src={
                  message.senderId === senderUser.id ? senderUser.photoURL : receiverUser.photoURL
                }
              />
              <div
                className={clsx(
                  'flex flex-col',
                  message.senderId === senderUser.id ? 'items-start' : 'items-end'
                )}
              >
                <div
                  className={clsx(
                    message.senderId === senderUser.id
                      ? 'bg-blue-200 rounded-br-xl'
                      : 'bg-[#e3e7db] rounded-bl-xl ',
                    'p-1 px-3 rounded-t-xl w-fit'
                  )}
                >
                  {message.text}
                </div>
                <Tooltip
                  title={getDateStringFromTimestamp(message.date)}
                  placement="top"
                  enterDelay={1000}
                >
                  <div className="text-xs text-gray-600">
                    {getTimeFromNowFromTimestamp(message.date)}
                  </div>
                </Tooltip>
              </div>
            </div>
          ))}
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
          }}
          onKeyDown={handleKeyDown}
        />
        <IconButton
          className="aspect-square"
          onClick={() => {
            onMessageSent(text, senderUser, receiverUser);
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
  messages: Message[];
  onMessageSent: (text: string, sender: UserDetails, receiver: UserDetails) => Promise<void>;
  onOpen: () => void;
  onClose: () => void;
  senderUser: UserDetails;
  receiverUser: UserDetails;
}

export default ChatBox;
