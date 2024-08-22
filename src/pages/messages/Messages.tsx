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
import { format } from 'date-fns';
import moment from 'moment';

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
  const [users, setUsers] = useState<{ displayName: string; photoURL: string; id: string }[]>([]);

  const [search, setSearch] = useState<string>('');

  const [selectedChat, setSelectedChat] = useState<{ chatId: string; userId: string } | null>(null);
  const [messages, setMessages] = useState<
    { date: Timestamp; id: string; senderId: string; text: string }[]
  >([]);

  const { currentUser } = useAuth();

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

      setUsers(users as any);
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
            doc.data().messages as { date: Timestamp; id: string; senderId: string; text: string }[]
          );
      });

      return () => {
        unSub();
      };
    }
  }, [selectedChat]);

  const chatsToShow = useMemo(() => {
    const chatsCopy = structuredClone(chats);

    const filteredUsers = users.filter((u: any) =>
      u.displayName?.toLowerCase().includes(search.toLowerCase())
    );

    const filteredUserIds = filteredUsers.map((u: any) => u.id);

    const filteredChats =
      search === ''
        ? chatsCopy
        : chatsCopy.filter((chat: any) => filteredUserIds.includes(chat.userId));

    return filteredChats;
  }, [search, chats, users]);

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
        const updateUserChats = async (userId: string, otherUserId: string) => {
          const userChatsRef = doc(firestore, 'userChats', userId);
          const userChatsRes = await getDoc(userChatsRef);
          const chats = userChatsRes.data()?.chats || [];

          const updatedChats = chats.map((chat: any) => {
            return chat.chatId === selectedChat.chatId
              ? {
                  chatId: selectedChat.chatId,
                  userId: chat.userId,
                  lastSenderId: currentUser.uid,
                  lastMessage: text,
                  date: Timestamp.now(),
                }
              : chat;
          });

          await updateDoc(userChatsRef, { chats: updatedChats });
        };

        // Update sender's userChats
        await updateUserChats(currentUser.uid, selectedChat.userId);
        console.log('Sender chat updated successfully.');

        // Update receiver's userChats
        await updateUserChats(selectedChat.userId, currentUser.uid);
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
            {chatsToShow.map((chat: any) => {
              const user = users.find((u) => u.id === chat.userId);
              return (
                <div
                  className={clsx(
                    chat.chatId === selectedChat?.chatId ? 'bg-opacity-80' : '',
                    'flex gap-3 p-2 mx-5 rounded-lg bg-white hover:bg-gray-300 hover:cursor-pointer'
                  )}
                  onClick={() => setSelectedChat(chats.find((c) => c.chatId === chat.chatId)!)}
                >
                  <Avatar src={user?.photoURL} />
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
                {messages &&
                  messages.map((m, i) => {
                    const user = users.find((u: any) => u.id === selectedChat.userId);
                    return (
                      <div
                        className={clsx(
                          'flex gap-5 items-end',
                          m.senderId === currentUser.uid
                            ? 'justify-start mr-20 '
                            : 'justify-end ml-20 '
                        )}
                      >
                        <Avatar
                          src={
                            m.senderId === currentUser.uid
                              ? currentUser.photoURL || ''
                              : user?.photoURL || ''
                          }
                          className={clsx(
                            m.senderId === currentUser.uid
                              ? 'order-first left-0'
                              : 'order-last right-0'
                          )}
                        />
                        <Tooltip
                          title={format(new Date(m.date.seconds * 1000), 'HH:mm dd/MM/yyyy')}
                          placement="top"
                        >
                          <div className="flex flex-col">
                            <div
                              className={clsx(
                                m.senderId === currentUser.uid
                                  ? 'bg-blue-200 rounded-br-xl'
                                  : 'bg-[#F3F7EC] rounded-bl-xl',
                                'rounded-t-xl p-1 px-3 w-fit'
                              )}
                            >
                              {m.text}
                            </div>
                            <div className="text-xs text-gray-600">
                              {moment(new Date(m.date.seconds * 1000)).fromNow()}
                            </div>
                          </div>
                        </Tooltip>
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
