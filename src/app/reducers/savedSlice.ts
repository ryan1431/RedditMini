import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostType } from "../../utility";

export interface SavedState {
  savedPosts: PostType[],
}

const initialState: SavedState = {
  savedPosts: []
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
      if (state.savedPosts.find((p) => p.url === post.url)) throw new Error('already-saved');

      state.savedPosts.push(post);
    },
    unsave: (state, action: PayloadAction<PostType>) => {
      const post = action.payload;
      let index = state.savedPosts.findIndex((p) => p.url === post.url);
      if (index === -1) throw new Error('no post found');

      state.savedPosts.splice(index, 1);
    },
    onClearSaved: () => {
      return initialState;
    }
  }
});

export const { save, unsave, onClearSaved } = savedReducer.actions;

export default savedReducer.reducer;
