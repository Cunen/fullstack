import { useGraphQLMutation } from "./graphql.hooks";

type AddMemo = {
  data: {
    addMemo: {
      _id: string;
      title: string;
      content: string;
      createdAt: string;
      updatedAt: string;
    };
    errors?: {
      message: string;
      status: number;
    }[];
  };
};

export const useAddMemo = (token?: string | null) => {
  const { addEntity } = useGraphQLMutation<AddMemo>(token);

  const addMemo = async ({
    title,
    content,
  }: {
    title: string;
    content: string;
  }) => {
    const query = {
      query: `
        mutation {
          addMemo(input: { title: "${title}", content: "${content}" }) {
            _id
            title
            content
            createdAt
            updatedAt
          }
        }
      `,
    };

    return await addEntity(query);
  };

  return { addMemo };
};

type DeleteMemo = {
  data: {
    deleteMemo: null | {
      _id: string;
      title: string;
      content: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  errors?: {
    message: string;
    status: number;
  }[];
};

export const useDeleteMemo = (token?: string | null) => {
  const { addEntity } = useGraphQLMutation<DeleteMemo>(token);

  const deleteMemo = async (id: string) => {
    const query = {
      query: `
        mutation {
          deleteMemo(id: "${id}") {
            _id
            title
            content
            createdAt
            updatedAt
          }
        }
      `,
    };

    return await addEntity(query);
  };

  return { deleteMemo };
};
