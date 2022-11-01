import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SavedState {
  refUrls: string[],
}

const initialState: SavedState = {
  refUrls: []
}

const savedReducer = createSlice({
  name: 'saved',
  initialState,
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
