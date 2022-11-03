import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { formatUrl } from "../utility";
import { base } from "../utility/data";

import type { Subreddit } from "../types";


interface SubredditsSlice {
  subs: string[],
  searchStatus: string,
  searchResults: Subreddit[],
}

const initialState: SubredditsSlice = {
  subs: ['todayilearned', 'askreddit'],
  searchStatus: 'idle',
  searchResults: [],
}

export const getSubreddits = createAsyncThunk(
  'counter/fetchCount',
  async (query: string) => {
    const response = await fetch(formatUrl(`${base}search/?q=${query}&type=sr&limit=10`));
    const data = await response.json();

    return data;
  }
);

const subredditsSlice = createSlice({
  name: 'subreddits',
  initialState,
  reducers: {
    addSubreddit: (state, action: PayloadAction<string>) => {
      state.subs.push(action.payload);
    },
    removeSubreddit: (state, action: PayloadAction<string>) => {
      state.subs = state.subs.filter((sub) => sub !== action.payload);
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

export const { addSubreddit, removeSubreddit, setLoading } = subredditsSlice.actions;

export default subredditsSlice.reducer;