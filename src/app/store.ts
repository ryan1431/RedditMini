import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
// import counterReducer from '../features/counter (ref)/counterSlice';
import queryReducer from '../features/querySlice';
import savedSlice from '../features/savedSlice';
import subredditsSlice from '../features/subredditsSlice';

export const store = configureStore({
  reducer: {
    query: queryReducer,
    saved: savedSlice,
    subreddits: subredditsSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
