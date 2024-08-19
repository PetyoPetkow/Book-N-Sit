import { Avatar, Divider, IconButton, OutlinedInput, TextField } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import clsx from 'clsx';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { useAuth } from '../../contexts/authContext';
import { firestore } from '../../firebase/firebase';
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { getUserById } from '../../firebase/services/UserService';
import { uniqueId } from 'lodash';

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
  const [chatsWithUsers, setChatsWithUsers] = useState<
    {
      chatId: string;
      lastSenderId: string;
      lastMessage: string;
      date: Timestamp;
      user: {
        username: string;
        photoURL: string;
      };
    }[]
  >([]);
  const [filteredChats, setFilteredChats] = useState<
    {
      chatId: string;
      lastSenderId: string;
      lastMessage: string;
      date: Timestamp;
      user: {
        username: string;
        photoURL: string;
      };
    }[]
  >([]);
  const [selectedChat, setSelectedChat] = useState<{ chatId: string; userId: string } | null>(null);
  const [messages, setMessages] = useState<
    { date: Date; id: string; senderId: string; text: string }[]
  >([]);

  const { currentUser } = useAuth();
  //@ts-ignore
  useEffect(() => {
    const fetchUsers = async () => {
      const users = await Promise.all(
        chats.map(async (chat) => {
          const user = await getUserById(chat.userId);
          return {
            chatId: chat.chatId,
            lastSenderId: chat.lastSenderId,
            lastMessage: chat.lastMessage,
            date: chat.date,
            user: { username: user?.username, photoURL: user?.photoURL },
          };
        })
      );

      setChatsWithUsers(users);
      setFilteredChats(users);
    };

    fetchUsers();
  }, [chats]);

  useEffect(() => {
    if (currentUser) {
      const unSub = onSnapshot(doc(firestore, 'userChats', currentUser.uid), (doc) => {
        doc.exists() &&
          setChats(
            doc.data().chats as {
              chatId: string;
              userId: string;
              lastSenderId: string;
              lastMessage: string;
              date: Timestamp;
            }[]
          );
      });

      return () => {
        unSub();
      };
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedChat) {
      const unSub = onSnapshot(doc(firestore, 'messages', selectedChat.chatId), (doc) => {
        doc.exists() &&
          setMessages(
            doc.data().messages as { date: Date; id: string; senderId: string; text: string }[]
          );
      });

      return () => {
        unSub();
      };
    }
  }, [selectedChat]);

  const handleSearch = (value: string) => {
    const chatsCopy = structuredClone(chatsWithUsers);

    const result = chatsCopy.filter((chat: any) =>
      chat.user.username.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredChats(value !== '' ? result : chatsCopy);
  };

  const handleSendMessage = async () => {
    if (currentUser && selectedChat) {
      try {
        // 1. Update the messages array in the chat document
        await updateDoc(doc(firestore, 'messages', selectedChat.chatId), {
          messages: arrayUnion({
            id: uniqueId(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });

        // Helper function to update userChats
        const updateUserChats = async (userId: string) => {
          const userChatsRef = doc(firestore, 'userChats', userId);
          const userChatsRes = await getDoc(userChatsRef);
          const chats = userChatsRes.data()?.chats || [];

          const updatedChats = chats.map((chat: any) =>
            chat.chatId === selectedChat.chatId
              ? {
                  chatId: selectedChat.chatId,
                  userId: selectedChat.userId,
                  lastSenderId: currentUser.uid,
                  lastMessage: text,
                  date: Timestamp.now(),
                }
              : chat
          );

          await updateDoc(userChatsRef, { chats: updatedChats });
        };

        // Update sender's userChats
        await updateUserChats(currentUser.uid);
        console.log('Sender chat updated successfully.');

        // Update receiver's userChats
        await updateUserChats(selectedChat.userId);
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

  return (
    <div className="border border-solid border-red h-full w-full flex">
      <div className="w-1/3 flex flex-col bg-gray-200">
        <div className="flex">
          <OutlinedInput
            className="flex-1 rounded-full m-7"
            size="small"
            startAdornment={<SearchIcon />}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Divider className="mx-7" />
        <div className="flex flex-col gap-5 mt-7">
          {filteredChats.map((chat) => {
            console.log('helll', chats);
            return (
              <div
                className="flex p-2 mx-5 rounded-lg hover:bg-gray-300 hover:cursor-pointer"
                onClick={() => setSelectedChat(chats.find((c) => c.chatId === chat.chatId)!)}
              >
                <Avatar src={chat.user.photoURL} />
                <div className="flex flex-col flex-grow">
                  <div className="font-bold">{chat.user.username}</div>
                  <div className="text-sm text-gray-800">{chat.lastMessage}</div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(chat.date?.seconds * 1000).toDateString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-2/3 flex flex-col">
        <div className="flex flex-col p-16 gap-4 overflow-auto">
          {messages &&
            messages.map((m, i) => {
              return (
                <div
                  className={clsx(
                    'flex gap-5 items-end',
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
                      m.senderId === currentUser?.uid
                        ? 'bg-blue-200 rounded-br-xl'
                        : 'bg-red-200 rounded-bl-xl',
                      'p-2 rounded-t-xl'
                    )}
                  >
                    {m.text}
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
          />
          <IconButton className="aspect-square" onClick={handleSendMessage}>
            <SendOutlinedIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

interface MessagesProps {}

export default Messages;

const messages = [
  {
    sender: 'me',
    text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  },
  { sender: 'me', text: 'Ut enim ad minima veniam' },
  {
    sender: 'them',
    text: 'Fusce pulvinar felis ut ante aliquam lobortis. Donec gravida finibus nulla quis facilisis.',
  },
  {
    sender: 'them',
    text: 'Ut consectetur.',
  },
  {
    sender: 'me',
    text: 'Aenean sit amet dictum justo.',
  },
  {
    sender: 'me',
    text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  },
  { sender: 'me', text: 'Ut enim ad minima veniam' },
  {
    sender: 'them',
    text: 'Fusce pulvinar felis ut ante aliquam lobortis. Donec gravida finibus nulla quis facilisis.',
  },
  {
    sender: 'them',
    text: 'Ut consectetur.',
  },
  {
    sender: 'me',
    text: 'Aenean sit amet dictum justo.',
  },
  {
    sender: 'me',
    text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  },
  { sender: 'me', text: 'Ut enim ad minima veniam' },
  {
    sender: 'them',
    text: 'Fusce pulvinar felis ut ante aliquam lobortis. Donec gravida finibus nulla quis facilisis.',
  },
  {
    sender: 'them',
    text: 'Ut consectetur.',
  },
  {
    sender: 'me',
    text: 'Aenean sit amet dictum justo.',
  },
];
