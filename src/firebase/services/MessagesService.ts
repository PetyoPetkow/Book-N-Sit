import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { firestore } from '../firebase';
import UserChat from '../../global/models/messages/UserChat';
import { uniqueId } from 'lodash';
import Message from '../../global/models/messages/Message';

const getMessages = async (combinedId: string) => {
  try {
    const messagesRef = doc(firestore, 'messages', combinedId);
    const messagesSnap = await getDoc(messagesRef);

    return messagesSnap.exists() ? (messagesSnap.data().massages as Message[]) : null;
  } catch (error) {
    console.error(`Failed to get messages by ID ${combinedId}:`, error);
    throw new Error(`Failed to fetch messages: ${error}`);
  }
};

const getUserChats = async (userId: string) => {
  try {
    const userChatRef = doc(firestore, 'userChats', userId);
    const userChatSnap = await getDoc(userChatRef);

    return userChatSnap.exists() ? (userChatSnap.data().chats as UserChat[]) : null;
  } catch (error) {
    console.error(`Failed to get userChat by ID ${userId}:`, error);
    throw new Error(`Failed to fetch userChat: ${error}`);
  }
};

const createMessage = async (messageId: string, senderId: string, text: string) => {
  const message: Message = {
    id: uniqueId(),
    text: text,
    senderId: senderId,
    date: Timestamp.now(),
  };

  await setDoc(doc(firestore, 'messages', messageId), { messages: [message] });
};

const createUserChat = async (userId: string, userChat: UserChat) => {
  await setDoc(doc(firestore, 'userChats', userId), {
    chats: [userChat],
  });
};

const appendMessages = async (chatId: string, senderId: string, text: string) => {
  const message: Message = {
    id: uniqueId(),
    text: text,
    senderId: senderId,
    date: Timestamp.now(),
  };

  await updateDoc(doc(firestore, 'messages', chatId), {
    messages: arrayUnion(message),
  });
};

const appendUserChat = async (userId: string, userChat: UserChat) => {
  await updateDoc(doc(firestore, 'userChats', userId), {
    chats: arrayUnion(userChat),
  });
};

const updateUserChat = async (userId: string, userChats: UserChat[]) => {
  setDoc(doc(firestore, 'userChats', userId), { chats: userChats }, { merge: true });
};

const subscribeToMessages = (chatId: string, onMessagesUpdate: (messages: Message[]) => void) => {
  const docRef = doc(firestore, 'messages', chatId);

  const unsubscribe = onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      onMessagesUpdate(doc.data().messages as Message[]);
    }
  });

  return unsubscribe;
};

const subscribeToUserChats = (
  userId: string,
  onUserChatsUpdate: (userChats: UserChat[]) => void
) => {
  const docRef = doc(firestore, 'userChats', userId);

  const unsubscribe = onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      onUserChatsUpdate(doc.data().chats as UserChat[]);
    }
  });

  return unsubscribe;
};

export {
  getMessages,
  getUserChats,
  createMessage,
  createUserChat,
  appendMessages,
  appendUserChat,
  updateUserChat,
  subscribeToMessages,
  subscribeToUserChats,
};
