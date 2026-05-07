import React from "react";
import styled from "styled-components";
import { Button } from "webcomponents";

export const Memos: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    console.log("New Memo:", { title, content });
  };

  const handleDelete = (id: string) => {
    console.log("Delete Memo with ID:", id);
  };

  return (
    <Wrapper>
      <Memo>
        <Title>Memo 1</Title>
        <Description>Description of Memo 1</Description>
        <Button click={() => handleDelete("1")} text="Delete" />
      </Memo>
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

export default Memos;
