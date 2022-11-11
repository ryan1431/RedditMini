import { configureStore, ThunkAction, Action, createListenerMiddleware } from '@reduxjs/toolkit';
// import counterReducer from '../features/counter (ref)/counterSlice';
import queryReducer from '../features/querySlice';
import { savedReducer} from '../features/savedSlice';
import subredditsSlice from '../features/subredditsSlice';

import savedSlice from '../features/savedSlice';

const listener = createListenerMiddleware();

listener.startListening({
  predicate(action) { 
    return action.type.startsWith(savedReducer.name);
  },
  effect: (_, api) => {
    console.log('adding item');
    localStorage.setItem('saved', JSON.stringify((api.getState() as any)[savedReducer.name]));
  },
});

export const store = configureStore({
  reducer: {
    query: queryReducer,
    saved: savedSlice,
    subreddits: subredditsSlice,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().prepend(listener.middleware);
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
