import React, { useMemo } from "react";
import styled from "styled-components";
import { Button } from "webcomponents";
import { useGetMemos } from "../../graphql/graphql.queries";
import { useAddMemo, useDeleteMemo } from "../../graphql/graphql.mutations";
import useAuth from "../../providers/Auth/auth";

export const Memos: React.FC = () => {
  const { token } = useAuth();
  const { data, loading, refetch } = useGetMemos(token);
  const { addMemo } = useAddMemo(token);
  const { deleteMemo } = useDeleteMemo(token);

  const memos = useMemo(() => {
    return data?.data.getMemos || [];
  }, [data]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    await addMemo({ title, content });
    refetch();
  };

  const handleDelete = async (id: string) => {
    await deleteMemo(id);
    refetch();
  };

  return (
    <Wrapper>
      {loading ? (
        <p>Loading...</p>
      ) : (
        memos.map((memo) => {
          return (
            <Memo key={memo._id}>
              <Title>{memo.title}</Title>
              <Description>{memo.content}</Description>
              {memo.comments.map((comment, index) => (
                <Comment key={index}>
                  <CommentText>{comment.comment}</CommentText>
                  <CommentUser>{comment.user.username}</CommentUser>
                </Comment>
              ))}
              <Button click={() => handleDelete(memo._id)} text="Delete" />
            </Memo>
          );
        })
      )}
      <Form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input type="text" placeholder="Title" name="title" />
        <label htmlFor="content">Content:</label>
        <textarea placeholder="Content" name="content" />
        <button type="submit">Add Memo</button>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
`;

const Memo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Title = styled.span``;

const Description = styled.span``;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Comment = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const CommentText = styled.span``;

const CommentUser = styled.span`
  font-size: 0.8em;
  color: #555;
`;

export default Memos;
