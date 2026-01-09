export interface User {
  username: string;
}

export const useAddUser = () => {
  const addUser = async (username: string) => {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to add user");
    }
    return response.json();
  };
  return { addUser };
};
