import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { RootState, DataStatus } from "../../app/store";
import { PostAuthor } from "./PostAuthor";
import { fetchPosts, selectPostIds, selectPostById } from "./postsSlice";

import { TimeAgo } from "./TimeAgo";
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

  if (!post) {
    return <div>Invalid Post</div>;
  }

  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <h4>Album: </h4>
      <PostAlbum userId={post.userId} />
      <div>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content}</p>

      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
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
    content = orderedPostsIds.map((postId: EntityId) => (
      <PostExerpt key={postId} postId={postId} />
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
