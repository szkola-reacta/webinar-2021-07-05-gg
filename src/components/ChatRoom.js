import { useState, useRef, useContext, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import useSound from 'use-sound';
import { Box, Button, Input, Flex } from '@chakra-ui/react';

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

    const { uid, photoURL, displayName } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      displayName,
    });

    setFormValue('');
    if (bottom.current) {
      bottom.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <Box>
      <Box mb={3}>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={bottom}></div>
      </Box>
      <Box>
        <form onSubmit={sendMessage}>
          <Flex mb={3}>
            <Input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
            <Button type="submit">Send</Button>
          </Flex>
        </form>
      </Box>
    </Box>
  );
}

export default ChatRoom;
