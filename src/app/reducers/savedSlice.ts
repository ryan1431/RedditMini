import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { background, backgrounds } from "../../types/backgrounds";
import { ThemeInfo, themes } from "../../types/theme";
import { PostType } from "../../utility";
import { RootState } from "../store/store";

export interface SavedState {
  savedPosts: PostType[],
  hidden: string[],
  themes: ThemeInfo[],
  backgrounds: background[],
  selectedTheme: string,
  background: string,
  showNSFW: boolean,
}

export const initialState: SavedState = {
  savedPosts: [],
  hidden: [],
  themes,
  backgrounds,
  selectedTheme: 'pallete 6-light',
  background: 'Default',
  showNSFW: false,
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
    changeBackground: (state, action: PayloadAction<string>) => {
      if (action.payload === 'Default') state.background = action.payload;
      else state.background = state.backgrounds.find(b => b.name === action.payload)!.name;
    },
    toggleThemeMode: (state) => {
      let [theme, mode] = state.selectedTheme.split('-');
      mode = mode === 'light' ? 'dark' : 'light';

      state.selectedTheme = `${theme}-${mode}` as string;
    }, 
    toggleShowNSFW: (state) => {
      state.showNSFW = !state.showNSFW;
    },
  }
});

export const selectTheme = (state: RootState): ThemeInfo => state.saved.themes.find(t => t.theme === state.saved.selectedTheme)!;
export const selectBackground = (state: RootState): string => {
  const name = state.saved.backgrounds.find(b => b.name === state.saved.background) || 'Default';
  return (typeof name === 'string') 
    ? ''
    : name.style;
}


export const { save, unsave, changeBackground, changeTheme, toggleThemeMode, resetSaved, hidePost, unHidePost, clearHiddenPosts, toggleShowNSFW } = savedReducer.actions;

export default savedReducer.reducer;
