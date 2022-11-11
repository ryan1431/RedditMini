import { configureStore, ThunkAction, Action, createListenerMiddleware } from '@reduxjs/toolkit';
import { savedReducer} from '../features/savedSlice';
import { subredditsReducer } from '../features/subredditsSlice';
import { queryReducer } from '../features/querySlice';

import savedSlice from '../features/savedSlice';
import querySlice from '../features/querySlice';
import subredditsSlice from '../features/subredditsSlice';

const listener = createListenerMiddleware();

listener.startListening({
  predicate(action) { 
    return !!action.type?.startsWith(savedReducer.name);
  },
  effect: (_, api) => {
    localStorage.setItem('saved', JSON.stringify((api.getState() as any)[savedReducer.name]));
  },
});

listener.startListening({
  predicate(action) {
    return !!action.type?.startsWith(queryReducer.name);
  },
  effect: (_, api) => {
    localStorage.setItem('query', JSON.stringify((api.getState() as any)[queryReducer.name]));
  }
});

listener.startListening({
  predicate(action) {
    return action.type === `${subredditsReducer.name}/addSubreddit` || action.type === `${subredditsReducer.name}/removeSubreddit`;
  },
  effect: (_, api) => {
    localStorage.setItem('subreddits/subs', JSON.stringify((api.getState() as any)[subredditsReducer.name].subs));
  }
});

export const store = configureStore({
  reducer: {
    query: querySlice,
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
