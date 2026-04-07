import { useMutation } from "./mutation.utils";

export interface User {
  username: string;
}

export const useAddUser = () => {
  const { addEntity } = useMutation<User>("/api/users");
  const addUser = async (username: string) => addEntity({ username });
  return { addUser };
};