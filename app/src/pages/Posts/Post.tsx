import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { useGetPost } from "../../queries/queries";
import { useUpdatePost } from "../../mutations/mutations";
import useAuth from "../../providers/Auth/auth";

const Post: React.FC = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const { loading, data: postData, refetch } = useGetPost(id || "", token);

  const { updatePost } = useUpdatePost(token);

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (postData) {
      setTitle(postData.title);
      setContent(postData.content);
    }
  }, [postData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const updatedPost = {
        title,
        content,
      };
      updatePost(id || "", updatedPost).then(() => refetch());
    },
    [id, title, content, updatePost, refetch],
  );

  if (loading || !postData) return <p>Loading...</p>;

  return (
    <Form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        name="title"
        id="title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        name="content"
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <p>{postData.user}</p>
      <p>{postData.createdAt}</p>
      <p>{postData.updatedAt}</p>
      <img
        src={"http://localhost:3000/images/" + postData.image}
        alt={postData.title}
      />
      <button type="submit">Update</button>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
`;

export default Post;
