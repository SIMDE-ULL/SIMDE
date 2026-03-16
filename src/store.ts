import { configureStore } from '@reduxjs/toolkit';
import { enableBatching } from './interface/reducers/batching';
import reducers from './interface/reducers';

/** Creates a new Redux store instance with batched dispatch support. */
export function createAppStore() {
  return configureStore({
    reducer: enableBatching(reducers),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });
}

export const store = createAppStore();

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
