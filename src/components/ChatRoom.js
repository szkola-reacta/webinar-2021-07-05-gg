import { useState, useRef, useContext, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import useSound from 'use-sound';
import { Button, Input} from '@chakra-ui/react';

import FirebaseContext from '../containers/FirebaseContext';
import UIContext from '../containers/UIContext';
import ChatMessage from './ChatMessage';

function ChatRoom() {
  const { firebase, auth, firestore } = useContext(FirebaseContext);
  const { muted } = useContext(UIContext);
  const [formValue, setFormValue] = useState('');
  const bottom = useRef();
  // const [messages, setMessages] = useState([]); // TODO: implement
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt'); // .limit(25)
  const [messages] = useCollectionData(query, { idField: 'id'});

  const [playSound] = useSound(
    '/sounds/wiadomosc.mp3',
    { volume: 0.25 }
  );

  const watchUsers = async () => {
    firebase.firestore().collection('messages')
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const { uid: docUid } = change.doc.data();
          const { uid } = auth.currentUser;
          if (!muted && docUid !== uid) {
            playSound();
          }
        }
      })
    })
  }

  useEffect(() => {
    watchUsers();
  }, []);

  const sendMessage = async(event) => {
    event.preventDefault();

     // TODO: implement
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
          <Input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
          <Button type="submit">Send</Button>
      </form>
    </div>
  );
}

export default ChatRoom;
