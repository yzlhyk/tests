import React, { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { RootState, DataStatus } from "../../app/store";
import { PostAuthor } from "./PostAuthor";
import {
  fetchPosts,
  selectPostIds,
  selectPostById,
  deletePost,
} from "./postsSlice";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Spinner } from "../../components/Spinner";
import { EntityId } from "@reduxjs/toolkit";
import { fetchUsers } from "../users/usersSlice";
import { PostAlbum } from "./PostAlbum";
import { fetchAlbums } from "./AlbumsSlice";

let PostExerpt = ({ postId }: { postId: EntityId }) => {
  const post = useAppSelector((state: RootState) =>
    selectPostById(state, postId)
  );
  const dispatch = useAppDispatch();

  const onDelete = useCallback(() => {
    dispatch(deletePost(postId));
  }, []);

  if (!post) {
    return <div>Invalid Post</div>;
  }
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <PostAlbum userId={post.userId} />

      <div>
        <PostAuthor userId={post.userId} />
      </div>
      <p className="post-content">{post.content}</p>
      <Link to={`/editPost/${post.id}`} className="button">
        Edit Post
      </Link>
      <button onClick={onDelete} className="button delete">Delete Post</button>
    </article>
  );
};

const PostsList: React.FC<any> = () => {
  const dispatch = useAppDispatch();
  const orderedPostsIds = useAppSelector(selectPostIds);

  const postStatus = useAppSelector((state: RootState) => state.posts.status);
  const error = useAppSelector((state: RootState) => state.posts.error);

  useEffect(() => {
    if (postStatus === DataStatus.IDLE) {
      dispatch(fetchPosts());
      dispatch(fetchUsers());
      dispatch(fetchAlbums());
    }
  }, [postStatus, dispatch]);

  let content;

  if (postStatus === DataStatus.LOADING) {
    content = <Spinner text="Loading..." />;
  } else if (postStatus === DataStatus.SUCCEEDED) {
    content = orderedPostsIds.map((postId: EntityId, index: number) => (
      <PostExerpt key={index} postId={postId} />
    ));
  } else if (postStatus === DataStatus.FAILED) {
    content = <div>{error}</div>;
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  );
};

export default PostsList;
