import { Avatar, Divider, IconButton, OutlinedInput, TextField, Tooltip } from '@mui/material';
import { FC, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import clsx from 'clsx';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { useAuth } from '../../contexts/authContext';
import { firestore } from '../../firebase/firebase';
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore';
import { getUserById } from '../../firebase/services/UserService';
import { uniqueId } from 'lodash';
import moment from 'moment';
import UserChat from '../../global/models/messages/UserChat';
import Message from '../../global/models/messages/Message';
import UserDetails from '../../global/models/users/UserDetails';
import {
  appendMessages,
  subscribeToMessages,
  subscribeToUserChats,
  updateUserChat,
} from '../../firebase/services/MessagesService';

const Messages: FC<MessagesProps> = () => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const [text, setText] = useState('');
  const [chats, setChats] = useState<
    {
      chatId: string;
      userId: string;
      lastSenderId: string;
      lastMessage: string;
      date: Timestamp;
    }[]
  >([]);
  const [users, setUsers] = useState<UserDetails[]>([]);

  const [search, setSearch] = useState<string>('');

  const [selectedChat, setSelectedChat] = useState<UserChat | null>(null);
  const [messages, setMessages] = useState<
    { date: Timestamp; id: string; senderId: string; text: string }[]
  >([]);

  const { currentUser, userDetails } = useAuth();

  const selectedChatUser = useMemo(() => {
    return users.find((user) => user.id === selectedChat?.userId);
  }, [users, selectedChat]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' && e.nativeEvent.shiftKey === false) {
      e.preventDefault();
      if (text !== '') {
        handleSendMessage();
        setText('');
      }
    }
  };

  //@ts-ignore
  useEffect(() => {
    const fetchUsers = async () => {
      const users = await Promise.all(
        chats.map(async (chat) => {
          const user = await getUserById(chat.userId);
          return user;
        })
      );

      setUsers(users as UserDetails[]);
    };

    fetchUsers();
  }, [chats]);

  useEffect(() => {
    if (currentUser) {
      const unSub = subscribeToUserChats(currentUser.uid, setChats);

      return () => {
        unSub();
      };
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedChat) {
      const unSub = subscribeToMessages(selectedChat.chatId, setMessages);

      return () => {
        unSub();
      };
    }
  }, [selectedChat]);

  const chatsToShow = useMemo(() => {
    const chatsCopy = structuredClone(chats);

    const filteredUsers = users.filter((u: UserDetails) =>
      u.displayName?.toLowerCase().includes(search.toLowerCase())
    );

    const filteredUserIds = filteredUsers.map((u: UserDetails) => u.id);

    const filteredChats =
      search === ''
        ? chatsCopy
        : chatsCopy.filter((chat: UserChat) => filteredUserIds.includes(chat.userId));

    return filteredChats;
  }, [search, chats, users]);

  const handleSendMessage = async () => {
    if (currentUser && selectedChat) {
      try {
        await appendMessages(selectedChat.chatId, currentUser.uid, text);

        const senderUserChatsRes = await getDoc(doc(firestore, 'userChats', currentUser.uid));
        const receiverUserChatsRes = await getDoc(doc(firestore, 'userChats', selectedChat.userId));

        const senderChat: UserChat = {
          chatId: selectedChat.chatId,
          userId: selectedChat.userId,
          lastSenderId: currentUser.uid,
          lastMessage: text,
          date: Timestamp.now(),
        };

        const receiverChat: UserChat = {
          chatId: selectedChat.chatId,
          userId: currentUser.uid,
          lastSenderId: currentUser.uid,
          lastMessage: text,
          date: Timestamp.now(),
        };

        if (senderUserChatsRes.exists()) {
          const chats = senderUserChatsRes.data().chats || [];

          const updatedChats = chats.map((chat: UserChat) =>
            chat.chatId === selectedChat.chatId ? { ...chat, ...senderChat } : chat
          );

          await updateUserChat(currentUser.uid, updatedChats);
        }

        if (receiverUserChatsRes.exists()) {
          const chats = receiverUserChatsRes.data().chats || [];

          const updatedChats = chats.map((chat: UserChat) =>
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

  if (currentUser === null) return <></>;

  return (
    <div className="flex flex-col items-center justify-center flex-grow bg-white bg-opacity-60 backdrop-blur-lg p-4 ">
      <div className="flex h-[80vh] w-full">
        <div className="w-1/3 flex flex-col bg-gray-200 bg-opacity-80 drop-shadow-md shadow-black ">
          <div className="flex">
            <OutlinedInput
              className="flex-1 rounded-full m-7 bg-white"
              size="small"
              startAdornment={<SearchIcon />}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Divider className="mx-7" />
          <div className="flex flex-col gap-5 mt-7">
            {chatsToShow.map((chat: UserChat) => {
              const user = users.find((u) => u.id === chat.userId);
              return (
                <div
                  className={clsx(
                    chat.chatId === selectedChat?.chatId ? 'bg-opacity-80' : '',
                    'flex gap-3 p-2 mx-5 rounded-lg bg-white hover:bg-gray-300 hover:cursor-pointer'
                  )}
                  onClick={() => setSelectedChat(chats.find((c) => c.chatId === chat.chatId)!)}
                >
                  <Avatar className="shadow-black shadow-sm" src={user?.photoURL} />
                  <div className="flex flex-col flex-grow">
                    <div className="font-bold">{user?.displayName}</div>
                    <div className="text-sm text-gray-800">
                      {chat.lastSenderId === currentUser.uid ? 'You: ' : 'Them: '}
                      {chat.lastMessage}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(chat.date?.seconds * 1000).toDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-2/3 flex-grow flex flex-col justify-end ">
          {selectedChat && (
            <>
              <div className="flex flex-col px-16 gap-4 overflow-auto">
                {messages.map((m: Message) => {
                  return (
                    <div
                      className={clsx(
                        'flex gap-5 items-end mt-2',
                        m.senderId === currentUser?.uid
                          ? 'justify-start mr-20 '
                          : 'justify-end ml-20 '
                      )}
                    >
                      <Avatar
                        src={
                          m.senderId === currentUser.uid
                            ? userDetails?.photoURL || ''
                            : selectedChatUser?.photoURL || ''
                        }
                        className={clsx(
                          m.senderId === currentUser?.uid
                            ? 'order-first left-0'
                            : 'order-last right-0',
                          'shadow-black shadow-sm'
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
