import { useState, useRef, useContext, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import useSound from 'use-sound';
import { Button, Input} from '@chakra-ui/react';

import FirebaseContext from '../containers/FirebaseContext';
import UIContext from '../containers/UIContext';
import ChatMessage from './ChatMessage';

function ChatRoom() {
  const { firebase, auth, firestore } = useContext(FirebaseContext);
  const [formValue, setFormValue] = useState('');
  const bottom = useRef();
  const [messages, setMessages] = useState([]); // TODO: implement

  const sendMessage = async(event) => {
    event.preventDefault();

     // TODO: implement
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
