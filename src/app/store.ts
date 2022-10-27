import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
// import counterReducer from '../features/counter (ref)/counterSlice';
import queryReducer from '../features/querySlice';
import savedSlice from '../features/savedSlice';

export const store = configureStore({
  reducer: {
    query: queryReducer,
    saved: savedSlice,
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
