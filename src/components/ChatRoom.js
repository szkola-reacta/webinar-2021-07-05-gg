import { useState, useRef, useContext, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import useSound from 'use-sound';
import { Button, Input, Flex } from '@chakra-ui/react';

import FirebaseContext from '../containers/FirebaseContext';
import UIContext from '../containers/UIContext';
import ChatMessage from './ChatMessage';

function ChatRoom() {
  const { firebase, auth, firestore } = useContext(FirebaseContext);
  const { muted } = useContext(UIContext);
  const bottom = useRef();
  const messagesRef = firestore.collection('messages');
  // const query = messagesRef.orderBy('createdAt').limit(25);
  const query = messagesRef.orderBy('createdAt');
  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  const [playSound] = useSound(
    '/sounds/wiadomosc.mp3',
    { volume: 0.25 }
  );

  const watchMessages = async () => {
    firebase.firestore().collection('messages')
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const { uid: docUid } = change.doc.data();
              const { uid: ownerUid } = auth.currentUser;

              if (!muted && docUid !== ownerUid) {
                playSound();
              }
            }
            if (change.type === 'removed') {

            }
        });
    });
  }

  useEffect(() => {
    watchMessages();
  }, []);

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue('');
    if (bottom.current) {
      bottom.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={bottom}></div>
      </div>
      <form onSubmit={sendMessage}>
        <Flex mb={3}>
          <Input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
          <Button type="submit">Send</Button>
        </Flex>
      </form>
    </div>
  );
}

export default ChatRoom;
