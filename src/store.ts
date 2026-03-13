import { enableBatching } from './interface/reducers/batching';
import { createStore, Store } from 'redux';
import reducers from './interface/reducers';

// Guard against server-side execution where `window` is not available.
const devToolsEnhancer =
  typeof window !== "undefined" && (window as any).__REDUX_DEVTOOLS_EXTENSION__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    : undefined;

/** Global Redux store. Uses custom batching to dispatch multiple actions atomically. */
export let store: Store<any> = createStore(
  enableBatching(reducers),
  devToolsEnhancer,
);
