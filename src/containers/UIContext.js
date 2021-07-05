import { createContext } from 'react';

const uiContext = createContext({
  muted: true,
  setMuted: () => null,
});

const { Provider, Consumer } = uiContext;

uiContext.displayName = 'UI';

export { Provider, Consumer };
export default uiContext;