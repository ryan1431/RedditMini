import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Comment } from "../../types/commentType"
import { formatComments, getSinglePost } from "../../utility"


export interface CommentsState {
  fetchStatus: 'idle' | 'fetching',
  lastId: string,
  comments: Comment[],
}

export const initialState: CommentsState = {
  fetchStatus: 'idle',
  lastId: '',
  comments: [],
}

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({ url, postId }: {url: string, postId: string}, _api) => {
    try {
      const data = await getSinglePost(url);

      return {
        comments: formatComments(data),
        postId,
      }
    } catch(e) {
    }
  }
)

export const commentsReducer = createSlice({
  name: 'comments',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.fetchStatus = 'fetching';
      })
      .addCase(fetchComments.fulfilled, (state, action: PayloadAction<{ comments: Comment[], postId: string} | undefined>) => {
        if (!action.payload) return;
        const { comments, postId } = action.payload;

        state.comments = comments;
        state.lastId = postId;
        state.fetchStatus = 'idle';
      })
  }
})

export default commentsReducer.reducer;