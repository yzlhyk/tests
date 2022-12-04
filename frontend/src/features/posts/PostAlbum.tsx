import { EntityId } from "@reduxjs/toolkit";
import { useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { Album, selectAlbumByUser } from "./AlbumsSlice";

export const PostAlbum = ({ userId }: { userId: EntityId }) => {
  console.log("user id: ", userId);

  const albums = useAppSelector((state: RootState) =>
    selectAlbumByUser(state, userId)
  );

  const randowmAlbum = albums[Math.round(Math.random() * 9)] as Album;
  console.log("randowmAlbum: ", randowmAlbum);

  return (
    <>
      <h5>{randowmAlbum ? randowmAlbum.title : ""}</h5>
    </>
  );
};
