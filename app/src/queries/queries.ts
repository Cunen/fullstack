import { useEffect, useState } from "react";
import useSocket from "../providers/socket/socket";
import type { Post } from "../types/types";
import { useQuery } from "./query.utils";

type Paginated<T> = {
  page: number;
  pages: number;
  limit: number;
  total: number;
  data: T;
};

type Params = { [key: string]: string };

export const useGetPosts = (token?: string | null, params?: Params) =>
  useQuery<Paginated<Post[]>>("posts", token, params);

export const useGetPost = (id: string, token?: string | null) =>
  useQuery<Post>(`posts/${id}`, token);

// Get post updates via socket
export function useGetPostsViaSocket(token?: string | null, params?: Params) {
  const { socket } = useSocket();

  const { loading, data, refetch } = useGetPosts(token, params);

  const [posts, setPosts] = useState<Paginated<Post[]> | null>(null);

  useEffect(() => {
    setPosts((prev) => data || prev);
  }, [data]);

  useEffect(() => {
    if (!socket) return;

    socket.on("posts", (update: { action: string; data: Post }) => {
      console.log("Received socket update:", update);
      if (update.action === "add") {
        setPosts((prev) => {
          const newPosts = prev ? [...prev.data, update.data] : [update.data];
          return {
            ...prev,
            data: newPosts,
          } as Paginated<Post[]>;
        });
      } else if (update.action === "update") {
        setPosts((prev) => {
          const newPosts = prev
            ? prev.data.map((post) =>
                post._id === update.data._id ? update.data : post,
              )
            : [];
          return {
            ...prev,
            data: newPosts,
          } as Paginated<Post[]>;
        });
      } else if (update.action === "delete") {
        setPosts((prev) => {
          const newPosts = prev
            ? prev.data.filter((post) => post._id !== update.data._id)
            : [];
          return {
            ...prev,
            data: newPosts,
          } as Paginated<Post[]>;
        });
      }
    });

    return () => {
      socket.off("posts");
    };
  }, [socket]);

  return { loading, data: posts, refetch };
}
