import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { formatUrl } from "../../utility";
import { base } from "../../utility/data";

import type { Subreddit } from "../../types";

interface SubredditsState {
  subs: Subreddit[],
  searchInput: string,
  searchStatus: string,
  searchResults: Subreddit[],
  toggleQueue: Subreddit[],
  open: boolean,
  srOpen: boolean,
  inSearch: boolean,
}

const initialState: SubredditsState = {
  subs: [],
  searchInput: '',
  searchStatus: 'idle',
  searchResults: [],
  toggleQueue: [],
  open: false,
  srOpen: false,
  inSearch: false,
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
      if (index === -1) {
        state.subs.push(action.payload);
        state.subs = state.subs.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      } else {
        state.subs.splice(index, 1)
      }
    },
    setLoading: (state, action: PayloadAction<string>) => {
      state.searchStatus = action.payload;
    },
    toggleResult: (state, action: PayloadAction<Subreddit>) => {
      let index = state.toggleQueue.findIndex((sr) => sr.name === action.payload.name);
      if (index === -1) {
        state.toggleQueue.push(action.payload);
      } else {
        state.toggleQueue.splice(index, 1);
      }
    },
    clearToggleQueue: (state) => {
      state.toggleQueue = [];
    },
    toggleOpen: (state, action: PayloadAction<boolean | undefined>) => {
      state.open = action.payload ?? !state.open;
    },
    toggleSrOpen: (state, action: PayloadAction<boolean | undefined>) => {
      state.srOpen = action.payload ?? !state.srOpen;
    },
    toggleInSearch: (state, action: PayloadAction<boolean | undefined>) => {
      state.inSearch = action.payload ?? !state.inSearch;
    },
    setSearchInput: (state, action: PayloadAction<string>) => {
      state.searchInput = action.payload;
    },
    onClearSubreddits: (state) => {
      let srOpen = state.srOpen;
      let open = state.open;

      return {...initialState, open, srOpen}
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
            icon_url: sub.data.community_icon,
            is_valid: sub.data.subreddit_type !== 'private',
          }
        }).filter((s: Subreddit) => s.is_valid);
      })
      .addCase(getSubreddits.rejected, (state) => {
        state.searchStatus = 'error';
      });
  }
});

export const { toggleSubreddit, setLoading, toggleResult, clearToggleQueue, toggleOpen, toggleSrOpen, toggleInSearch, setSearchInput, onClearSubreddits } = subredditsReducer.actions;

export default subredditsReducer.reducer;