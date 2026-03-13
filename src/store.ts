import { enableBatching } from './interface/reducers/batching';
import { createStore, Store } from 'redux';
import reducers from './interface/reducers';

const devToolsEnhancer =
  typeof window !== "undefined" && (window as any).__REDUX_DEVTOOLS_EXTENSION__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    : undefined;

export let store: Store<any> = createStore(
  enableBatching(reducers),
  devToolsEnhancer,
);
