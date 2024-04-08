import { enableBatching } from './interface/reducers/batching';
import { createStore, Store } from 'redux';
import reducers from './interface/reducers';

declare var window;
export let store: Store<any> = createStore(
      enableBatching(reducers),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
