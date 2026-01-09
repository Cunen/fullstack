export const useMutation = <T>(endpoint: string) => {
  const addEntity = async (data: T) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to add entity to ${endpoint}`);
    }
    return response.json();
  };
  return { addEntity };
};
