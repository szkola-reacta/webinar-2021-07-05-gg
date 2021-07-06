import { useEffect, useState, useContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button, Input, Flex, Box, Text } from '@chakra-ui/react';

import FirebaseContext from '../containers/FirebaseContext';
import Users from './Users';
import SignIn from './SignIn';
import SingOut from './SignOut';
import ChatRoom from './ChatRoom';
import MuteButton from './MuteButton';

function Main() {
  const { firebase, auth } = useContext(FirebaseContext);
  const [textStatus, setTextStatus] = useState('');
  const [customName, setCustomName] = useState('');

  const [user] = useAuthState(auth);

  const handleStatusChange = (event) => {
    setTextStatus(event.target.value);
  }
  const handleCustomNameChange = (event) => {
    setCustomName(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: implement
    const { uid } = auth.currentUser;
    const usersDatabaseRef = firebase.database().ref(`/users/${uid}`);
    usersDatabaseRef.update({ textStatus, customName });
  }

  useEffect(() => {
    if (user) {
      // user.displayName
      // user.photoURL

      const { uid, displayName } = auth.currentUser;

      const usersDatabaseRef = firebase.database().ref(`/users/${uid}`);
      const usersFirestoreRef = firebase.firestore().doc(`/users/${uid}`);

      // Firestore uses a different server timestamp value, so we'll
      // create two more constants for Firestore state.
      const isOfflineForFirestore = {
        state: 'offline',
        displayName,
        customName: '',
        textStatus: '',
        last_changed: firebase.firestore.FieldValue.serverTimestamp(),
      };

      const isOnlineForFirestore = {
        state: 'online',
        displayName,
        customName: '',
        textStatus: '',
        last_changed: firebase.firestore.FieldValue.serverTimestamp(),
      };

      const isOfflineForDatabase = {
        state: 'offline',
        displayName,
        customName: '',
        textStatus: '',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };

      const isOnlineForDatabase = {
        state: 'online',
        displayName,
        customName: '',
        textStatus: '',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };

      firebase.database().ref('.info/connected').on('value', (snapshot) => {
        if (snapshot.val() === false) {
          // Instead of simply returning, we'll also set Firestore's state
          // to 'offline'. This ensures that our Firestore cache is aware
          // of the switch to 'offline.'

          usersFirestoreRef.set(isOfflineForFirestore);
          return;
        };

        usersDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(() => {
            usersDatabaseRef.set(isOnlineForDatabase);

            // We'll also add Firestore set here for when we come online.
            usersFirestoreRef.set(isOnlineForFirestore);
        });
      });
    }
  }, [auth.currentUser]);

  const renderApp = () => {
    if (!user) {
      return (
        <Box w="100%">
          <Box textAlign="right" mr={4}><SignIn /></Box>
          <Box p={4}>
            <Text>You need to signin first</Text>
          </Box>
        </Box>
      );
    }
    return (
      <>
        <Users />
        <Box w="100%">
          <Box textAlign="right" mr={4}><MuteButton /><SingOut /></Box>
          <Box mb={4}>
            <form onSubmit={handleSubmit}>
            <Box>
              <Text>Change your status and display name</Text>
            </Box>
            <Flex>
              <Input placeholder="status..." onChange={handleStatusChange} />
              <Input placeholder="name..." onChange={handleCustomNameChange} />
              <Button type="sumit">Send</Button>
            </Flex>
            </form>
          </Box>
          <ChatRoom />
        </Box>
      </>
    );
  }

  return (
    <Flex>
      {renderApp()}
    </Flex>
  );
}

export default Main;
