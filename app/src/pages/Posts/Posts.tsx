import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { useGetPostsViaSocket } from "../../queries/queries";

import { Button } from "webcomponents";
import { useDeletePost } from "../../mutations/mutations";
import { useNavigate } from "react-router-dom";
import useAuth from "../../providers/Auth/auth";
import useSocket from "../../providers/socket/socket";
import type { Post } from "../../types/types";

function Posts() {
  const { token } = useAuth();
  const { socket } = useSocket();
  const { deletePost } = useDeletePost(token);
  const navigate = useNavigate();

  const [page, setPage] = useState("1");

  const {
    loading,
    data: postsData,
    refetch,
  } = useGetPostsViaSocket(token, { page, limit: "2" });

  const { pagination, posts } = useMemo(() => {
    if (!postsData)
      return {
        pagination: { pages: 1 },
        posts: [],
      };
    const { pages, data } = postsData;
    return {
      pagination: { pages },
      posts: data,
    };
  }, [postsData]);

  const handleDelete = useCallback(
    async (id: string) => {
      await deletePost(id);
      refetch();
    },
    [deletePost, refetch],
  );

  const openPost = useCallback(
    (id: string) => {
      navigate(`/post/${id}`);
    },
    [navigate],
  );

  const handleSocketUpdate = useCallback(
    (update: { action: string; data: Post }) => {
      if (update.action === "add") {
        console.log("New post added:", update.data);
      } else if (update.action === "update") {
        console.log("Post updated:", update.data);
      } else if (update.action === "delete") {
        console.log("Post deleted:", update.data);
      }
    },
    [],
  );

  useEffect(() => {
    if (!socket) return;
    socket.on("posts", handleSocketUpdate);
    return () => {
      socket.off("posts", handleSocketUpdate);
    };
  }, [handleSocketUpdate, socket]);

  if (loading) return <p>Loading...</p>;

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
          <Button click={() => openPost(post._id)} text="Edit" />
        </Post>
      ))}
      <Pagination>
        {new Array(pagination.pages).fill(0).map((_, i) => {
          return (
            <Page
              key={i}
              $active={i + 1 === Number(page)}
              onClick={() => {
                setPage((i + 1).toString());
              }}
            >
              {i + 1}
            </Page>
          );
        })}
      </Pagination>
    </Wrapper>
  );
}

const Pagination = styled.div``;

const Page = styled.button<{ $active?: boolean }>`
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  background: ${(props) => (props.$active ? "#007bff" : "transparent")};
  color: ${(props) => (props.$active ? "#fff" : "#000")};
  padding: 4px 8px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
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

export default Posts;
