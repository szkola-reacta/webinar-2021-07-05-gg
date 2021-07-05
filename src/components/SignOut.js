import { useContext } from 'react';
import { Button } from '@chakra-ui/react';

import FirebaseContext from '../containers/FirebaseContext';

function SignOut() {
  const { auth, database } = useContext(FirebaseContext);
  const { uid } = auth.currentUser;
  const usersDatabaseRef = database().ref(`/users/${uid}`);
  const offlineUser = {
    state: 'offline',
    last_changed: database.ServerValue.TIMESTAMP
  }

  const handleClick = async () => {
    // TODO: implement
    await usersDatabaseRef.update(offlineUser);
    auth.signOut();
  }

  return auth.currentUser && (
    <Button variant="ghost" onClick={handleClick}>Sign out</Button>
  )
}

export default SignOut;
