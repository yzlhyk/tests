import {
  createAsyncThunk,
  createSelector,
  createSlice,
  createEntityAdapter,
  EntityId,
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
  return json;
});

export const updatePost = createAsyncThunk("posts/updatePost", async ({ post, title }: any) => {
  console.log('update post fetch: ', title)
  await fetch(`${baseUrl}/posts/${post.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      ...post,
      title
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }
  }).then((response) => response.json())
    .then((json) => console.log('res of put:', json));

  return { post, title };
})

export const deletePost = createAsyncThunk("posts/deletePost", async (postId: EntityId) => {
  await fetch(`${baseUrl}/posts/${postId}`, { method: 'DELETE' });
  return postId;
})

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
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
      })
      .addCase(updatePost.fulfilled, (state, { payload: { post, title } }) => {
        state.status = DataStatus.SUCCEEDED;
        postsAdapter.updateOne(state, { id: post.id, changes: { title } });
      })
      .addCase(updatePost.rejected, (state) => {
        state.status = DataStatus.FAILED
      })
      .addCase(deletePost.rejected, (state) => {
        state.status = DataStatus.FAILED
      })
      .addCase(deletePost.fulfilled, (state, { payload: id }) => {
        state.status = DataStatus.SUCCEEDED
        postsAdapter.removeOne(state, id!)
      }).addCase(deletePost.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
  },
});

export default postsSlice.reducer;

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state: RootState) => state.posts);

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state: RootState, userId: string | undefined) => userId],
  (posts: Post[], userId) => posts.filter((post: Post) => post.userId === userId)
);
