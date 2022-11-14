import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { formatUrl } from "../../utility";
import { base } from "../../utility/data";

import type { Subreddit } from "../../types";

interface SubredditsState {
  subs: Subreddit[],
  searchStatus: string,
  searchResults: Subreddit[],
}

const initialState: SubredditsState = {
  subs: [],
  searchStatus: 'idle',
  searchResults: [],
}

let savedSubs: Subreddit[] | undefined;
try {
  savedSubs = JSON.parse(localStorage.getItem('subreddits/subs') as string) as Subreddit[];
} catch(e) {
  // No saved state
}

export const getSubreddits = createAsyncThunk(
  'subreddits/getSubreddits',
  async (query: string) => {
    const response = await fetch(formatUrl(`${base}search/?q=${query}&type=sr&limit=10`));
    const data = await response.json();

    return data;
  }
);

export const subredditsReducer = createSlice({
  name: 'subreddits',
  initialState: savedSubs ? { ...initialState, subs: savedSubs || []} : initialState,
  reducers: {
    toggleSubreddit: (state, action: PayloadAction<Subreddit>) => {
      let index = state.subs.findIndex((s) => s.name === action.payload.name);
      (index === -1)
        ? state.subs.push(action.payload)
        : state.subs.splice(index, 1)
    },
    setLoading: (state, action: PayloadAction<string>) => {
      state.searchStatus = action.payload;
    }
  }, 
  extraReducers: (builder) => {
    builder
      .addCase(getSubreddits.fulfilled, (state, action) => {
        state.searchStatus = 'idle';
        state.searchResults = action.payload.data.children.map((sub: any): Subreddit => {
          return {
            name: sub.data.display_name,
            desc: sub.data.description,
            iconUrl: sub.data.community_icon
          }
        });
      })
      .addCase(getSubreddits.rejected, (state) => {
        state.searchStatus = 'error';
      });
  }
});

export const { toggleSubreddit, setLoading } = subredditsReducer.actions;

export default subredditsReducer.reducer;