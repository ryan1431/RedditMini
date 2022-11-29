import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Theme, ThemeInfo } from "../../types/theme";
import { PostType } from "../../utility";
import { RootState } from "../store/store";

export interface SavedState {
  savedPosts: PostType[],
  hidden: string[],
  theme: ThemeInfo[],
  selectedTheme: Theme,
}

export const initialState: SavedState = {
  savedPosts: [],
  hidden: [],
  theme: [{
    theme: 'dark',
    font_color: {r: 255, g: 255, b: 255},
    front: {r: 35, g: 35, b: 35},
    front_alt: {r: 19, g: 19, b: 19},
    back: {r: 0, g: 0, b: 0},
    back_alt: {r: 0, g: 0, b: 0},
  }, {
    theme: 'light',
    font_color: {r: 0, g: 0, b: 0},
    front: {r: 255, g: 255, b: 255},
    front_alt: {r: 19, g: 19, b: 19},
    back: {r: 150, g: 150, b: 150},
    back_alt: {r: 0, g: 0, b: 0},
  }],
  selectedTheme: 'dark',
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
    changeTheme: (state, action: PayloadAction<Theme>) => {
      state.selectedTheme = action.payload;
    }
  }
});

export const currentThemeInfo = (state: RootState): ThemeInfo => state.saved.theme.find(t => t.theme === state.saved.selectedTheme)!;

export const { save, unsave, changeTheme, resetSaved, hidePost, unHidePost, clearHiddenPosts } = savedReducer.actions;

export default savedReducer.reducer;
