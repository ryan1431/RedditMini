import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type Query = 'after' | 'feed' | 'sort';

// interface Sub { 
//   name: string,
//   iconUrl: string,
// }
interface QueryState {
  after: string,
  feed: string,
  sort: string,
}

const initialState: QueryState = {
  after: '',
  feed: 'home',
  sort: 'best',
}

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<[string, Query]>) => {
      state[action.payload[1]] = action.payload[0];
    },
  }
});

export const { setQuery } = querySlice.actions;

export default querySlice.reducer;