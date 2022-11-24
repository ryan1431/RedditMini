import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostType } from "../../utility";

export interface SavedState {
  savedPosts: PostType[],
  hidden: string[],
}

export const initialState: SavedState = {
  savedPosts: [],
  hidden: [],
}

let savedState: SavedState | undefined;

try {
  savedState = JSON.parse(localStorage.getItem('saved') as string) as SavedState;
} catch(e) {
  // No saved state
}

export const savedReducer = createSlice({
  name: 'saved',
  initialState: savedState || initialState,
  reducers: {
    save: (state, action: PayloadAction<PostType>) => {
      const post = action.payload;
      state.savedPosts.push(post);
    },
    unsave: (state, action: PayloadAction<PostType>) => {
      const post = action.payload;
      let index = state.savedPosts.findIndex((p) => p.url === post.url);
      if (index === -1) throw new Error('no post found');

      state.savedPosts.splice(index, 1);
    },
    resetSaved: () => {
      return initialState;
    },
    hidePost: (state, action: PayloadAction<string>) => {
      state.hidden.push(action.payload);
    },
    unHidePost: (state, action: PayloadAction<string>) => {
      state.hidden = state.hidden.filter(h => h !== action.payload)
    },
    clearHiddenPosts: (state) => {
      state.hidden = [];
    },
  }
});

export const { save, unsave, resetSaved, hidePost, unHidePost, clearHiddenPosts } = savedReducer.actions;

export default savedReducer.reducer;
