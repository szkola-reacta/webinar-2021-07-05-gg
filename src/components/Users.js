import { useEffect, useContext, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import useSound from 'use-sound';
import { Box, List } from '@chakra-ui/react';

import FirebaseContext from '../containers/FirebaseContext';
import UIContext from '../containers/UIContext';
import User from './User';

function Users() {
  const { firebase, firestore } = useContext(FirebaseContext);
  const { muted } = useContext(UIContext);
  const usersRef = firestore.collection('users');
  const query = usersRef.orderBy('displayName');
  const [users] = useCollectionData(query, { idField: 'id' });
  // const [users, setUsers] = useState([]); // TODO: get from database

  const [playSound] = useSound(
    '/sounds/dostepny.mp3',
    { volume: 0.25 }
  );

  const watchUsers = async () => {
    firebase.firestore().collection('users')
    .where('state', '==', 'online')
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          if (!muted) {
            playSound();
          }
        }
      })
    })
  }

  useEffect(() => {
    watchUsers();
  }, []);

  return (
    <Box w={300} mr={3}>
      <List>
        {users && users.map(user => <User key={user.id} data={user} />)}
      </List>
    </Box>
  );
}

export default Users;
