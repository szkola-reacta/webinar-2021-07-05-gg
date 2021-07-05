import { useEffect, useContext, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import useSound from 'use-sound';
import { Box, List } from '@chakra-ui/react';

import FirebaseContext from '../containers/FirebaseContext';
import UIContext from '../containers/UIContext';
import User from './User';

function Users() {
  const { firebase, firestore } = useContext(FirebaseContext);
  const [users, setUsers] = useState([]); // TODO: get from database

  return (
    <Box w={300} mr={3}>
      <List>
        {users && users.map(user => <User key={user.id} data={user} />)}
      </List>
    </Box>
  );
}

export default Users;
