import { createSlice, PayloadAction } from "@reduxjs/toolkit"
type Query = 'after' | 'feed' | 'sort';

// interface Sub { 
//   name: string,
//   iconUrl: string,
// }
interface QueryState {
  version: number,
  after: string,
  feed: string,
  sort: string,
}

const initialState: QueryState = {
  version: 1,
  after: '',
  feed: 'home',
  sort: 'best',
}

let savedState: QueryState | undefined;
try {
  savedState = JSON.parse(localStorage.getItem('query') as string) as QueryState;
  if (savedState.version !== initialState.version) savedState = undefined;
} catch(e) {
  // No saved state
}

export const queryReducer = createSlice({
  name: 'query',
  initialState: savedState || initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<[string, Query]>) => {
      state[action.payload[1]] = action.payload[0];
    },
  }
});

export const { setQuery } = queryReducer.actions;

export default queryReducer.reducer;