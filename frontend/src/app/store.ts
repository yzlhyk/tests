import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice";
import usersReducer from "../features/users/usersSlice";
import albumsReducer from "../features/posts/AlbumsSlice";

export enum DataStatus {
  IDLE = "idle",
  LOADING = "loading",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    albums: albumsReducer
  }
});

export const baseUrl = "https://jsonplaceholder.typicode.com";

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
