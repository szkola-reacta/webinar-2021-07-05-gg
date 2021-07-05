import { useContext } from 'react';

import FirebaseContext from '../containers/FirebaseContext';

function SignIn() {
  const { firebase, auth } = useContext(FirebaseContext);
  const signInWithGoogle = () => {
    // TODO: implement
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  );
}

export default SignIn;
