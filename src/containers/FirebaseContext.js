import { createContext } from 'react';

const firebaseContext = createContext({
  firebase: null,
  auth: null,
  database: null,
  firestore: null,
});

const { Provider, Consumer } = firebaseContext;

firebaseContext.displayName = 'Firebase';

export { Provider, Consumer };
export default firebaseContext;