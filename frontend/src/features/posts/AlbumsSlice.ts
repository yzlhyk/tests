import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  EntityId,
} from "@reduxjs/toolkit";
import { RootState, baseUrl } from "../../app/store";

export interface Album {
  userId: number;
  id: number;
  title: string
}

export enum DataStatus {
  IDLE = "idle",
  LOADING = "loading",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}

const albumAdapter = createEntityAdapter<Album>();
const initialState = albumAdapter.getInitialState({
  status: DataStatus.IDLE,
  error: null,
});

export const fetchAlbums = createAsyncThunk("users/fetchAlbums", async () => {
  const res = await fetch(`${baseUrl}/albums?_limit=30`);
  const json = res.json();
  console.log("Album response: ", res);
  console.log('Album json: ', json)
  return json;
});

const albumsSlice = createSlice({
  name: 'albums',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchAlbums.fulfilled, albumAdapter.setAll)
  }
})

export default albumsSlice.reducer;

export const { 
  selectAll: selecAllAlbums, 
  selectById: selectAlbumById 
} = albumAdapter.getSelectors((state: RootState) => state.albums);

export const selectAlbumByUser = createSelector(
  [selecAllAlbums, (state: RootState, userId: EntityId | undefined) => userId],
  (albums: Album[], userId) => albums.filter((album: Album) => album.userId === userId)
)