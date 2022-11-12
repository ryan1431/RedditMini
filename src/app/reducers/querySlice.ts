import { createSlice, PayloadAction } from "@reduxjs/toolkit"
interface QueryState {
  after: string,
  feed: string,
  sort: string,
}

export const initialState: QueryState = {
  after: '',
  feed: 'home',
  sort: 'best',
}

let savedState: QueryState | undefined;

try {
  savedState = {...JSON.parse(localStorage.getItem('query') as string), after: ''} as QueryState;
} catch(e) {
  // No saved state
}

export const queryReducer = createSlice({
  name: 'query',
  initialState: {...initialState, ...savedState} || initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<[string, keyof QueryState]>) => {
      state[action.payload[1]] = action.payload[0];
    },
  }
});


export { savedState }
export const { setQuery } = queryReducer.actions;

export default queryReducer.reducer;