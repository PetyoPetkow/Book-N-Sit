import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { firestore } from '../firebase';
import UserChat from '../../global/models/messages/UserChat';
import { uniqueId } from 'lodash';
import Message from '../../global/models/messages/Message';

const createUserChat = async (userId: string, userChat: UserChat) => {
  await setDoc(doc(firestore, 'userChats', userId), {
    chats: [userChat],
  });
};

const updateUserChat = async (userId: string, userChat: UserChat) => {
  setDoc(doc(firestore, 'userChats', userId), { chats: userChat }, { merge: true });
};

const appendUserChat = async (userId: string, userChat: UserChat) => {
  await updateDoc(doc(firestore, 'userChats', userId), {
    chats: arrayUnion(userChat),
  });
};

const removeUserChat = async (userId: string, userChat: UserChat) => {
  await updateDoc(doc(firestore, 'userChats', userId), {
    chats: arrayRemove(userChat),
  });
};

///const createMessage ...

const getMessages = async () => {};

export const subscribeToUserChats = (
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

export const subscribeToMessages = (
  chatId: string,
  onMessagesUpdate: (messages: Message[]) => void
) => {
  const docRef = doc(firestore, 'messages', chatId);

  const unsubscribe = onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      onMessagesUpdate(doc.data().messages as Message[]);
    }
  });

  return unsubscribe;
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

const createMessage = async (messageId: string, senderId: string, text: string) => {
  const message: Message = {
    id: uniqueId(),
    text: text,
    senderId: senderId,
    date: Timestamp.now(),
  };

  await setDoc(doc(firestore, 'messages', messageId), { messages: [{ message }] });
};

export {
  createUserChat,
  appendUserChat,
  removeUserChat,
  updateUserChat,
  createMessage,
  appendMessages,
};
