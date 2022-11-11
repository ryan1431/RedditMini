import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SavedState {
  version: number;
  refUrls: string[],
}

const initialState: SavedState = {
  version: 1,
  refUrls: []
}

let savedState: SavedState | undefined;

try {
  savedState = JSON.parse(localStorage.getItem('saved') as string) as SavedState;
  if (savedState.version !== initialState.version) savedState = undefined;
} catch(e) {
  // No saved state
}

export const savedReducer = createSlice({
  name: 'saved',
  initialState: savedState || initialState,
  reducers: {
    save: (state, action: PayloadAction<string>) => {
      const url = action.payload;
      if (state.refUrls.includes(url)) throw new Error('already-saved');
      state.refUrls.push(url);
    },
    unsave: (state, action: PayloadAction<string>) => {
      const url = action.payload;
      let index = state.refUrls.findIndex((el) => el === url);
      if (index !== -1) {
        state.refUrls.splice(index, 1);
      }
    }
  }
});

export const { save, unsave } = savedReducer.actions;

export default savedReducer.reducer;
