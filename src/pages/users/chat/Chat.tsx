// Chat.js
import { addDoc, collection, query, orderBy, onSnapshot, DocumentData } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { auth, firestore } from '../../../firebase/firebase';

function Chat({ receiverId }: { receiverId: string }) {
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const q = query(collection(firestore, 'messages'), orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: DocumentData[] = [];
      querySnapshot.forEach((doc) => {
        const message = doc.data();
        if (
          (message.senderId === auth.currentUser?.uid && message.receiverId === receiverId) ||
          (message.senderId === receiverId && message.receiverId === auth.currentUser?.uid)
        ) {
          msgs.push(message);
        }
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [receiverId]);

  const handleSend = async () => {
    if (newMessage.trim() === '') return;

    await addDoc(collection(firestore, 'messages'), {
      senderId: auth.currentUser?.uid,
      receiverId,
      text: newMessage,
      timestamp: new Date(),
    });

    setNewMessage('');
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index} className={msg.senderId === auth.currentUser?.uid ? 'sent' : 'received'}>
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default Chat;
