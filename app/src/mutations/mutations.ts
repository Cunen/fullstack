import type { Post } from "../types/types";
import { useDelete, usePatch, usePost } from "./mutation.utils";

export const useAddPost = () => {
  const { addEntity } = usePost<Omit<Post, "_id" | "createdAt">>("posts");

  const addPost = async (post: Omit<Post, "_id" | "createdAt">) =>
    addEntity(post);

  return { addPost };
};

export const useDeletePost = () => {
  const { deleteEntity } = useDelete("posts");

  const deletePost = async (id: string) => deleteEntity(id);

  return { deletePost };
};

export const useUpdatePost = () => {
  const { patchEntity } = usePatch<Partial<Post>>("posts");

  const updatePost = async (id: string, post: Partial<Post>) =>
    patchEntity(id, post);

  return { updatePost };
};
