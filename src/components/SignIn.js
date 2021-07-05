import { useContext } from 'react';

import FirebaseContext from '../containers/FirebaseContext';

function SignIn() {
  const { firebase, auth } = useContext(FirebaseContext);
  const signInWithGoogle = () => {
    // TODO: implement
  }
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  );
}

export default SignIn;
