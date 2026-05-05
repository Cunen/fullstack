import type { Post } from "../types/types";
import { useQuery } from "./query.utils";

export const usePosts = () => useQuery<Post[]>("posts");
