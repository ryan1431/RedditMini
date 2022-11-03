import { createSlice, PayloadAction } from "@reduxjs/toolkit"

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
  subreddits: ['todayilearned', 'askreddit'],
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
      console.log('removing ' + action.payload);
      state.subreddits = state.subreddits.filter((sub) => sub !== action.payload);
    }
  }
});

export const { setQuery, addSubreddit, removeSubreddit } = querySlice.actions;

export default querySlice.reducer;