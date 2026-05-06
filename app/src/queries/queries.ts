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

export const useGetPosts = (params?: Params) =>
  useQuery<Paginated<Post[]>>("posts", params);
export const useGetPost = (id: string) => useQuery<Post>(`posts/${id}`);
