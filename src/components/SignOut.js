import { useContext } from 'react';
import { Button } from '@chakra-ui/react';

import FirebaseContext from '../containers/FirebaseContext';

function SingOut() {
  const { auth } = useContext(FirebaseContext);

  const handleClick = async () => {
    // TODO: implement
  }

  return auth.currentUser && (
    <Button variant="ghost" onClick={handleClick}>Sign out</Button>
  )
}

export default SingOut;
