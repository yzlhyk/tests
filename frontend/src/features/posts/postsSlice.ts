import {
  createAsyncThunk,
  createSelector,
  createSlice,
  createEntityAdapter,
} from "@reduxjs/toolkit";

import { RootState, baseUrl } from "../../app/store";
export interface IEmoji {
  [index: string]: number;
}
export interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  date: string;
  reactionsCount: IEmoji;
}

export enum DataStatus {
  IDLE = "idle",
  LOADING = "loading",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}

const postsAdapter = createEntityAdapter<Post>();

const initialState = postsAdapter.getInitialState({
  status: DataStatus.IDLE,
  error: null,
});

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const res = await fetch(`${baseUrl}/posts?_limit=30`);
  const json = res.json();
  console.log("Posts response: ", res);
  console.log('post json: ', json)
  return json;
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postUpdated(state, action) {
      const { id, title, content } = action.payload;
      const existingPost = state.entities[id];
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload as {
        postId: string;
        reaction: string;
      };
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactionsCount[reaction]++;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = DataStatus.SUCCEEDED;
        postsAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        // state.error = action.error.message;
      })
      // .addCase(addNewPost.fulfilled, postsAdapter.addOne);
  },
});

export const { postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;

// export const selectAllPosts = (state: RootState) => state.posts.posts;

// export const selectPostById = (state: RootState, postId: string | undefined) =>
//   state.posts.posts.find((post: Post) => post.id === postId);

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state: RootState) => state.posts);

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state: RootState, userId: string | undefined) => userId],
  (posts: Post[], userId) => posts.filter((post: Post) => post.userId === userId)
);
