
import { useState } from 'react';
import { ChakraProvider } from "@chakra-ui/react"
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';

import Main from './components/Main';
import { Provider as FirebaseProvider } from './containers/FirebaseContext';
import { Provider as UIProvider } from './containers/UIContext';
import { firebaseConfig } from './firebaseConfig';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const firebaseSettings = {
  firebase,
  auth: firebase.auth(),
  database: firebase.database,
  firestore: firebase.firestore(),
}

function App() {
  const [muted, setMuted] = useState(true);

  return (
    <FirebaseProvider value={firebaseSettings}>
      <UIProvider value={{ muted, setMuted }}>
        <ChakraProvider>
          <Main />
        </ChakraProvider>
      </UIProvider>
    </FirebaseProvider>
  );
}

export default App;
