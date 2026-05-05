import { useCallback, useMemo } from "react";
import styled from "styled-components";

import { usePosts } from "./queries/queries";

import { Button } from "webcomponents";
import {
  useAddPost,
  useDeletePost,
  useUpdatePost,
} from "./mutations/mutations";

function App() {
  const { addPost } = useAddPost();
  const { deletePost } = useDeletePost();
  const { updatePost } = useUpdatePost();

  const { loading, data: postsData, refetch } = usePosts();
  const posts = useMemo(() => postsData || [], [postsData]);

  console.log(updatePost);

  const handlePost = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const title = (
        e.currentTarget.elements.namedItem("title") as HTMLInputElement
      ).value;
      const content = (
        e.currentTarget.elements.namedItem("content") as HTMLInputElement
      ).value;

      await addPost({ title, content, user: "69f84678c3e0a5cf98eb55cf" });

      refetch();
    },
    [addPost, refetch],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deletePost(id);
      refetch();
    },
    [deletePost, refetch],
  );

  const handleUpdateTitle = useCallback(
    async (id: string) => {
      await updatePost(id, {
        title: "Updated Title",
      });
      refetch();
    },
    [updatePost, refetch],
  );

  const handleUpdateContent = useCallback(
    async (id: string) => {
      await updatePost(id, {
        content: "Updated Content",
      });
      refetch();
    },
    [updatePost, refetch],
  );

  return (
    <Wrapper>
      {posts.map((post) => (
        <Post key={post._id}>
          <PostTitle>
            {post.title}
            <Timestamp>{new Date(post.createdAt).toISOString()}</Timestamp>
          </PostTitle>
          <PostContent>{post.content}</PostContent>
          <PostUser>{post.user}</PostUser>
          <Button click={() => handleDelete(post._id)} text="Delete" />
          <Button
            click={() => handleUpdateTitle(post._id)}
            text="Update Title"
          />
          <Button
            click={() => handleUpdateContent(post._id)}
            text="Update Content"
          />
        </Post>
      ))}
      {loading && <p>Loading...</p>}
      <Form>
        <form onSubmit={handlePost}>
          <input type="text" name="title" placeholder="Title" required />
          <input type="text" name="content" placeholder="Content" required />
          <button type="submit">Create Post</button>
        </form>
      </Form>
      <Button click={refetch} text="Refetch Posts" />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
`;

const Form = styled.div`
  display: flex;
  form {
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  }
`;

const Post = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0;
  border: 1px solid #ccc;
  padding: 12px;
  gap: 12px;
`;

const PostTitle = styled.h2`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  font-size: 16px;
  padding: 0;
  margin: 0;
`;

const Timestamp = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: #888;
`;

const PostContent = styled.p`
  font-size: 14px;
  margin: 0px;
  padding: 0px;
`;

const PostUser = styled.p`
  font-size: 12px;
  color: #555;
  margin: 0px;
  padding: 0px;
`;

export default App;
