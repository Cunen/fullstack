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
