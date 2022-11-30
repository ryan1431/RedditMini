import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ThemeInfo, themes } from "../../types/theme";
import { PostType } from "../../utility";
import { RootState } from "../store/store";

export interface SavedState {
  savedPosts: PostType[],
  hidden: string[],
  themes: ThemeInfo[],
  selectedTheme: string,
}

export const initialState: SavedState = {
  savedPosts: [],
  hidden: [],
  themes,
  selectedTheme: 'navy blue-light',
}

let savedState: SavedState | undefined;

try {
  // savedState = JSON.parse(localStorage.getItem('saved') as string) as SavedState;
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
    changeTheme: (state, action: PayloadAction<string>) => {
      const mode = state.selectedTheme.split('-')[1];
      state.selectedTheme = `${action.payload}-${mode}`;
    },
    toggleThemeMode: (state) => {
      let [theme, mode] = state.selectedTheme.split('-');
      mode = mode === 'light' ? 'dark' : 'light';

      state.selectedTheme = `${theme}-${mode}` as string;
    }
  }
});

export const selectTheme = (state: RootState): ThemeInfo => state.saved.themes.find(t => t.theme === state.saved.selectedTheme)!;

export const { save, unsave, changeTheme, toggleThemeMode, resetSaved, hidePost, unHidePost, clearHiddenPosts } = savedReducer.actions;

export default savedReducer.reducer;
