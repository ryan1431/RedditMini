import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getFeedPosts, PostType } from "../../utility";
import { RootState } from "../store/store";
interface QueryState {
  after: string,
  feed: string,
  sort: string,
  feedPosts: PostType[],
  fetching: boolean,
  isLastRequest: boolean,
  add: boolean,
}

export type SetQuery = 'after' | 'feed' | 'sort';

export const initialState: QueryState = {
  after: '',
  feed: 'home',
  sort: 'best',
  feedPosts: [],
  fetching: false,
  isLastRequest: false,
  add: false,
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
  initialState,
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
    setLastRequest: (state, action: PayloadAction<boolean>) => {
      state.isLastRequest = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.fetching = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action: PayloadAction<{posts: PostType[],after: string}>) => {
        if (!state.isLastRequest) {
          state.fetching = false;
          return;
        }

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

export const { setQuery, setFeedPosts, setAdd, setLastRequest } = queryReducer.actions;
export default queryReducer.reducer;