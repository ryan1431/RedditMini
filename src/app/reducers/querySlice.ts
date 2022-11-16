import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getFeedPosts, PostType } from "../../utility";
import { RootState } from "../store/store";
interface QueryState {
  after: string,
  feed: string,
  sort: string,
  feedPosts: PostType[],
  fetching: boolean,
  add: boolean,
}

type SetQuery = 'after' | 'feed' | 'sort';

export const initialState: QueryState = {
  after: '',
  feed: 'home',
  sort: 'best',
  feedPosts: [],
  fetching: false,
  add: false,
}

let savedState: QueryState | undefined;
try {
  savedState = {...JSON.parse(localStorage.getItem('query') as string), after: ''} as QueryState;
} catch(e) {
  // No saved state
}

export const fetchFeed = createAsyncThunk(
  'query/fetchFeed',
  async (url: string, _api) => {
    const after = (_api.getState() as RootState).query.after;
    const params = new URLSearchParams();

    params.set('limit', '10');
    if (after) { 
      params.set('after', after);
      _api.dispatch(setAdd(true));
    }

    const response = await getFeedPosts(`${url}?${params.toString()}`);
    return response;
  }
)

export const queryReducer = createSlice({
  name: 'query',
  initialState: {...initialState, ...savedState} || initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<[SetQuery, string]>) => {
      state[action.payload[0]] = action.payload[1];
    },
    setFeedPosts: (state, action: PayloadAction<PostType[]>) => {
      state.feedPosts = action.payload;
    },
    setAdd: (state, action: PayloadAction<boolean>) => {
      state.add = action.payload;
    },
    setFetching: (state, action: PayloadAction<boolean>) => {
      state.fetching = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.fulfilled, (state, action: PayloadAction<{posts: PostType[],after: string}>) => {
        const res = action.payload;
        
        state.after = res.after;

        state.feedPosts = state.add
          ? [...state.feedPosts, ...res.posts]
          : res.posts;

        state.add = false;

        state.fetching = false;
      });
  }
});

export { savedState }
export const { setQuery, setFeedPosts, setAdd, setFetching } = queryReducer.actions;

export default queryReducer.reducer;