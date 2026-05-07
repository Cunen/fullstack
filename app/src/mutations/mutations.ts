import type { Post, User } from "../types/types";
import {
  useDelete,
  useFormDataPost,
  usePatch,
  usePost,
} from "./mutation.utils";

export const useAddPost = (token?: string | null) => {
  const { addEntity } = usePost<Omit<Post, "_id" | "createdAt" | "image">>(
    "posts",
    token,
  );

  const addPost = async (post: Omit<Post, "_id" | "createdAt" | "image">) =>
    addEntity(post);

  return { addPost };
};

export const useAddPostWithImage = (token?: string | null) => {
  const { addEntity } = useFormDataPost("posts/form", token);

  const addPost = async (formData: FormData) => addEntity(formData);

  return { addPost };
};

export const useDeletePost = (token?: string | null) => {
  const { deleteEntity } = useDelete("posts", token);

  const deletePost = async (id: string) => deleteEntity(id);

  return { deletePost };
};

export const useUpdatePost = (token?: string | null) => {
  const { patchEntity } = usePatch<Partial<Post>>("posts", token);

  const updatePost = async (id: string, post: Partial<Post>) =>
    patchEntity(id, post);

  return { updatePost };
};

export const useCreateUser = (token?: string | null) => {
  const { addEntity } = usePost<Omit<User, "_id">>("users", token);

  const createUser = async (user: Omit<User, "_id">) => addEntity(user);

  return { createUser };
};

export const useLoginUser = (token?: string | null) => {
  const { addEntity } = usePost<{ username: string; password: string }>(
    "users/login",
    token,
  );

  const loginUser = async (credentials: {
    username: string;
    password: string;
  }) => addEntity(credentials);

  return { loginUser };
};

export const useLogoutUser = (token?: string | null) => {
  const { addEntity } = usePost<{ userId: string }>("users/logout", token);

  const logoutUser = async (userId: string) => addEntity({ userId });

  return { logoutUser };
};
