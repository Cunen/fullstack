import { useGraphQLQuery } from "./graphql.hooks";

type MemoQuery = {
  data: {
    getMemos: {
      _id: string;
      title: string;
      content: string;
      createdAt: string;
      updatedAt: string;
      comments: [
        {
          comment: string;
          user: {
            username: string;
          };
        },
      ];
    }[];
  };
  errors?: {
    message: string;
    status: number;
  }[];
};

const memoQuery = {
  query: `
    { getMemos { _id, title, content, createdAt, updatedAt, comments { comment, user { username } } } }
  `,
};

export const useGetMemos = (token?: string | null) =>
  useGraphQLQuery<MemoQuery>(memoQuery, token);
