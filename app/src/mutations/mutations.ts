import type { Post, User } from "../types/types";
import {
  useDelete,
  useFormDataPost,
  usePatch,
  usePost,
} from "./mutation.utils";

export const useAddPost = () => {
  const { addEntity } =
    usePost<Omit<Post, "_id" | "createdAt" | "image">>("posts");

  const addPost = async (post: Omit<Post, "_id" | "createdAt" | "image">) =>
    addEntity(post);

  return { addPost };
};

export const useAddPostWithImage = () => {
  const { addEntity } = useFormDataPost("posts/form");

  const addPost = async (formData: FormData) => addEntity(formData);

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

export const useCreateUser = () => {
  const { addEntity } = usePost<Omit<User, "_id">>("users");

  const createUser = async (user: Omit<User, "_id">) => addEntity(user);

  return { createUser };
};

export const useLoginUser = () => {
  const { addEntity } = usePost<{ username: string; password: string }>(
    "users/login",
  );

  const loginUser = async (credentials: {
    username: string;
    password: string;
  }) => addEntity(credentials);

  return { loginUser };
};
