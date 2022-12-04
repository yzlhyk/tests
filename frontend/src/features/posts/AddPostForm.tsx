import { ChangeEvent, useState } from "react";
import { nanoid } from "@reduxjs/toolkit";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useSelector } from "react-redux";
import { DataStatus, RootState } from "../../app/store";
import { selectAllUsers, User } from "../users/usersSlice";

export const AddPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState(DataStatus.IDLE);

  const dispatch = useAppDispatch();

  const users = useAppSelector(selectAllUsers);

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const onContentChanged = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value);
  const onAuthorChanged = (e: ChangeEvent<HTMLSelectElement>) =>
    setUserId(e.target.value);

  const canSave =
    [title, content, userId].every(Boolean) &&
    addRequestStatus === DataStatus.IDLE;

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus(DataStatus.LOADING);
        setTitle("");
        setContent("");
        setUserId("");
      } catch (err) {
        console.error("Failed to save the post: ", err);
      } finally {
        setAddRequestStatus(DataStatus.IDLE);
      }
    }
  };

  const usersOptions = users.map((user: User) => (
    <option value={user.id} key={user.id}>
      {user.name}
    </option>
  ));
  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="psotAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};
