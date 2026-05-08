import { useCallback } from "react";
import styled from "styled-components";

import { useAddPostWithImage } from "../../mutations/mutations";
import { useNavigate } from "react-router-dom";
import useAuth from "../../providers/Auth/auth";
import { Button } from "webcomponents";

function NewPost() {
  const { token } = useAuth();
  const { addPost } = useAddPostWithImage(token);
  const navigate = useNavigate();

  const handlePost = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      await addPost(formData);
      navigate("/");
    },
    [addPost, navigate],
  );

  return (
    <Form>
      <form onSubmit={handlePost} id="new-post" name="new-post">
        <input type="text" name="title" placeholder="Title" required />
        <input type="text" name="content" placeholder="Content" required />
        <input type="hidden" name="user" value="69fb30a1d33f2159c7251b03" />
        <input
          type="file"
          name="image"
          id="image"
          accept="image/png, image/jpeg"
          required
        />
        <Button text="Create Post"></Button>
      </form>
    </Form>
  );
}

const Form = styled.div`
  display: flex;
  form {
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  }
`;

export default NewPost;
