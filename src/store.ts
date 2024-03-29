import { enableBatching } from './interface/reducers/batching';
import { createStore, type Store } from 'redux';
import reducers from './interface/reducers';

declare var window;
export const store: Store<any> = createStore(
      enableBatching(reducers),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
