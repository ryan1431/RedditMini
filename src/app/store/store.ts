import { configureStore, ThunkAction, Action, createListenerMiddleware } from '@reduxjs/toolkit';
import { savedReducer} from '../reducers/savedSlice';
import { subredditsReducer } from '../reducers/subredditsSlice';
import { queryReducer } from '../reducers/querySlice';

import savedSlice from '../reducers/savedSlice';
import querySlice from '../reducers/querySlice';
import subredditsSlice from '../reducers/subredditsSlice';
import commentsSlice from '../reducers/commentsSlice';

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
    return action.type === `${subredditsReducer.name}/toggleSubreddit`;
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
    comments: commentsSlice,
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
