import { ChangeEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useParams, useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";
import { selectPostById, updatePost } from "./postsSlice";

type PostParams = {
  postId: string;
}
export const EditPostForm = () => {
  const { postId } = useParams<PostParams>();

  const navigate = useNavigate();

  const post = useAppSelector((state: RootState) =>
    selectPostById(state, postId!)
  );

  const [title, setTitle] = useState(post?.title);

  const dispatch = useAppDispatch();

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  const onSavePostClicked = () => {
    if (title) {
      dispatch(updatePost({post, title}));
      navigate('/');
    }
  };
  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mine?"
          value={title}
          onChange={onTitleChanged}
        />
      </form>
      <button type="button" onClick={onSavePostClicked}>
        Save Post
      </button>
    </section>
  );
};
