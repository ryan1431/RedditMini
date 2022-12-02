import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Cache, cachedPosts, CachedPosts, Sort } from "../../types/querySliceTypes";
import { getFeedPosts, PostType } from "../../utility";
import { RootState } from "../store/store";

import uuid from 'react-uuid';

interface QueryState {
  after: string,
  feed: string,
  sort: string,
  feedPosts: PostType[],
  cachedPosts: CachedPosts,
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
  cachedPosts,
  fetching: false,
  isLastRequest: false,
  add: false,
}

export const fetchFeed = createAsyncThunk(
  'query/fetchFeed',
  async ({url, feed, sort}: {url: string, feed: string, sort: string}, _api) => {
    
    const after = (_api.getState() as RootState).query.after;
    const params = new URLSearchParams();

    params.set('limit', '10');
    if (after) { 
      params.set('after', after);
      _api.dispatch(setAdd(true));
    }

    const response = await getFeedPosts(`${url}?${params.toString()}`);
    return {
      data: response,
      feed,
      sort,
    };
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
    clearCachedPosts: (state) => {
      state.cachedPosts = cachedPosts;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.fetching = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action: PayloadAction<{data: {posts: PostType[],after: string}, feed: string, sort: string}>) => {
        const { feed, sort, data } = action.payload;

        if (feed !== state.feed) {
          state.fetching = false;
          return;
        } else {
          const cached = state.cachedPosts[sort as Sort];
          if (!cached.after) {
            const cache: Cache = {
              after: data.after,
              posts: data.posts,
            }
            state.cachedPosts[sort as Sort] = cache;
            state.fetching = false;
          }
        }
        
        if (sort !== state.sort) {
          return;
        }
        
        state.after = data.after;

        const uidPosts = data.posts.map(p => ({...p, uid: `${state.after}-${p.link}-${uuid()}`}));

        state.feedPosts = state.add
          ? [...state.feedPosts, ...uidPosts]
          : uidPosts;

        state.fetching = false;
      })
    .addCase(fetchFeed.rejected, (state) => {
      state.fetching = false;
    });
  }
});

export const { setQuery, setFeedPosts, setAdd, setLastRequest, clearCachedPosts } = queryReducer.actions;
export default queryReducer.reducer;