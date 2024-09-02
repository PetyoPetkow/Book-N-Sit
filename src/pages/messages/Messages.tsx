import {
  Avatar,
  Divider,
  IconButton,
  LinearProgress,
  OutlinedInput,
  TextField,
  Tooltip,
} from '@mui/material';
import { FC, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import clsx from 'clsx';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { useAuth } from '../../contexts/authContext';
import { Timestamp } from 'firebase/firestore';
import { getUsersByIds } from '../../firebase/services/UserService';
import UserChat from '../../models/UserChat';
import Message from '../../models/Message';
import UserDetails from '../../models/UserDetails';
import {
  appendMessages,
  getUserChats,
  subscribeToMessages,
  subscribeToUserChats,
  updateUserChat,
} from '../../firebase/services/MessagesService';
import { getDateStringFromTimestamp, getTimeFromNowFromTimestamp } from '../../utils/dateUtil';
import { useTranslation } from 'react-i18next';

const Messages: FC<MessagesProps> = () => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const [text, setText] = useState('');
  const [chats, setChats] = useState<UserChat[]>([]);
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedChat, setSelectedChat] = useState<UserChat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const { t } = useTranslation();
  const { currentUserDetails } = useAuth();

  const selectedChatUser = useMemo(() => {
    return users.find((user) => user.id === selectedChat?.userId);
  }, [users, selectedChat]);

  const chatsToShow = useMemo(() => {
    const chatsCopy = structuredClone(chats);

    const filteredUsers = users.filter((user: UserDetails) =>
      user.displayName.toLowerCase().includes(search.toLowerCase())
    );

    const filteredUserIds = filteredUsers.map((user: UserDetails) => user.id);

    const filteredChats =
      search === ''
        ? chatsCopy
        : chatsCopy.filter((chat: UserChat) => filteredUserIds.includes(chat.userId));

    return filteredChats;
  }, [search, chats, users]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' && e.nativeEvent.shiftKey === false) {
      e.preventDefault();
      if (text !== '') {
        handleSendMessage();
        setText('');
      }
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const userIds = chats.map((chat) => chat.userId);
      const users = await getUsersByIds(userIds);

      setUsers(users);
    };

    fetchUsers();
  }, [chats]);

  useEffect(() => {
    if (currentUserDetails) {
      const unSub = subscribeToUserChats(currentUserDetails.id, setChats);

      return () => {
        unSub();
      };
    }
  }, [currentUserDetails]);

  useEffect(() => {
    if (selectedChat) {
      const unSub = subscribeToMessages(selectedChat.chatId, setMessages);

      return () => {
        unSub();
      };
    }
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (currentUserDetails && selectedChat) {
      try {
        await appendMessages(selectedChat.chatId, currentUserDetails.id, text);

        const senderUserChats = await getUserChats(currentUserDetails.id);
        const receiverUserChats = await getUserChats(selectedChat.userId);

        const senderChat: UserChat = {
          chatId: selectedChat.chatId,
          userId: selectedChat.userId,
          lastSenderId: currentUserDetails.id,
          lastMessage: text,
          date: Timestamp.now(),
        };

        const receiverChat: UserChat = {
          chatId: selectedChat.chatId,
          userId: currentUserDetails.id,
          lastSenderId: currentUserDetails.id,
          lastMessage: text,
          date: Timestamp.now(),
        };

        if (senderUserChats !== null) {
          const updatedChats = senderUserChats.map((chat: UserChat) =>
            chat.chatId === selectedChat.chatId ? { ...chat, ...senderChat } : chat
          );

          await updateUserChat(currentUserDetails.id, updatedChats);
        }

        if (receiverUserChats !== null) {
          const updatedChats = receiverUserChats.map((chat: UserChat) =>
            chat.chatId === selectedChat.chatId ? { ...chat, ...receiverChat } : chat
          );

          await updateUserChat(selectedChat.userId, updatedChats);
        }

        console.log('Receiver chat updated successfully.');
      } catch (error) {
        console.error('Error updating chat:', error);
      }
    } else {
      console.log('Current user or selected chat not found.');
    }
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (currentUserDetails === null) return <LinearProgress />;

  return (
    <div className="flex flex-col items-center justify-center flex-grow bg-white bg-opacity-60 backdrop-blur-lg p-4">
      <div className="flex flex-col md:flex-row h-[80vh] w-full">
        <div className=" md:w-1/3 flex flex-col bg-gray-200 bg-opacity-80 drop-shadow-md shadow-black">
          <div className="flex">
            <OutlinedInput
              className="flex-1 rounded-full m-7 bg-white"
              size="small"
              startAdornment={<SearchIcon />}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Divider className="mx-4" />
          <div className="flex flex-col gap-5 mt-4 p-4">
            {chatsToShow.map((chat: UserChat) => {
              const user = users.find((u) => u.id === chat.userId);
              return (
                <div
                  key={chat.chatId}
                  className={clsx(
                    chat.chatId === selectedChat?.chatId ? 'bg-opacity-80' : '',
                    'flex gap-3 p-2 rounded-lg bg-white hover:bg-gray-300 hover:cursor-pointer'
                  )}
                  onClick={() => setSelectedChat(chats.find((c) => c.chatId === chat.chatId)!)}
                >
                  <Avatar className="shadow-black shadow-sm" src={user?.photoURL} />
                  <div className="flex flex-col flex-grow">
                    <div className="font-bold">{user?.displayName}</div>
                    <div className="text-sm text-gray-800">
                      {chat.lastSenderId === currentUserDetails.id && `${t('you')}: `}
                      {chat.lastMessage}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {getDateStringFromTimestamp(chat.date)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full md:w-2/3 flex-grow flex flex-col justify-end p-4 max-sm:p-0">
          {selectedChat && selectedChatUser && (
            <>
              <div className="flex flex-col px-8 gap-4 overflow-auto">
                {messages.map((message: Message) => {
                  return (
                    <div
                      key={message.id + message.senderId}
                      className={clsx(
                        'flex gap-5 items-end mt-2',
                        message.senderId === currentUserDetails.id
                          ? 'justify-start mr-10'
                          : 'justify-end ml-10'
                      )}
                    >
                      <Avatar
                        src={
                          message.senderId === currentUserDetails.id
                            ? currentUserDetails.photoURL || ''
                            : selectedChatUser.photoURL || ''
                        }
                        className={clsx(
                          message.senderId === currentUserDetails.id
                            ? 'order-first left-0'
                            : 'order-last right-0',
                          'shadow-black shadow-sm'
                        )}
                      />
                      <div
                        className={clsx(
                          'flex flex-col',
                          message.senderId === currentUserDetails.id ? 'items-start' : 'items-end'
                        )}
                      >
                        <div
                          className={clsx(
                            message.senderId === currentUserDetails.id
                              ? 'bg-blue-200 rounded-br-xl'
                              : 'bg-[#e3e7db] rounded-bl-xl',
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
                  );
                })}
                <div ref={endOfMessagesRef} />
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
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <IconButton className="aspect-square" onClick={handleSendMessage}>
                  <SendOutlinedIcon />
                </IconButton>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface MessagesProps {}

export default Messages;
