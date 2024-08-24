import { arrayRemove, arrayUnion, doc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import UserChat from '../../global/models/messages/UserChat';
import { uniqueId } from 'lodash';
import Message from '../../global/models/messages/Message';

const createUserChat = async (userId: string, userChat: UserChat) => {
  await setDoc(doc(firestore, 'userChats', userId), {
    chats: [userChat],
  });
};

const updateUserChat = async (userId: string, userChat: UserChat) => {};

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

const appendMessages = async (chatId: string, message: Message) => {
  await updateDoc(doc(firestore, 'messages', chatId), {
    messages: arrayUnion(message),
  });
};

export { createUserChat, appendUserChat, removeUserChat, appendMessages };
