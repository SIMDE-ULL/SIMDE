import { enableBatching } from './interface/reducers/batching';
import { createStore } from 'redux';
import { SuperescalarReducers } from './interface/reducers';
import { Store } from 'redux';

declare var window;
export let store: Store<any> = createStore(
      enableBatching(SuperescalarReducers),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
