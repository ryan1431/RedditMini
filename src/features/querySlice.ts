import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../app/store";

type Query = 'after' | 'feed' | 'sort';

interface QueryState {
  after: string,
  feed: string,
  sort: string,
  subreddits: string[],
}

const initialState: QueryState = {
  after: '',
  feed: 'home',
  sort: 'best',
  subreddits: [],
}

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<[string, Query]>) => {
      state[action.payload[1]] = action.payload[0];
    },
    addSubreddit: (state, action: PayloadAction<string>) => {
      state.subreddits.push(action.payload);
    },
    removeSubreddit: (state, action: PayloadAction<string>) => {
      let index = state.subreddits.indexOf(action.payload);
      if (index !== -1) {
        state.subreddits.splice(index, 1);
      }
    }
  }
});

export const selectAfter = (state:RootState) => state.query.after;
export const selectFeed = (state:RootState) => state.query.feed;
export const selectSort = (state:RootState) => state.query.sort;
export const selectSubreddits = (state:RootState) => state.query.subreddits;

export const { setQuery, addSubreddit, removeSubreddit } = querySlice.actions;

export default querySlice.reducer;